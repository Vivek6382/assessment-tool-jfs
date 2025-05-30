document.addEventListener('DOMContentLoaded', function() {
	setupButtonListeners();
	initializeTimePicker();
	initializeCalendar();
	updateSystemTime();
	setInterval(updateSystemTime, 1000);
	setupCollapsibleSections();

	// Initialize with existing data
	initializeWithExistingData();

	// Setup disabled state based on assessment status
	setupDisabledStateBasedOnStatus();

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



function setupDisabledStateBasedOnStatus() {
	// Get assessment status from the body data attribute or hidden input
	const assessmentStatus = document.body.getAttribute('data-assessment-status') ||
		(document.getElementById('hiddenAssessmentStatus') ?
			document.getElementById('hiddenAssessmentStatus').value : null);

	// Statuses that should disable fields
	const readOnlyStatuses = ['active', 'frozen', 'inactive'];

	if (assessmentStatus && readOnlyStatuses.includes(assessmentStatus.toLowerCase())) {
		// Disable form elements
		const timeInput = document.getElementById('time-input');
		const dateInputs = document.querySelectorAll('.date-input');
		const activateBtn = document.querySelector('.btn-activate');
		const saveBtn = document.getElementById('save-time-settings');

		if (timeInput) {
			timeInput.style.pointerEvents = 'none';
			timeInput.classList.add('read-only-field');
			const timeDisplay = timeInput.querySelector('.time-display');
			if (timeDisplay) {
				timeDisplay.disabled = true;
				timeDisplay.classList.add('read-only-field');
			}
		}

		if (dateInputs) {
			dateInputs.forEach(input => {
				input.style.pointerEvents = 'none';
				const dateDisplay = input.querySelector('.date-display');
				if (dateDisplay) {
					dateDisplay.classList.add('read-only-field');
				}
			});
		}

		if (activateBtn) activateBtn.disabled = true;
		if (saveBtn) {
			saveBtn.disabled = true;
			saveBtn.classList.add('disabled-btn');
		}

		// Show tooltip or explanation for disabled state
		const explanation = document.createElement('div');
		explanation.className = 'alert alert-info mt-3';
		explanation.innerHTML = '<i class="bi bi-info-circle me-2"></i> These settings cannot be modified because the test status is ' + assessmentStatus;

		const formCard = document.querySelector('.card-body');
		if (formCard) {
			formCard.appendChild(explanation);
		}
	}
}


function initializeWithExistingData() {
	// Get assessment data from Thymeleaf model
	const assessmentData = JSON.parse(document.body.getAttribute('data-assessment') || '{}');

	// Set test duration if exists
	const timeDisplayInput = document.querySelector('.time-display');
	if (timeDisplayInput && assessmentData.duration) {
		timeDisplayInput.value = assessmentData.duration;
		updateSliderPositionsFromInput(assessmentData.duration);
	} else if (timeDisplayInput) {
		timeDisplayInput.value = '01:00';
		updateSliderPositionsFromInput('01:00');
	}

	// Set activation and closing dates if they exist
	if (assessmentData.startDate) {
		const activationDisplay = document.getElementById('date-display-0');
		if (activationDisplay) {
			activationDisplay.textContent = assessmentData.formattedStartDate;
			activationDisplay.dataset.timestamp = assessmentData.startDateTimestamp;
		}
	}

	if (assessmentData.endDate) {
		const closingDisplay = document.getElementById('date-display-1');
		if (closingDisplay) {
			closingDisplay.textContent = assessmentData.formattedEndDate;
			closingDisplay.dataset.timestamp = assessmentData.endDateTimestamp;
		}
	}
}

// ... rest of your existing JavaScript functions remain the same ...

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


function updateSystemTime() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	const systemTimeElement = document.getElementById('system-time');
	if (systemTimeElement) {
		systemTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
	}
}


function setupButtonListeners() {
	const timeInput = document.getElementById('time-input');
	const timePickerDropdown = document.getElementById('time-picker-dropdown');
	const timeDisplayInput = document.querySelector('.time-display');

	// Only add event listeners if the field is not disabled
	if (timeDisplayInput && !timeDisplayInput.disabled) {
		timeDisplayInput.addEventListener('input', function(e) {
			const value = e.target.value;

			// Allow backspacing through the entire input
			if (e.inputType === 'deleteContentBackward') {
				return;
			}

			// Auto-insert colon after 2 digits
			if (value.length === 2 && !value.includes(':')) {
				e.target.value = value + ':';
			}

			// Limit to 5 characters (HH:MM)
			if (value.length > 5) {
				e.target.value = value.substring(0, 5);
			}

			// Update slider positions when manually entering time
			if (value.length === 5 && value.includes(':')) {
				updateSliderPositionsFromInput(value);
			}
		});
	}

	if (timeInput && timePickerDropdown && !timeInput.classList.contains('read-only-field')) {
		timeInput.addEventListener('click', function(event) {
			event.stopPropagation();

			const inputRect = timeInput.getBoundingClientRect();
			timePickerDropdown.style.top = (inputRect.bottom + window.scrollY) + 'px';
			timePickerDropdown.style.left = (inputRect.left + window.scrollX) + 'px';

			timePickerDropdown.style.display = 'block';
			initializeHandlePositions();
		});
	}

	document.addEventListener('click', function(event) {
		if (timePickerDropdown && timePickerDropdown.style.display === 'block' &&
			!timePickerDropdown.contains(event.target) &&
			!event.target.closest('.time-input')) {
			timePickerDropdown.style.display = 'none';
		}

		const calendarModal = document.getElementById('calendar-modal');
		if (calendarModal && calendarModal.style.display === 'block' &&
			!calendarModal.contains(event.target) &&
			!event.target.closest('.date-input')) {
			calendarModal.style.display = 'none';
		}
	});

	const resetBtn = document.getElementById('reset-btn');
	if (resetBtn) {
		resetBtn.addEventListener('click', function() {
			resetTimer();
		});
	}

	const nowBtn = document.getElementById('now-btn');
	if (nowBtn) {
		nowBtn.addEventListener('click', function() {
			setTimePickerToNow();
		});
	}

	const confirmBtn = document.getElementById('confirm-btn');
	if (confirmBtn) {
		confirmBtn.addEventListener('click', function() {
			confirmTimer();
		});
	}

	const dateInputs = document.querySelectorAll('.date-input');
	const calendarModal = document.getElementById('calendar-modal');

	if (dateInputs.length && calendarModal) {
		dateInputs.forEach(function(dateInput) {
			// Only add event listeners if the date input is not disabled
			if (!dateInput.classList.contains('read-only-field')) {
				dateInput.addEventListener('click', function(event) {
					event.stopPropagation();

					const inputRect = dateInput.getBoundingClientRect();
					calendarModal.style.top = (inputRect.bottom + window.scrollY) + 'px';
					calendarModal.style.left = (inputRect.left + window.scrollX) + 'px';

					calendarModal.dataset.targetInput = dateInput.querySelector('.date-display').id ||
						dateInput.querySelector('.date-label').textContent;

					calendarModal.style.display = 'block';

					if (!calendarModal.dataset.selectedDate) {
						const now = new Date();
						setCalendarToDate(now);
						setTimeToNow();
					}
				});
			}
		});
	}

	const prevBtn = document.querySelector('.prev-btn');
	const nextBtn = document.querySelector('.next-btn');

	if (prevBtn && nextBtn) {
		prevBtn.addEventListener('click', function() {
			navigateMonth(-1);
		});

		nextBtn.addEventListener('click', function() {
			navigateMonth(1);
		});
	}

	const nowBtnCalendar = document.querySelector('.time-selector-buttons .btn-now');
	if (nowBtnCalendar) {
		nowBtnCalendar.addEventListener('click', function() {
			const now = new Date();
			now.setHours(now.getHours() - 1); // Subtract 1 hour for activation date
			setCalendarToDate(now);
			setTimeToNow();
		});
	}

	const calendarConfirmBtn = document.querySelector('.time-selector-buttons .btn-confirm');
	if (calendarConfirmBtn) {
		calendarConfirmBtn.addEventListener('click', function() {
			confirmDateTime();
		});
	}

	const calendarHoursHandle = document.getElementById('calendar-hours-handle');
	const calendarMinutesHandle = document.getElementById('calendar-minutes-handle');
	const calendarHoursSlider = document.querySelector('.time-field:first-child .hours-slider');
	const calendarMinutesSlider = document.querySelector('.time-field:last-child .minutes-slider');

	if (calendarHoursHandle && calendarHoursSlider) {
		initializeDraggable(calendarHoursHandle, calendarHoursSlider, 0, 23, updateSelectedTimeDisplay);
	}

	if (calendarMinutesHandle && calendarMinutesSlider) {
		initializeDraggable(calendarMinutesHandle, calendarMinutesSlider, 0, 59, updateSelectedTimeDisplay);
	}

	const dateDisplays = document.querySelectorAll('.date-display');
	dateDisplays.forEach(function(display, index) {
		if (!display.id) {
			display.id = `date-display-${index}`;
		}
	});

	const saveBtn = document.getElementById('save-time-settings');
	if (saveBtn) {
		saveBtn.addEventListener('click', function() {
			saveTimeSettings();
		});
	}
}

function saveTimeSettings() {
	console.log('Save button clicked - starting save process');

	var saveBtn = document.getElementById('save-time-settings');
	var originalBtnText = saveBtn.querySelector('.button-text').textContent;
	saveBtn.querySelector('.button-text').textContent = 'Saving...';
	saveBtn.disabled = true;

	// Try multiple ways to get assessment ID
	var assessmentId = document.body.getAttribute('data-assessment-id');
	if (!assessmentId || assessmentId === '${assessment.assessmentId}') {
		var hiddenAssessmentId = document.getElementById('hiddenAssessmentId');
		assessmentId = hiddenAssessmentId ? hiddenAssessmentId.value : null;
	}

	// Final check
	if (!assessmentId || isNaN(assessmentId)) {
		console.error('Invalid assessment ID:', assessmentId);
		showErrorMessage('No assessment selected. Please start from Basic Settings.');
		saveBtn.querySelector('.button-text').textContent = originalBtnText;
		saveBtn.disabled = false;

		// Redirect to Basic Settings after a delay
		setTimeout(function() {
			window.location.href = '/EducatorConfig/TestConfiguration/BasicSettings';
		}, 2000);
		return;
	}

	// Get test duration
	var timeDisplayInput = document.querySelector('.time-display');
	var duration = timeDisplayInput.value;
	console.log('Duration from input:', duration);

	// Get activation and closing dates
	var activationDisplay = document.getElementById('date-display-0');
	var closingDisplay = document.getElementById('date-display-1');

	if (!activationDisplay || !activationDisplay.dataset.timestamp ||
		!closingDisplay || !closingDisplay.dataset.timestamp) {
		var errorMsg = 'Missing date values in one or both date displays';
		console.error(errorMsg);
		showErrorMessage('Please select both activation and closing dates.');
		saveBtn.querySelector('.button-text').textContent = originalBtnText;
		saveBtn.disabled = false;
		return;
	}

	var startDate = new Date(parseInt(activationDisplay.dataset.timestamp));
	var endDate = new Date(parseInt(closingDisplay.dataset.timestamp));

	// Format dates in the exact format backend expects
	function formatDateForBackend(date) {
		// Format as "yyyy-MM-ddTHH:mm:ss" without timezone
		function pad(num) {
			return num.toString().padStart(2, '0');
		}
		return date.getFullYear() + '-' +
			pad(date.getMonth() + 1) + '-' +
			pad(date.getDate()) + 'T' +
			pad(date.getHours()) + ':' +
			pad(date.getMinutes()) + ':' +
			pad(date.getSeconds());
	}

	// Prepare the data to send
	var timeSettingsData = {
		duration: duration,
		startDate: formatDateForBackend(startDate),
		endDate: formatDateForBackend(endDate)
	};

	console.log('Full payload being sent:', JSON.stringify(timeSettingsData, null, 2));
	console.log('Endpoint:', '/EducatorConfig/TestConfiguration/SaveTimeSettings');

	// Call the service to save time settings
	fetch('/EducatorConfig/TestConfiguration/SaveTimeSettings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		},
		body: JSON.stringify(timeSettingsData)
	})
		.then(function(response) {
			console.log('Raw response:', response);
			if (!response.ok) {
				return response.json().then(function(err) {
					console.error('Server responded with error:', err);
					throw new Error(err.error || 'HTTP error! status: ' + response.status);
				});
			}
			return response.json();
		})
		.then(function(data) {
			console.log('Parsed response data:', data);
			if (data && data.success) {
				showSuccessMessage('Time settings saved successfully!');
				console.log('Save successful');
			} else {
				var errorMsg = data.error || 'Server responded with failure';
				console.error('Save failed:', errorMsg);
				showErrorMessage('Failed to save: ' + errorMsg);
			}
		})
		.catch(function(error) {
			console.error('Full error details:', error);
			console.error('Error stack:', error.stack);
			showErrorMessage('Save failed: ' + (error.message || 'Unknown error occurred'));
		})
		.finally(function() {
			saveBtn.querySelector('.button-text').textContent = originalBtnText;
			saveBtn.disabled = false;
		});
}



