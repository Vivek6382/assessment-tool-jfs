// TestStartPage.js - Complete implementation

// Global variable to track TinyMCE initialization status
let isTinyMCEInitialized = false;

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	// Load assessment data first
	loadAssessmentData();

	// Set up event listeners
	setupEventListeners();

	// Handle responsive layout
	handleResponsiveLayout();

	// Listen for window resize events
	window.addEventListener('resize', handleResponsiveLayout);



	// Initialize activation button - should be last
	initActivationButton();


	calculateAndDisplayProgress();

	// Also update when coming back from other tabs
	window.addEventListener('focus', calculateAndDisplayProgress);


	// Add this line
	updateStatusBadge();

});


// Add this function to your BasicSettings.js
function updateStatusBadge() {
	const assessmentId = document.body.getAttribute('data-assessment-id') ||
		(document.getElementById('hiddenAssessmentId') ? document.getElementById('hiddenAssessmentId').value : null) ||
		(document.getElementById('assessment-id') ? document.getElementById('assessment-id').value : null);

	if (!assessmentId) {
		// No assessment yet - show default draft state
		const badge = document.querySelector('.setup-badge');
		if (badge) {
			badge.className = 'setup-badge draft d-inline-block mb-3';
			badge.textContent = 'SETUP IN PROGRESS';
		}
		return;
	}

	// Fetch test info
	fetch('/EducatorConfig/TestInfo/GetTestInfo?assessmentId=' + assessmentId)
		.then(response => response.json())
		.then(data => {
			if (data && data.success) {
				const assessmentStatus = (
					(data.assessment && data.assessment.assessmentStatus && data.assessment.assessmentStatus.toLowerCase())
					|| 'draft'
				);
				const badge = document.querySelector('.setup-badge');

				if (badge) {
					// Reset classes
					badge.className = 'setup-badge d-inline-block mb-3';

					// Add status-specific class and text
					badge.classList.add(assessmentStatus);

					switch (assessmentStatus) {
						case 'draft':
							badge.textContent = 'SETUP IN PROGRESS';
							break;
						case 'active':
							badge.textContent = 'ACTIVE';
							break;
						case 'frozen':
							badge.textContent = 'FROZEN';
							break;
						case 'inactive':
							badge.textContent = 'INACTIVE';
							break;
						default:
							badge.textContent = 'SETUP IN PROGRESS';
					}
				}
			}
		})
		.catch(error => {
			console.error('Error fetching assessment status:', error);
		});
}



//Standalone Progress bar

// Progress calculation and display - Add this to all tab JS files
function calculateAndDisplayProgress() {
	// Get assessment ID from wherever it's stored
	const assessmentId = document.body.getAttribute('data-assessment-id') ||
		(document.getElementById('hiddenAssessmentId') ? document.getElementById('hiddenAssessmentId').value : null) ||
		(document.getElementById('assessment-id') ? document.getElementById('assessment-id').value : null);

	if (!assessmentId) {
		// No assessment yet - show 0%
		updateProgressBar(0);
		return;
	}

	// Fetch test info which contains all completion data
	fetch('/EducatorConfig/TestInfo/GetTestInfo?assessmentId=' + assessmentId)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			if (data.success) {
				const completion = calculateCompletionPercentage(data);
				updateProgressBar(completion);
			} else {
				console.error('Error fetching test info:', data.error);
				updateProgressBar(0);
			}
		})
		.catch(function(error) {
			console.error('Error calculating progress:', error);
			updateProgressBar(0);
		});
}

function calculateCompletionPercentage(testInfo) {
	if (!testInfo || !testInfo.assessment) return 0;

	const assessment = testInfo.assessment;
	const questionCount = testInfo.questionCount || 0;

	// If test is active, it's 100% complete
	if (assessment.assessmentStatus === 'active') {
		return 100;
	}

	// Calculate completion based on configured items with proper weightings
	let completion = 0;

	// 1. Basic Settings (20%) - title + category
	if (assessment.assessmentTitle && assessment.assessmentTitle !== "New test") {
		completion += 10; // 10% for title
	}
	if (assessment.moduleId) {
		completion += 10; // 10% for category
	}

	// 2. Questions (20%)
	if (questionCount > 0) completion += 20;

	// 3. Test Sets (15%) - question order
	if (assessment.questionOrder) completion += 15;

	// 4. Test Start Page (15%) - instruction text
	if (assessment.instructionText) completion += 15;

	// 5. Grading & Summary (15%) - passing score
	if (assessment.assessmentPassingScore !== null && assessment.passingScoreUnit) completion += 15;

	// 6. Time Settings (15%) - dates
	if (assessment.startDate && assessment.endDate) completion += 15;

	// Ensure we don't exceed 100%
	return Math.min(Math.round(completion), 100);
}

