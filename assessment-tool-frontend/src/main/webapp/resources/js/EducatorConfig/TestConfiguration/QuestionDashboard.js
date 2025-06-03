// QuestionDashboard.js - Improved implementation for dynamic question loading

document.addEventListener('DOMContentLoaded', function() {
	console.log('Document loaded, initializing dashboard...');

	// Set up event listeners
	setupButtonListeners();
	setupQuestionCheckboxes();
	setupSearch();

	// Load questions from backend
	loadQuestions();


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



// Set up button event listeners
function setupButtonListeners() {
	const addQuestionBtn = document.getElementById('add-question-btn');
	if (addQuestionBtn) {
		addQuestionBtn.addEventListener('click', function() {
			window.location.href = '/EducatorConfig/TestConfiguration/QuestionManager';
		});
	}
}




// Load questions from backend
// Update loadQuestions function
function loadQuestions() {
	console.log('Fetching questions...');
	fetch('/EducatorConfig/TestConfiguration/GetAllQuestions')
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok: ' + response.status);
			}
			return response.json();
		})
		.then(data => {
			console.log('Questions data received:', data);
			if (data.success) {
				// Check if we have questions array
				if (data.questions && Array.isArray(data.questions)) {
					if (data.questions.length > 0) {
						displayQuestions(data.questions);

						// Store question count for numbering
						sessionStorage.setItem('questionCount', data.questions.length + 1);

						// Check assessment status
						if (data.assessmentStatus && data.assessmentStatus !== 'draft') {
							disableEditing();
						}
					} else {
						displayNoQuestionsMessage();
					}
				} else {
					displayError('Invalid questions data format');
				}
			} else {
				const errorMsg = data.error || 'Unknown error occurred';
				console.error('Failed to load questions:', errorMsg);
				displayError('Failed to load questions: ' + errorMsg);
			}
		})
		.catch(error => {
			console.error('Error loading questions:', error);
			displayError('Error connecting to server: ' + error.message);
		});
}



// Display questions in the UI
function displayQuestions(questions) {
	const questionsContainer = document.querySelector('.questions-list');
	if (!questionsContainer) {
		console.error('Questions container not found');
		return;
	}

	// Find header and pagination elements
	const header = questionsContainer.querySelector('.card.mb-3');
	const pagination = questionsContainer.querySelector('.d-flex.justify-content-between.align-items-center.mt-4');

	// Remove any existing question cards (but keep header and pagination)
	Array.from(questionsContainer.children).forEach(child => {
		if (child !== header && child !== pagination) {
			child.remove();
		}
	});

	// Sort questions by ID
	questions.sort((a, b) => a.questionId - b.questionId);

	// Render each question
	questions.forEach((question, index) => {
		const questionElement = createQuestionElement(question, index + 1);

		// Insert question element before pagination
		if (pagination) {
			questionsContainer.insertBefore(questionElement, pagination);
		} else {
			questionsContainer.appendChild(questionElement);
		}
	});

	// Update question count
	updateQuestionCount(questions.length);

	// Setup delete actions for new elements
	setupDropdownActions();
}


function displayNoQuestionsMessage() {
	const questionsContainer = document.querySelector('.questions-list');
	if (!questionsContainer) return;

	const header = questionsContainer.querySelector('.card.mb-3');
	const pagination = questionsContainer.querySelector('.d-flex.justify-content-between.align-items-center.mt-4');

	// Create message element
	const messageDiv = document.createElement('div');
	messageDiv.className = 'alert alert-info mt-3';
	messageDiv.innerHTML = `
        <i class="bi bi-info-circle me-2"></i>
        No questions found for this assessment. Click "Add Question" to create one.
    `;

	// Insert after header
	if (header && header.nextSibling) {
		questionsContainer.insertBefore(messageDiv, header.nextSibling);
	} else if (pagination) {
		questionsContainer.insertBefore(messageDiv, pagination);
	} else {
		questionsContainer.appendChild(messageDiv);
	}

	// Update question count display
	updateQuestionCount(0);
}