function updateSliderPositionsFromInput(timeString) {
	const [hoursStr, minutesStr] = timeString.split(':');
	const hours = parseInt(hoursStr, 10);
	const minutes = parseInt(minutesStr, 10);

	if (isNaN(hours)) return;
	if (isNaN(minutes)) return;

	const hoursHandle = document.getElementById('hours-handle');
	const minutesHandle = document.getElementById('minutes-handle');

	if (hoursHandle && minutesHandle) {
		const hoursPercentage = Math.min(100, Math.max(0, (hours / 23) * 100));
		const minutesPercentage = Math.min(100, Math.max(0, (minutes / 59) * 100));

		hoursHandle.style.left = `${hoursPercentage}%`;
		minutesHandle.style.left = `${minutesPercentage}%`;

		updateTimeDisplay();
	}
}

function setTimePickerToNow() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();

	const hoursHandle = document.getElementById('hours-handle');
	const minutesHandle = document.getElementById('minutes-handle');
	const hoursSlider = document.querySelector('.descriptions .hours-slider');
	const minutesSlider = document.querySelector('.descriptions .minutes-slider');

	if (hoursHandle && hoursSlider && minutesHandle && minutesSlider) {
		const hoursPercentage = (hours / 23) * 100;
		const minutesPercentage = (minutes / 59) * 100;

		hoursHandle.style.left = `${hoursPercentage}%`;
		minutesHandle.style.left = `${minutesPercentage}%`;

		updateTimeDisplay();
	}
}