function updateProgressBar(percentage) {
	const progressSection = document.querySelector('.progress-section');
	const progressBar = document.querySelector('.progress-bar');

	if (!progressSection || !progressBar) return;

	// Update percentage text
	const percentageSpan = progressSection.querySelector('span');
	if (percentageSpan) {
		percentageSpan.textContent = `${percentage}% completed`;
	}

	// Update progress bar width
	progressBar.style.width = `${percentage}%`;

	// Update progress bar color class
	progressBar.classList.remove('low', 'medium', 'high', 'complete');

	if (percentage < 30) {
		progressBar.classList.add('low');
	} else if (percentage < 80) {
		progressBar.classList.add('medium');
	} else if (percentage < 100) {
		progressBar.classList.add('high');
	} else {
		progressBar.classList.add('complete');
	}
}



// STANDALONE ACTIVATION HANDLER - COPY THIS TO ALL PAGES
// STANDALONE ACTIVATION HANDLER - UPDATED FOR BASIC SETTINGS
function initActivationButton() {
	var activateBtn = document.querySelector('.btn-activate');
	if (activateBtn) {
		activateBtn.addEventListener('click', function(e) {
			e.preventDefault();

			// Store original button content
			var originalContent = activateBtn.innerHTML;
			var originalClass = activateBtn.className;

			// Show loading state
			activateBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Activating...';
			activateBtn.className = 'btn btn-activate activating w-100 mt-3';
			activateBtn.disabled = true;

			// Get assessment ID - updated to check multiple locations
			var assessmentId = document.body.getAttribute('data-assessment-id') ||
				(document.getElementById('hiddenAssessmentId') ? document.getElementById('hiddenAssessmentId').value : null) ||
				(document.getElementById('assessment-id') ? document.getElementById('assessment-id').value : null);

			if (!assessmentId) {
				showErrorMessage('Please save the test first before activating.');
				// Reset button state
				setTimeout(function() {
					activateBtn.innerHTML = originalContent;
					activateBtn.className = originalClass;
					activateBtn.disabled = false;
				}, 2000);
				return;
			}

			// Simulate API call with timeout
			setTimeout(function() {
				// Remove loading state
				activateBtn.classList.remove('activating');

				// Show success message
				showSuccessMessage('Test activated successfully!');

				// Redirect to Test Info page after a short delay
				setTimeout(function() {
					window.location.href = '/EducatorConfig/TestConfiguration/TestInfo?assessmentId=' + assessmentId;
				}, 1500);

			}, 2000); // Simulated 2 second API call
		});
	}
}

function showSuccessMessage(message) {
	console.log('Showing success message:', message);
	var alertDiv = document.createElement('div');
	alertDiv.className = 'alert alert-success alert-dismissible fade show';
	alertDiv.style.position = 'fixed';
	alertDiv.style.top = '20px';
	alertDiv.style.right = '20px';
	alertDiv.style.zIndex = '9999';
	alertDiv.innerHTML = message +
		'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

	document.body.appendChild(alertDiv);

	// Auto-dismiss after 3 seconds
	setTimeout(function() {
		alertDiv.classList.remove('show');
		setTimeout(function() { alertDiv.remove(); }, 150);
	}, 3000);
}

function showErrorMessage(message) {
	console.log('Showing error message:', message);
	var alertDiv = document.createElement('div');
	alertDiv.className = 'alert alert-danger alert-dismissible fade show';
	alertDiv.style.position = 'fixed';
	alertDiv.style.top = '20px';
	alertDiv.style.right = '20px';
	alertDiv.style.zIndex = '9999';
	alertDiv.innerHTML = message +
		'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

	document.body.appendChild(alertDiv);

	// Auto-dismiss after 5 seconds
	setTimeout(function() {
		alertDiv.classList.remove('show');
		setTimeout(function() { alertDiv.remove(); }, 150);
	}, 5000);
}