function disableEditing() {
	// Disable add question button
	const addBtn = document.getElementById('add-question-btn');
	if (addBtn) {
		addBtn.disabled = true;
		addBtn.classList.add('disabled');
		addBtn.innerHTML = '<i class="bi bi-lock me-2"></i>Add Question (Disabled)';
	}

	// Add warning message
	const warningDiv = document.createElement('div');
	warningDiv.className = 'alert alert-warning mt-3';
	warningDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>
        You cannot edit questions if you have already activated the test. 
        Duplicate the test on the "My tests" page to edit questions.
    `;

	const questionsContainer = document.querySelector('.questions-list');
	questionsContainer.insertBefore(warningDiv, questionsContainer.firstChild);

	// Disable all action dropdowns
	document.querySelectorAll('.dropdown-menu').forEach(menu => {
		menu.querySelectorAll('.dropdown-item').forEach(item => {
			if (item.classList.contains('delete-question') || item.innerHTML.includes('Edit')) {
				item.classList.add('disabled');
				item.style.pointerEvents = 'none';
				item.style.opacity = '0.5';
			}
		});
	});
}



// Create HTML element for a question
function createQuestionElement(question, index) {
	console.log('Creating element for question:', question.questionId);
	const div = document.createElement('div');
	div.className = 'question-item card mb-3';
	div.dataset.questionId = question.questionId;

	// Get question type name
	const questionTypeName = question.questionType ? question.questionType.questionTypeName : 'Unknown';

	// Start with common header
	let innerHtml = `
        <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <div class="form-check me-2">
                        <input class="form-check-input question-checkbox" type="checkbox">
                    </div>
                    <span class="badge bg-dark me-3">Q. ${index}</span>
                </div>
                <div class="question-details d-flex align-items-center">
                    <span class="badge bg-info me-3">GENERIC</span>
                    <div class="d-flex align-items-center me-3">
                        <span class="text-muted me-2">Type:</span>
                        <span>${questionTypeName}</span>
                    </div>
                    <div class="vertical-divider"></div>
                    <div class="d-flex align-items-center">
                        <span class="text-muted me-2">Points:</span>
                        <span>${question.questionMarks || 1}</span>
                    </div>
                    <div class="dropdown ms-3">
                        <button class="btn btn-sm btn-light dropdown-toggle-dots" type="button" id="questionActions${question.questionId}" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="questionActions${question.questionId}">
                            <li><a class="dropdown-item" href="/EducatorConfig/TestConfiguration/QuestionManager?questionId=${question.questionId}"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                            <li><a class="dropdown-item text-danger delete-question" href="#" data-question-id="${question.questionId}"><i class="bi bi-trash me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <p class="question-text mb-3">${question.questionText}</p>
    `;

	// Add specific content based on question type
	switch (questionTypeName) {
		case "Single Choice":
			innerHtml += createSingleChoiceOptions(question);
			break;
		case "Multiple Choice":
			innerHtml += createMultipleChoiceOptions(question);
			break;
		case "True/False":
			innerHtml += createTrueFalseOptions(question);
			break;
		case "Short Answer":
			innerHtml += createShortAnswerSection(question);
			break;
		case "Essay":
		case "Descriptive":
			innerHtml += createEssaySection(question);
			break;
		default:
			innerHtml += '<div class="alert alert-warning">Unsupported question type</div>';
	}

	innerHtml += `</div>`;
	div.innerHTML = innerHtml;

	return div;
}

// Create single choice options HTML
function createSingleChoiceOptions(question) {
	let html = '<div class="options-list">';

	if (question.options && question.options.length > 0) {
		question.options.forEach(option => {
			const isCorrect = option.isCorrect || false;
			const optionClass = isCorrect ? 'option p-2 mb-2 rounded d-flex align-items-center option-correct' : 'option p-2 mb-2 rounded d-flex align-items-center';
			const radioClass = isCorrect ? 'radio-circle radio-selected' : 'radio-circle';

			html += `
                <div class="${optionClass}">
                    <div class="option-selector me-2">
                        <div class="${radioClass}"></div>
                    </div>
                    <span>${option.optionText}</span>
                </div>
            `;
		});
	}

	html += '</div>';
	return html;
}

// Create multiple choice options HTML
function createMultipleChoiceOptions(question) {
	let html = '<div class="options-list">';

	if (question.options && question.options.length > 0) {
		question.options.forEach(option => {
			const isCorrect = option.isCorrect || false;
			const optionClass = isCorrect ? 'option p-2 mb-2 rounded d-flex align-items-center option-correct' : 'option p-2 mb-2 rounded d-flex align-items-center';
			const checkboxClass = isCorrect ? 'checkbox-square checkbox-selected' : 'checkbox-square';

			html += `
                <div class="${optionClass}">
                    <div class="option-selector me-2">
                        <div class="${checkboxClass}"></div>
                    </div>
                    <span>${option.optionText}</span>
                </div>
            `;
		});
	}

	html += '</div>';
	return html;
}

// Create true/false options HTML
function createTrueFalseOptions(question) {
	// Find which option is correct
	const trueIsCorrect = question.options && question.options.find(o => o.optionText.includes('True') && o.isCorrect);
	const falseIsCorrect = question.options && question.options.find(o => o.optionText.includes('False') && o.isCorrect);

	return `
        <div class="options-list">
            <div class="option p-2 mb-2 rounded d-flex align-items-center ${trueIsCorrect ? 'option-correct' : ''}">
                <div class="option-selector me-2">
                    <div class="radio-circle ${trueIsCorrect ? 'radio-selected' : ''}"></div>
                </div>
                <span>True</span>
            </div>
            <div class="option p-2 rounded d-flex align-items-center ${falseIsCorrect ? 'option-correct' : ''}">
                <div class="option-selector me-2">
                    <div class="radio-circle ${falseIsCorrect ? 'radio-selected' : ''}"></div>
                </div>
                <span>False</span>
            </div>
        </div>
    `;
}

// Create short answer section HTML
// Update the createShortAnswerSection function
function createShortAnswerSection(question) {
	let html = `
        <div class="short-answer-section">
            <div class="d-flex align-items-center mb-2">
                <span class="text-muted">${question.requiresManualGrading ? 'Manual Grading Required' : 'Possible answers'}</span>
                ${question.requiresManualGrading ? '<span class="badge bg-warning ms-2">Manual Grading</span>' : ''}
            </div>
            <div class="row">
    `;

	if (question.requiresManualGrading) {
		html += `
            <div class="col-12">
                <div class="alert alert-info mb-0">This question requires manual grading</div>
            </div>
        `;
	} else if (question.options && question.options.length > 0 && question.options[0].answers && question.options[0].answers.length > 0) {
		question.options[0].answers.forEach(answer => {
			html += `
                <div class="col-md-6 mb-2">
                    <div class="possible-answer p-2 rounded d-flex justify-content-between align-items-center">
                        <span>${answer.correctAnswerText || 'No answer text'}</span>
                        <span class="points-badge">(${answer.points || 1}P)</span>
                    </div>
                </div>
            `;
		});
	} else {
		html += `
            <div class="col-12">
                <div class="alert alert-info mb-0">No answer options defined</div>
            </div>
        `;
	}

	html += `
            </div>
        </div>
    `;

	return html;
}

// Create essay section HTML
function createEssaySection(question) {
	return `
        <div class="descriptive-section">
            <div class="mb-2">
                <span class="text-muted">Answer</span>
            </div>
            <div class="alert alert-secondary">
                This question requires manual grading
                ${question.maxWordCount > 0 ? `<div class="mt-2">Maximum word count: ${question.maxWordCount}</div>` : ''}
            </div>
        </div>
    `;
}

// Update question count display
function updateQuestionCount(count) {
	const countBadge = document.querySelector('.badge.bg-secondary');
	if (countBadge) {
		countBadge.textContent = `QUESTIONS ${count}`;
	}
}

// Setup for question checkboxes
function setupQuestionCheckboxes() {
	const selectAllCheckbox = document.getElementById('selectAllQuestions');

	if (selectAllCheckbox) {
		selectAllCheckbox.addEventListener('change', function() {
			const isChecked = this.checked;
			document.querySelectorAll('.question-checkbox').forEach(checkbox => {
				checkbox.checked = isChecked;
			});
		});
	}

	// Add event delegation for dynamically created checkboxes
	document.addEventListener('change', function(e) {
		if (e.target && e.target.classList.contains('question-checkbox')) {
			updateSelectAllCheckboxState();
		}
	});
}

// Update the state of the "select all" checkbox
function updateSelectAllCheckboxState() {
	const selectAllCheckbox = document.getElementById('selectAllQuestions');
	const questionCheckboxes = document.querySelectorAll('.question-checkbox');

	if (!selectAllCheckbox || questionCheckboxes.length === 0) return;

	const allChecked = Array.from(questionCheckboxes).every(checkbox => checkbox.checked);
	const someChecked = Array.from(questionCheckboxes).some(checkbox => checkbox.checked);

	selectAllCheckbox.checked = allChecked;
	selectAllCheckbox.indeterminate = someChecked && !allChecked;
}

// Setup dropdown action items (Edit, Delete)
function setupDropdownActions() {
	// Use event delegation for dynamically created delete buttons
	document.addEventListener('click', function(e) {
		if (e.target && e.target.closest('.delete-question')) {
			e.preventDefault();
			const deleteBtn = e.target.closest('.delete-question');
			const questionId = deleteBtn.getAttribute('data-question-id');

			if (confirm('Are you sure you want to delete this question?')) {
				// For now, just remove from DOM without actual deletion
				const questionItem = deleteBtn.closest('.question-item');
				questionItem.remove();

				// Update question count and numbering
				updateQuestionNumbers();
				updateQuestionCount(document.querySelectorAll('.question-item').length);
			}
		}
	});
}

// Update question numbers after deletion
function updateQuestionNumbers() {
	const questionBadges = document.querySelectorAll('.question-item .badge.bg-dark');
	questionBadges.forEach((badge, index) => {
		badge.textContent = `Q. ${index + 1}`;
	});
}

// Setup for search functionality
function setupSearch() {
	const searchInput = document.querySelector('.search-input');
	const searchButton = document.querySelector('.search-button');

	if (searchButton && searchInput) {
		searchButton.addEventListener('click', function() {
			performSearch(searchInput.value);
		});

		searchInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				performSearch(this.value);
			}
		});
	}
}

// Perform search function
function performSearch(query) {
	query = query.toLowerCase().trim();

	document.querySelectorAll('.question-item').forEach(item => {
		const questionText = item.querySelector('.question-text').textContent.toLowerCase();
		const questionType = item.querySelector('.question-details span:nth-child(3)').textContent.toLowerCase();

		if (!query || questionText.includes(query) || questionType.includes(query)) {
			item.style.display = 'block';
		} else {
			item.style.display = 'none';
		}
	});
}

// Display error message
function displayError(message) {
	const questionsContainer = document.querySelector('.questions-list');
	const header = questionsContainer.querySelector('.card.mb-3');
	const pagination = questionsContainer.querySelector('.d-flex.justify-content-between.align-items-center.mt-4');

	// Create error element
	const errorDiv = document.createElement('div');
	errorDiv.className = 'alert alert-danger mt-3';
	errorDiv.textContent = message;

	// Insert after header
	if (header && header.nextSibling) {
		questionsContainer.insertBefore(errorDiv, header.nextSibling);
	} else {
		questionsContainer.insertBefore(errorDiv, pagination);
	}
}