function setCalendarToDate(date) {
	const calendarModal = document.getElementById('calendar-modal');
	if (!calendarModal) return;

	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	updateCalendarDisplay(month, year);

	setTimeout(function() {
		const dayElements = document.querySelectorAll('.calendar-day');
		dayElements.forEach(function(dayElement) {
			if (dayElement.textContent.trim() === String(day)) {
				dayElement.classList.add('selected');
			}
		});

		calendarModal.dataset.selectedDate = `${year}-${month + 1}-${day}`;
	}, 0);
}

function initializeTimePicker() {
	const hoursHandle = document.getElementById('hours-handle');
	const minutesHandle = document.getElementById('minutes-handle');
	const hoursSlider = document.querySelector('.descriptions .hours-slider');
	const minutesSlider = document.querySelector('.descriptions .minutes-slider');

	if (hoursHandle && hoursSlider) {
		initializeDraggable(hoursHandle, hoursSlider, 0, 23, updateTimeDisplay);
	}

	if (minutesHandle && minutesSlider) {
		initializeDraggable(minutesHandle, minutesSlider, 0, 59, updateTimeDisplay);
	}
}

function initializeHandlePositions() {
	const timeDisplayInput = document.querySelector('.time-display');
	let hours = 0, minutes = 0;

	if (timeDisplayInput && timeDisplayInput.value) {
		[hours, minutes] = timeDisplayInput.value.split(':').map(Number);
	}

	const hoursHandle = document.getElementById('hours-handle');
	const minutesHandle = document.getElementById('minutes-handle');

	if (hoursHandle) {
		const hoursPercentage = (hours / 23) * 100;
		hoursHandle.style.left = `${hoursPercentage}%`;
	}

	if (minutesHandle) {
		const minutesPercentage = (minutes / 59) * 100;
		minutesHandle.style.left = `${minutesPercentage}%`;
	}

	updateTimeDisplay();
}