// Set up all event listeners
function setupEventListeners() {
	// Time limit toggle
	const timeToggle = document.getElementById('instruction-time-toggle');
	if (timeToggle) {
		timeToggle.addEventListener('change', function() {
			document.getElementById('time-limit-section').style.display =
				this.checked ? 'flex' : 'none';
		});
	}

	// Time value validation
	const timeValueInput = document.getElementById('instruction-time-value');
	if (timeValueInput) {
		timeValueInput.addEventListener('change', function() {
			if (this.value < 1) this.value = 1;
		});
	}

	// Save button
	const saveBtn = document.querySelector('.btn-success');
	if (saveBtn) {
		saveBtn.addEventListener('click', saveInstructions);
	}
}

// Initialize TinyMCE editor
function initializeTinyMCE() {
	if (isTinyMCEInitialized || !document.getElementById('tinymce-editor')) {
		return;
	}

	tinymce.init({
		selector: '#tinymce-editor',
		menubar: false,
		inline: false,
		min_height: 120,
		max_height: 400,
		statusbar: false,
		resize: true,
		plugins: [
			'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
			'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
			'table', 'emoticons', 'help', 'textcolor', 'subscript', 'superscript', 'specialchar'
		],
		toolbar: 'undo redo | blocks fontfamily fontsize | ' +
			'bold italic underline strikethrough | ' +
			'alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist outdent indent | link image media | ' +
			'forecolor backcolor | specialchar emoticons | help',
		content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15px; color:#0f2830; margin: 8px; }',
		setup: function(editor) {
			editor.on('input', function() {
				updateCharacterCount(editor);
			});
		},
		file_picker_callback: function(callback, value, meta) {
			handleFilePicker(callback, meta);
		},
		mobile: {
			theme: 'mobile',
			plugins: ['autosave', 'lists', 'autolink'],
			toolbar: ['bold', 'italic', 'underline', 'bullist', 'numlist']
		},
		init_instance_callback: function(editor) {
			isTinyMCEInitialized = true;
			updateCharacterCount(editor);

			// Check if we have assessment data to load
			if (window.currentAssessmentData && window.currentAssessmentData.instructionText) {
				editor.setContent(window.currentAssessmentData.instructionText);
				updateCharacterCount(editor);
			}
		}
	});
}

// Update character count
function updateCharacterCount(editor) {
	if (!editor) return;
	const text = editor.getContent({ format: 'text' });
	const count = text.length;
	const charCountElement = document.getElementById('char-count');
	if (charCountElement) {
		charCountElement.textContent = `${count} / 1000`;
	}
}

// Handle file picker for TinyMCE
function handleFilePicker(callback, meta) {
	const input = document.createElement('input');
	input.setAttribute('type', 'file');
	input.setAttribute('accept', meta.filetype === 'image' ? 'image/*' : 'video/*');

	input.onchange = function() {
		const file = this.files[0];
		const reader = new FileReader();

		reader.onload = function() {
			callback(reader.result, { alt: file.name });
		};

		reader.readAsDataURL(file);
	};

	input.click();
}