function updateTimeDisplay() {
	const hoursHandle = document.getElementById('hours-handle');
	const minutesHandle = document.getElementById('minutes-handle');
	const hoursSlider = document.querySelector('.descriptions .hours-slider');
	const minutesSlider = document.querySelector('.descriptions .minutes-slider');
	const timePickerValue = document.querySelector('.time-picker-value');
	const timeDisplayInput = document.querySelector('.time-display');

	if (hoursHandle && minutesHandle && hoursSlider && minutesSlider && timePickerValue) {
		const hoursRect = hoursSlider.getBoundingClientRect();
		const minutesRect = minutesSlider.getBoundingClientRect();

		const hoursHandleRect = hoursHandle.getBoundingClientRect();
		const minutesHandleRect = minutesHandle.getBoundingClientRect();

		const hoursPercentage = ((hoursHandleRect.left - hoursRect.left + hoursHandle.offsetWidth / 2) / hoursRect.width);
		const minutesPercentage = ((minutesHandleRect.left - minutesRect.left + minutesHandle.offsetWidth / 2) / minutesRect.width);

		const hours = Math.min(23, Math.max(0, Math.floor(hoursPercentage * 24)));
		const minutes = Math.min(59, Math.max(0, Math.floor(minutesPercentage * 60)));

		const formattedTime = `${pad(hours)}:${pad(minutes)}`;
		timePickerValue.textContent = formattedTime;

		if (timeDisplayInput) {
			timeDisplayInput.value = formattedTime;
		}
	}
}

function resetTimer() {
	const hoursHandle = document.getElementById('hours-handle');
	const minutesHandle = document.getElementById('minutes-handle');
	const timeDisplayInput = document.querySelector('.time-display');

	if (hoursHandle && minutesHandle) {
		hoursHandle.style.left = '0%';
		minutesHandle.style.left = '0%';
		updateTimeDisplay();
	}

	if (timeDisplayInput) {
		timeDisplayInput.value = '00:00';
	}
}

function confirmTimer() {
	const timePickerDropdown = document.getElementById('time-picker-dropdown');
	if (timePickerDropdown) {
		timePickerDropdown.style.display = 'none';
	}
}

function initializeCalendar() {
	const now = new Date();
	updateCalendarDisplay(now.getMonth(), now.getFullYear());
}

function updateCalendarDisplay(month, year) {
	const calendarMonth = document.querySelector('.calendar-month');
	const calendarDays = document.getElementById('calendar-days');

	if (!calendarMonth || !calendarDays) return;

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];
	calendarMonth.textContent = `${monthNames[month]} ${year}`;

	calendarDays.innerHTML = '';

	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	let firstDayOfWeek = firstDay.getDay() - 1;
	if (firstDayOfWeek < 0) firstDayOfWeek = 6;

	for (let i = 0; i < firstDayOfWeek; i++) {
		const emptyCell = document.createElement('div');
		calendarDays.appendChild(emptyCell);
	}

	for (let day = 1; day <= lastDay.getDate(); day++) {
		const dayCell = document.createElement('div');
		dayCell.className = 'calendar-day';

		const daySpan = document.createElement('span');
		daySpan.textContent = day;
		dayCell.appendChild(daySpan);

		dayCell.addEventListener('click', function() {
			document.querySelectorAll('.calendar-day').forEach(function(cell) {
				cell.classList.remove('selected');
			});

			dayCell.classList.add('selected');

			const calendarModal = document.getElementById('calendar-modal');
			calendarModal.dataset.selectedDate = `${year}-${month + 1}-${day}`;
		});

		calendarDays.appendChild(dayCell);
	}
}

function navigateMonth(delta) {
	const calendarMonth = document.querySelector('.calendar-month');
	if (!calendarMonth) return;

	const [monthName, year] = calendarMonth.textContent.split(' ');
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'];
	let month = monthNames.indexOf(monthName);
	let yearNum = parseInt(year);

	month += delta;
	if (month < 0) {
		month = 11;
		yearNum--;
	} else if (month > 11) {
		month = 0;
		yearNum++;
	}

	updateCalendarDisplay(month, yearNum);
}

function setTimeToNow() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();

	const calendarHoursHandle = document.getElementById('calendar-hours-handle');
	const calendarMinutesHandle = document.getElementById('calendar-minutes-handle');
	const calendarHoursSlider = document.querySelector('.time-field:first-child .hours-slider');
	const calendarMinutesSlider = document.querySelector('.time-field:last-child .minutes-slider');

	if (calendarHoursHandle && calendarHoursSlider && calendarMinutesHandle && calendarMinutesSlider) {
		const hoursPercentage = (hours / 23) * 100;
		const minutesPercentage = (minutes / 59) * 100;

		calendarHoursHandle.style.left = `${hoursPercentage}%`;
		calendarMinutesHandle.style.left = `${minutesPercentage}%`;

		updateSelectedTimeDisplay();
	}
}