// Load assessment data from server
function loadAssessmentData() {
	const assessmentId = document.body.getAttribute('data-assessment-id');
	if (!assessmentId) {
		console.error('No assessment ID found');
		return;
	}

	fetch(`/EducatorConfig/TestConfiguration/GetAssessmentById?assessmentId=${assessmentId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			if (data.success) {
				// Store the assessment data globally
				window.currentAssessmentData = data;

				// Populate time settings
				populateTimeSettings(data);

				// Initialize TinyMCE if not already initialized
				if (!isTinyMCEInitialized) {
					initializeTinyMCE();
				} else {
					// If TinyMCE is already initialized, set content directly
					const editor = tinymce.get('tinymce-editor');
					if (editor && data.instructionText) {
						editor.setContent(data.instructionText);
						updateCharacterCount(editor);
					}
				}
			} else {
				showToast('Failed to load assessment data: ' + (data.error || 'Unknown error'), 'error');
			}
		})
		.catch(error => {
			console.error('Error loading assessment data:', error);
			showToast('Error loading assessment data: ' + error.message, 'error');
		});
}

// Populate time settings
function populateTimeSettings(data) {
	const hasTimeLimit = data.hasInstructionTime || false;
	const timeToggle = document.getElementById('instruction-time-toggle');
	const timeSection = document.getElementById('time-limit-section');

	if (timeToggle && timeSection) {
		timeToggle.checked = hasTimeLimit;
		timeSection.style.display = hasTimeLimit ? 'flex' : 'none';

		if (hasTimeLimit && data.instructionTimeSeconds) {
			const seconds = data.instructionTimeSeconds;
			const timeValueInput = document.getElementById('instruction-time-value');
			const timeUnitSelect = document.getElementById('instruction-time-unit');

			if (timeValueInput && timeUnitSelect) {
				if (seconds >= 60) {
					timeValueInput.value = Math.floor(seconds / 60);
					timeUnitSelect.value = 'minutes';
				} else {
					timeValueInput.value = seconds;
					timeUnitSelect.value = 'seconds';
				}
			}
		}
	}
}

// Save instructions to server
function saveInstructions() {
	const assessmentId = document.body.getAttribute('data-assessment-id');
	if (!assessmentId) {
		showToast('No assessment selected', 'error');
		return;
	}

	// Get form data
	const formData = getFormData();

	// Validate
	if (!formData.instructionText) {
		showToast('Please enter instructions', 'error');
		return;
	}

	// Show loading state
	const saveBtn = document.querySelector('.btn-success');
	saveBtn.disabled = true;
	saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

	// Send to server
	fetch('/EducatorConfig/TestConfiguration/SaveTestStartSettings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData)
	})
		.then(response => {
			if (!response.ok) throw new Error('Network response was not ok');
			return response.json();
		})
		.then(data => {
			if (data.success) {
				showToast('Settings saved successfully', 'success');
			} else {
				showToast(data.error || 'Error saving settings', 'error');
			}
		})
		.catch(error => {
			console.error('Error saving settings:', error);
			showToast('Error saving settings: ' + error.message, 'error');
		})
		.finally(() => {
			saveBtn.disabled = false;
			saveBtn.textContent = 'Save';
		});
}

// Get form data as object
function getFormData() {
	const timeEnabled = document.getElementById('instruction-time-toggle') ?
		document.getElementById('instruction-time-toggle').checked : false;
	const timeValue = document.getElementById('instruction-time-value') ?
		parseInt(document.getElementById('instruction-time-value').value) || 0 : 0;
	const timeUnit = document.getElementById('instruction-time-unit') ?
		document.getElementById('instruction-time-unit').value : 'minutes';

	// Convert time to seconds
	let timeSeconds = 0;
	if (timeEnabled && timeValue > 0) {
		timeSeconds = timeUnit === 'minutes' ? timeValue * 60 : timeValue;
	}

	// Get TinyMCE content safely
	let instructionText = '';
	const editor = tinymce.get('tinymce-editor');
	if (editor) {
		instructionText = editor.getContent();
	}

	return {
		instructionText: instructionText,
		hasInstructionTime: timeEnabled,
		instructionTimeSeconds: timeSeconds
	};
}

// Show toast notification
function showToast(message, type) {
	// Create toast container if it doesn't exist
	let container = document.getElementById('toast-container');
	if (!container) {
		container = document.createElement('div');
		container.id = 'toast-container';
		container.style.position = 'fixed';
		container.style.top = '20px';
		container.style.right = '20px';
		container.style.zIndex = '9999';
		document.body.appendChild(container);
	}

	// Create toast
	const toast = document.createElement('div');
	toast.className = `toast show align-items-center text-white bg-${type}`;
	toast.role = 'alert';
	toast.setAttribute('aria-live', 'assertive');
	toast.setAttribute('aria-atomic', 'true');

	toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

	container.appendChild(toast);

	// Auto-remove after 5 seconds
	setTimeout(() => {
		toast.remove();
	}, 5000);
}

// Handle responsive layout changes
function handleResponsiveLayout() {
	const isMobile = window.innerWidth < 768;
	const timeSettingRows = document.querySelectorAll('.time-setting-row');

	timeSettingRows.forEach(row => {
		if (isMobile) {
			row.classList.add('mobile-layout');
		} else {
			row.classList.remove('mobile-layout');
		}
	});
}