function updateSelectedTimeDisplay() {
	const calendarHoursHandle = document.getElementById('calendar-hours-handle');
	const calendarMinutesHandle = document.getElementById('calendar-minutes-handle');
	const calendarHoursSlider = document.querySelector('.time-field:first-child .hours-slider');
	const calendarMinutesSlider = document.querySelector('.time-field:last-child .minutes-slider');
	const timeDisplay = document.querySelector('.selected-time-display');

	if (calendarHoursHandle && calendarMinutesHandle && calendarHoursSlider && calendarMinutesSlider && timeDisplay) {
		const hoursRect = calendarHoursSlider.getBoundingClientRect();
		const minutesRect = calendarMinutesSlider.getBoundingClientRect();

		const hoursHandleRect = calendarHoursHandle.getBoundingClientRect();
		const minutesHandleRect = calendarMinutesHandle.getBoundingClientRect();

		const hoursPercentage = ((hoursHandleRect.left - hoursRect.left + calendarHoursHandle.offsetWidth / 2) / hoursRect.width);
		const minutesPercentage = ((minutesHandleRect.left - minutesRect.left + calendarMinutesHandle.offsetWidth / 2) / minutesRect.width);

		const hours = Math.min(23, Math.max(0, Math.floor(hoursPercentage * 24)));
		const minutes = Math.min(59, Math.max(0, Math.floor(minutesPercentage * 60)));

		timeDisplay.textContent = `${pad(hours)}:${pad(minutes)}`;
	}
}

function confirmDateTime() {
	const calendarModal = document.getElementById('calendar-modal');
	if (!calendarModal) return;

	const selectedDate = calendarModal.dataset.selectedDate;
	const targetInput = calendarModal.dataset.targetInput;
	const selectedTime = document.querySelector('.selected-time-display').textContent;

	if (selectedDate) {
		const [year, month, day] = selectedDate.split('-').map(Number);
		const date = new Date(year, month - 1, day);

		// Format date in 12-hour format with AM/PM
		const [hours, minutes] = selectedTime.split(':').map(Number);
		let period = 'AM';
		let displayHours = hours;

		if (hours >= 12) {
			period = 'PM';
			displayHours = hours > 12 ? hours - 12 : hours;
		}
		displayHours = displayHours === 0 ? 12 : displayHours;

		const formattedTime = `${pad(displayHours)}:${pad(minutes)} ${period}`;
		const formattedDate = formatDate(date);

		document.querySelectorAll('.date-input').forEach(function(input) {
			const label = input.querySelector('.date-label').textContent;
			const display = input.querySelector('.date-display');

			if (label === targetInput || display.id === targetInput) {
				display.textContent = `${formattedDate} ${formattedTime}`;
				date.setHours(hours, minutes, 0, 0);
				display.dataset.timestamp = date.getTime().toString();
			}
		});
	}

	calendarModal.style.display = 'none';
}

function formatDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

function initializeDraggable(handle, slider, min, max, callback) {
	let isDragging = false;

	handle.addEventListener('mousedown', startDrag);
	handle.addEventListener('touchstart', startDrag, { passive: false });

	function startDrag(e) {
		e.preventDefault();
		isDragging = true;

		document.addEventListener('mousemove', drag);
		document.addEventListener('touchmove', drag, { passive: false });
		document.addEventListener('mouseup', stopDrag);
		document.addEventListener('touchend', stopDrag);
	}

	function drag(e) {
		if (!isDragging) return;

		let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
		const rect = slider.getBoundingClientRect();
		let position = clientX - rect.left;

		position = Math.max(0, Math.min(position, rect.width));
		const percentage = (position / rect.width) * 100;
		handle.style.left = `${percentage}%`;

		if (callback) callback();
	}

	function stopDrag() {
		isDragging = false;
		document.removeEventListener('mousemove', drag);
		document.removeEventListener('touchmove', drag);
		document.removeEventListener('mouseup', stopDrag);
		document.removeEventListener('touchend', stopDrag);
	}
}

function pad(value) {
	return String(value).padStart(2, '0');
}

function setupCollapsibleSections() {
	const sectionHeaders = document.querySelectorAll('.sidebar-section-header');

	sectionHeaders.forEach(function(header) {
		header.addEventListener('click', function() {
			const toggleIcon = this.querySelector('.toggle-icon');
			const nextElement = this.nextElementSibling.nextElementSibling;

			if (nextElement && nextElement.classList.contains('collapsible-section')) {
				nextElement.classList.toggle('collapsed');
				toggleIcon.classList.toggle('collapsed');
			}
		});
	});

	const progressResultsHeader = document.querySelectorAll('.sidebar-section-header')[1];
	if (progressResultsHeader) {
		progressResultsHeader.addEventListener('click', function() {
			const collapseSection = this.nextElementSibling;
			collapseSection.classList.toggle('collapsed');
			const toggleIcon = this.querySelector('.toggle-icon');
			toggleIcon.classList.toggle('collapsed');
		});
	}
}