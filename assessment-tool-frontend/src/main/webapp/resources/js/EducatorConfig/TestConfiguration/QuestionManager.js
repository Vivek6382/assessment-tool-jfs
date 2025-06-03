// scripts.js - JavaScript for test UI functionality

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
	// Initialize TinyMCE
	initializeTinyMCE();

	// Set up collapsible sections in sidebar
	setupCollapsibleSections();

	// Handle answer type dropdown
	setupAnswerTypeFunctionality();

	// Set up button event listeners
	setupButtonListeners();

	// Initialize existing question data if editing
	loadExistingQuestionData();
	

	// Initialize activation button - should be last
	initActivationButton();
	
});



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




// Initialize TinyMCE editor
// Update the initializeTinyMCE function
function initializeTinyMCE() {
	if (document.getElementById('tinymce-editor')) {
		try {
			console.log('Initializing TinyMCE...');

			// First remove any existing instance
			tinymce.remove('#tinymce-editor');

			tinymce.init({
				selector: '#tinymce-editor',
				menubar: false,
				inline: false,
				min_height: 100,
				max_height: 300,
				statusbar: false,
				resize: false,
				plugins: [
					'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
					'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
					'table', 'emoticons', 'help', 'textcolor', 'subscript', 'superscript', 'specialchar', 'equationeditor'
				],
				toolbar: 'undo redo | blocks fontfamily fontsize | ' +
					'bold italic underline strikethrough | ' +
					'subscript superscript | ' +
					'alignleft aligncenter alignright alignjustify | ' +
					'bullist numlist outdent indent | link image media | ' +
					'forecolor backcolor | specialchar equationeditor emoticons | help',
				content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15.1px; color:#0f2830; margin: 5px 0; }',
				setup: function(editor) {
					editor.on('init', function() {
						console.log('TinyMCE initialized successfully');
						updateCharCount(editor);

						// Initialize answer editors after main editor is ready
						setTimeout(() => {
							initializeAnswerEditors();
							// Also initialize any existing answer editors
							document.querySelectorAll('.tinymce-answer').forEach(textarea => {
								if (!tinymce.get(textarea.id)) {
									initializeAnswerEditor(textarea.id, textarea.value);
								}
							});
						}, 500);
					});
				}
			});

			console.log('TinyMCE initialization complete');
		} catch (e) {
			console.error('Error initializing TinyMCE:', e);
		}
	}
}


// Initialize TinyMCE for all answer textareas
function initializeAnswerEditors() {
    // Remove any existing TinyMCE instances for answer fields first
    document.querySelectorAll('.tinymce-answer').forEach(textarea => {
        const editorId = textarea.id;
        if (tinymce.get(editorId)) {
            tinymce.remove('#' + editorId);
        }
    });

    // Initialize fresh instances for all answer textareas
    document.querySelectorAll('.tinymce-answer').forEach(textarea => {
        const textareaId = textarea.id;
        const content = textarea.value;
        
        tinymce.init({
            selector: '#' + textareaId,
            menubar: false,
            toolbar_location: 'bottom',
            inline: false,
            min_height: 38,
            max_height: 150,
            statusbar: false,
            resize: false,
            plugins: [
                'advlist', 'autolink', 'link', 'lists', 'charmap', 'preview',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'table', 'emoticons', 'specialchar', 'equationeditor'
            ],
            toolbar: 'undo redo | bold italic underline strikethrough | ' +
                'bullist numlist | link | ' +
                'specialchar equationeditor emoticons',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#0f2830; margin: 5px 0; }',
            setup: function(editor) {
                editor.on('init', function() {
                    if (content) {
                        // Properly handle HTML content
                        editor.setContent(content);
                    }
                });
            }
        });
    });
}

// Remove the standalone initializeAnswerEditor function since we're handling everything in initializeAnswerEditors


// Set up collapsible sections in sidebar
function setupCollapsibleSections() {
	const sectionHeaders = document.querySelectorAll('.sidebar-section-header');

	sectionHeaders.forEach(header => {
		header.addEventListener('click', function() {
			const toggleIcon = this.querySelector('.toggle-icon');
			const nextElement = this.nextElementSibling.nextElementSibling;

			// Toggle the right section and keep progress visible
			if (nextElement && nextElement.classList.contains('collapsible-section')) {
				nextElement.classList.toggle('collapsed');
				toggleIcon.classList.toggle('collapsed');
			}
		});
	});

	// Fix for Test progress & results section toggle
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

// Set up answer type dropdown functionality
// Add this to your setupAnswerTypeFunctionality function
function setupAnswerTypeFunctionality() {
	const answerTypeSelect = document.getElementById('answer-type-select');

	if (answerTypeSelect) {
		answerTypeSelect.addEventListener('change', function() {
			const selectedType = answerTypeSelect.value;

			// Hide all answer containers first
			hideAllAnswerContainers();

			// Show the selected container
			showAnswerContainer(selectedType);

			// Hide/show the standard question marks field based on essay selection
			const questionMarksField = document.querySelector('.question-marks-field');
			if (selectedType === 'essay') {
				questionMarksField.style.display = 'none';
				document.getElementById('essay-score-settings').style.display = 'block';
			} else {
				questionMarksField.style.display = 'block';
				document.getElementById('essay-score-settings').style.display = 'none';
			}
		});
	}
}



// Function to hide all answer containers
function hideAllAnswerContainers() {
	const containers = [
		'single-choice-answers',
		'multiple-choice-answers',
		'true-false-answers',
		'short-answer',
		'essay-answer'
	];

	containers.forEach(containerId => {
		const container = document.getElementById(containerId);
		if (container) {
			container.style.display = 'none';
		}
	});
}

// Function to show the selected answer container
function showAnswerContainer(answerType) {
	// Hide all answer containers
	hideAllAnswerContainers();

	// Get reference to essay score settings
	const essayScoreSettings = document.getElementById('essay-score-settings');
	const shortAnswerSettings = document.querySelector('.short-answer-settings');

	switch (answerType) {
		case 'single-choice':
			document.getElementById('single-choice-answers').style.display = 'block';
			if (essayScoreSettings) essayScoreSettings.style.display = 'none';
			if (shortAnswerSettings) shortAnswerSettings.style.display = 'none';
			break;
		case 'multiple-choice':
			document.getElementById('multiple-choice-answers').style.display = 'block';
			if (essayScoreSettings) essayScoreSettings.style.display = 'none';
			if (shortAnswerSettings) shortAnswerSettings.style.display = 'none';
			break;
		case 'true-false':
			document.getElementById('true-false-answers').style.display = 'block';
			if (essayScoreSettings) essayScoreSettings.style.display = 'none';
			if (shortAnswerSettings) shortAnswerSettings.style.display = 'none';
			break;
		case 'short-answer':
			document.getElementById('short-answer').style.display = 'block';
			if (essayScoreSettings) essayScoreSettings.style.display = 'none';
			if (shortAnswerSettings) shortAnswerSettings.style.display = 'block';
			break;
		case 'essay':
			document.getElementById('essay-answer').style.display = 'block';
			if (essayScoreSettings) essayScoreSettings.style.display = 'block';
			if (shortAnswerSettings) shortAnswerSettings.style.display = 'none';
			break;
		default:
			document.getElementById('single-choice-answers').style.display = 'block';
			if (essayScoreSettings) essayScoreSettings.style.display = 'none';
			if (shortAnswerSettings) shortAnswerSettings.style.display = 'none';
	}

	// Update question marks field visibility
	const questionMarksField = document.querySelector('.question-marks-field');
	if (answerType === 'essay') {
		questionMarksField.style.display = 'none';
	} else {
		questionMarksField.style.display = 'block';
	}
}





// Load existing question data if editing
// Update loadExistingQuestionData function
function loadExistingQuestionData() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionId');
    
    if (questionId) {
        console.log('Loading existing question data for ID:', questionId);
        document.getElementById('question-id').value = questionId;
        
        // Update page title to show question number
        document.getElementById('question-title').innerHTML = `
            Editing Question <span id="question-number">${questionId}</span>
            <span class="badge bg-warning text-dark ms-2">Edit Mode</span>
        `;
        
        document.getElementById('save-add-next-btn').style.display = 'none';
        
        fetch('/EducatorConfig/TestConfiguration/GetAllQuestions')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.questions) {
                    const questionToEdit = data.questions.find(q => q.questionId == questionId);
                    if (questionToEdit) {
                        populateQuestionForm(questionToEdit);
                        
                        // Check assessment status
                        if (data.assessmentStatus && data.assessmentStatus !== 'draft') {
                            disableQuestionManagerEditing();
                        }
                    }
                }
            });
    } else {
        // New question - set number from session storage
        fetch('/EducatorConfig/TestConfiguration/GetAllQuestions')
            .then(response => response.json())
            .then(data => {
                let questionCount = 1;
                if (data.success && data.questions) {
                    questionCount = data.questions.length + 1;
                    sessionStorage.setItem('questionCount', questionCount);
                    
                    // Check assessment status
                    if (data.assessmentStatus && data.assessmentStatus !== 'draft') {
                        disableQuestionManagerEditing();
                    }
                }
                document.getElementById('question-number').textContent = questionCount;
            });
    }
}



function disableQuestionManagerEditing() {
    // Disable all buttons
    ['save-btn', 'save-add-next-btn', 'cancel-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = true;
            btn.classList.add('disabled');
        }
    });
    
    // Add warning message
    const warningDiv = document.createElement('div');
    warningDiv.className = 'alert alert-warning mb-4';
    warningDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>
        You cannot edit questions if you have already activated the test. 
        Duplicate the test on the "My tests" page to edit questions.
    `;
    
    const cardBody = document.querySelector('.card-body');
    if (cardBody) {
        cardBody.insertBefore(warningDiv, cardBody.firstChild);
    }
    
    // Redirect after short delay
    setTimeout(() => {
        window.location.href = '/EducatorConfig/TestConfiguration/QuestionDashboard';
    }, 3000);
}



// Populate the form with existing question data
// Update the populateQuestionForm function
function populateQuestionForm(question) {
	console.log('Populating form with question:', question);

	const initInterval = setInterval(() => {
		if (tinymce.get('tinymce-editor')) {
			clearInterval(initInterval);

			// Set question text - properly handle HTML content
			if (question.questionText) {
				// Remove any existing TinyMCE instance first
				tinymce.remove('#tinymce-editor');

				// Reinitialize TinyMCE with the question text
				tinymce.init({
					selector: '#tinymce-editor',
					menubar: false,
					inline: false,
					min_height: 100,
					max_height: 300,
					statusbar: false,
					resize: false,
					plugins: [
						'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
						'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
						'table', 'emoticons', 'help', 'textcolor', 'subscript', 'superscript', 'specialchar', 'equationeditor'
					],
					toolbar: 'undo redo | blocks fontfamily fontsize | ' +
						'bold italic underline strikethrough | ' +
						'subscript superscript | ' +
						'alignleft aligncenter alignright alignjustify | ' +
						'bullist numlist outdent indent | link image media | ' +
						'forecolor backcolor | specialchar equationeditor emoticons | help',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15.1px; color:#0f2830; margin: 5px 0; }',
					setup: function(editor) {
						editor.on('init', function() {
							editor.setContent(question.questionText || '');
							updateCharCount(editor);
						});
					}
				});
			}

			// Update question title with question number
			document.getElementById('question-title').innerHTML = `
                Editing Question <span id="question-number">${question.questionId}</span>
                <span class="badge bg-warning text-dark ms-2">Edit Mode</span>
            `;


			// Set question type
			const answerTypeSelect = document.getElementById('answer-type-select');
			if (question.questionType && answerTypeSelect) {
				let questionType = '';

				switch (question.questionType.questionTypeId) {
					case 1:
						questionType = 'single-choice';
						break;
					case 2:
						questionType = 'multiple-choice';
						break;
					case 3:
						questionType = 'true-false';
						break;
					case 4:
						questionType = 'short-answer';
						break;
					case 5:
						questionType = 'essay';
						break;
					default:
						questionType = 'single-choice';
				}

				answerTypeSelect.value = questionType;
				// Force UI update
				showAnswerContainer(questionType);

				// Set question marks
				if (question.questionMarks !== undefined) {
					document.getElementById('question-marks').value = question.questionMarks;
				}

				// Set max word count for essay questions
				if (question.maxWordCount !== undefined && document.getElementById('essay-max-words')) {
					document.getElementById('essay-max-words').value = question.maxWordCount;
					document.getElementById('essay-max-points').value = question.questionMarks || 10;
				}

				// Set manual grading toggle for short answer
				if (question.requiresManualGrading !== undefined && document.getElementById('manually-grade-toggle')) {
					document.getElementById('manually-grade-toggle').checked = question.requiresManualGrading;
				}

				// Set options after a small delay to ensure UI is updated
				setTimeout(() => {
					if (question.options && question.options.length > 0) {
						switch (questionType) {
							case 'single-choice':
								populateSingleChoiceOptions(question.options);
								break;
							case 'multiple-choice':
								populateMultipleChoiceOptions(question.options);
								break;
							case 'true-false':
								populateTrueFalseOptions(question.options);
								break;
							case 'short-answer':
								populateShortAnswerOptions(question.options);
								break;
							default:
								// No options for essay questions
								break;
						}
					}
				}, 500);
			}
		}
	}, 100);
}



// Helper function to update character count
function updateCharCount(editor) {
	let text = editor.getContent({ format: 'text' });
	let count = text.length;
	document.getElementById('char-count').innerText = count + ' / 1000';
}



// Populate single choice options
// Update populateSingleChoiceOptions and populateMultipleChoiceOptions to use this helper
function populateSingleChoiceOptions(options) {
    const container = document.getElementById('single-choice-answers');
    const addBtnContainer = container.querySelector('.add-answer-btn-container');
    container.innerHTML = '';
    if (addBtnContainer) {
        container.appendChild(addBtnContainer);
    }
    
    options.forEach((option, index) => {
        const textareaId = 'single-answer-' + (index + 1);
        const optionText = option.optionText || '';
        const template = `
            <div class="answer-item mb-3" data-option-id="${option.optionId || ''}">
                <div class="card">
                    <div class="card-body p-3">
                        <div class="d-flex align-items-start">
                            <div class="answer-selector me-2">
                                <input type="radio" name="correctAnswer"
                                    class="form-check-input mt-1" id="answer${index + 1}" ${option.isCorrect ? 'checked' : ''}>
                            </div>
                            <div class="answer-content flex-grow-1">
                                <div class="tinymce-answer-container">
                                    <textarea class="tinymce-answer" id="${textareaId}">${optionText}</textarea>
                                </div>
                            </div>
                            <div class="answer-actions ms-2">
                                <button class="btn btn-sm text-danger delete-answer">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertBefore(
            createElementFromHTML(template),
            container.querySelector('.add-answer-btn-container')
        );
    });
    
    // Initialize editors after all options are added
    setTimeout(() => {
        initializeAnswerEditors();
        setupAnswerDeleteButtons();
    }, 100);
}

// Make the same change to populateMultipleChoiceOptions
function populateMultipleChoiceOptions(options) {
    const container = document.getElementById('multiple-choice-answers');
    const addBtnContainer = container.querySelector('.add-answer-btn-container');
    container.innerHTML = '';
    if (addBtnContainer) {
        container.appendChild(addBtnContainer);
    }
    
    options.forEach((option, index) => {
        const textareaId = 'multi-answer-' + (index + 1);
        const optionText = option.optionText || '';
        const template = `
            <div class="answer-item mb-3" data-option-id="${option.optionId || ''}">
                <div class="card">
                    <div class="card-body p-3">
                        <div class="d-flex align-items-start">
                            <div class="answer-selector me-2">
                                <input type="checkbox" class="form-check-input mt-1"
                                    id="multiAnswer${index + 1}" ${option.isCorrect ? 'checked' : ''}>
                            </div>
                            <div class="answer-content flex-grow-1">
                                <div class="tinymce-answer-container">
                                    <textarea class="tinymce-answer" id="${textareaId}">${optionText}</textarea>
                                </div>
                            </div>
                            <div class="answer-actions ms-2">
                                <button class="btn btn-sm text-danger delete-answer">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertBefore(
            createElementFromHTML(template),
            container.querySelector('.add-answer-btn-container')
        );
    });
    
    // Initialize editors after all options are added
    setTimeout(() => {
        initializeAnswerEditors();
        setupAnswerDeleteButtons();
    }, 100);
}


// Populate true/false options
function populateTrueFalseOptions(options) {
	options.forEach(option => {
		if (option.optionText.toLowerCase() === 'true') {
			document.getElementById('answerTrue').checked = option.isCorrect;
		} else if (option.optionText.toLowerCase() === 'false') {
			document.getElementById('answerFalse').checked = option.isCorrect;
		}
	});
}

// Populate short answer options
function populateShortAnswerOptions(options) {
    const container = document.getElementById('short-answer-items');
    const manualGradingToggle = document.getElementById('manually-grade-toggle');
    
    // Clear existing items and any manual grading message
    container.innerHTML = '';
    const existingMessage = document.querySelector('.manual-grading-message');
    if (existingMessage) existingMessage.remove();

    // Determine if manual grading is required
    let requiresManualGrading = false;
    if (options && options.length > 0) {
        requiresManualGrading = options[0].requiresManualGrading || false;
    }

    // Set the toggle state - this must happen before UI update
    manualGradingToggle.checked = requiresManualGrading;

    // Force immediate UI update
    updateManualGradingUI(requiresManualGrading);

    // Only populate answers if manual grading is disabled AND we have answers
    if (!requiresManualGrading && options && options.length > 0 && options[0].answers) {
        options[0].answers.forEach((answer, aIndex) => {
            const template = `
                <div class="answer-item mb-3" data-option-id="${options[0].optionId || ''}" data-answer-id="${answer.answerId || ''}">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="answer-content">
                                <div class="row gx-2 gy-2 align-items-center">
                                    <div class="col-md-8">
                                        <label class="form-label text-muted mb-2">Correct Answer</label>
                                        <input type="text" class="form-control short-answer-input" 
                                            value="${answer.correctAnswerText || ''}" placeholder="Enter a correct answer">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label text-muted mb-2">Points</label>
                                        <input type="number" class="form-control short-answer-points" 
                                            value="${answer.points || 1}" min="0">
                                    </div>
                                    <div class="col-md-1 d-flex align-items-end">
                                        <button class="btn btn-sm text-danger delete-short-answer mb-2">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', template);
        });
    }

    // If no answers were added and manual grading is off, add a default one
    if (container.children.length === 0 && !requiresManualGrading) {
        addShortAnswerItem();
    }

    setupShortAnswerDeleteButtons();
}


// Helper function to update manual grading UI
function updateManualGradingUI(isEnabled) {
    const shortAnswerItems = document.getElementById('short-answer-items');
    const addAnswerBtn = document.querySelector('.add-short-answer-btn');
    const settingsDiv = document.querySelector('.short-answer-settings');
    
    // Remove any existing message first
    const existingMessage = document.querySelector('.manual-grading-message');
    if (existingMessage) existingMessage.remove();

    if (isEnabled) {
        // Manual grading is enabled
        if (shortAnswerItems) {
            shortAnswerItems.style.opacity = '0.6';
            shortAnswerItems.querySelectorAll('input').forEach(input => {
                input.disabled = true;
            });
            
            shortAnswerItems.querySelectorAll('.delete-short-answer').forEach(btn => {
                btn.disabled = true;
                btn.classList.add('text-muted');
                btn.classList.remove('text-danger');
            });
        }
        
        if (addAnswerBtn) {
            addAnswerBtn.disabled = true;
            addAnswerBtn.classList.add('btn-secondary');
            addAnswerBtn.classList.remove('btn-primary');
        }
        
        // Add manual grading message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'manual-grading-message alert alert-info mt-3';
        messageDiv.innerHTML = '<i class="bi bi-info-circle me-2"></i>Manual grading enabled. Answer options are not required.';
        if (settingsDiv) {
            settingsDiv.insertAdjacentElement('afterend', messageDiv);
        }
    } else {
        // Manual grading is disabled
        if (shortAnswerItems) {
            shortAnswerItems.style.opacity = '1';
            shortAnswerItems.querySelectorAll('input').forEach(input => {
                input.disabled = false;
            });
            
            shortAnswerItems.querySelectorAll('.delete-short-answer').forEach(btn => {
                btn.disabled = false;
                btn.classList.add('text-danger');
                btn.classList.remove('text-muted');
            });
        }
        
        if (addAnswerBtn) {
            addAnswerBtn.disabled = false;
            addAnswerBtn.classList.add('btn-primary');
            addAnswerBtn.classList.remove('btn-secondary');
        }
    }
}

// Helper function to create an element from HTML string
function createElementFromHTML(htmlString) {
	const div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}


// Set up button event listeners
function setupButtonListeners() {
	// Add answer button functionality for single and multiple choice
	document.querySelectorAll('.add-answer-btn').forEach(button => {
		button.addEventListener('click', function() {
			const container = this.closest('.answer-type-container');
			const answerItems = container.querySelectorAll('.answer-item');
			const answerCount = answerItems.length;
			const isMultipleChoice = container.id === 'multiple-choice-answers';

			// Create a new unique ID for the textarea
			const newTextareaId = (isMultipleChoice ? 'multi-answer-' : 'single-answer-') + (answerCount + 1);

			// Create a new answer item
			const template = `
	            <div class="answer-item mb-3">
	                <div class="card">
	                    <div class="card-body p-3">
	                        <div class="d-flex align-items-start">
	                            <div class="answer-selector me-2">
	                                <input type="${isMultipleChoice ? 'checkbox' : 'radio'}" 
	                                    ${!isMultipleChoice ? 'name="correctAnswer"' : ''} 
	                                    class="form-check-input mt-1" 
	                                    id="${isMultipleChoice ? 'multiAnswer' : 'answer'}${answerCount + 1}">
	                            </div>
	                            <div class="answer-content flex-grow-1">
	                                <div class="tinymce-answer-container">
	                                    <textarea class="tinymce-answer" id="${newTextareaId}">Answer option ${answerCount + 1}</textarea>
	                                </div>
	                            </div>
	                            <div class="answer-actions ms-2">
	                                <button class="btn btn-sm text-danger delete-answer">
	                                    <i class="bi bi-trash"></i>
	                                </button>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        `;

			// Insert before the add button container
			container.insertBefore(
				createElementFromHTML(template),
				container.querySelector('.add-answer-btn-container')
			);

			// Add delete functionality to the new answer item
			const newAnswerItem = container.querySelector('.answer-item:nth-last-child(2)');
			const deleteBtn = newAnswerItem.querySelector('.delete-answer');
			if (deleteBtn) {
				deleteBtn.addEventListener('click', function() {
					if (container.querySelectorAll('.answer-item').length > 2) {
						// Get the editor ID before removing
						const editorToRemove = this.closest('.answer-item').querySelector('textarea');
						if (editorToRemove && editorToRemove.id) {
							// Remove TinyMCE instance before removing the element
							tinymce.remove('#' + editorToRemove.id);
						}
						this.closest('.answer-item').remove();
					} else {
						alert('You need at least two answer options.');
					}
				});
			}

			// Initialize TinyMCE for the new textarea
			tinymce.init({
				selector: '#' + newTextareaId,
				menubar: false,
				toolbar_location: 'bottom',
				inline: false,
				min_height: 38,
				max_height: 150,
				statusbar: false,
				resize: false,
				plugins: [
					'advlist', 'autolink', 'link', 'lists', 'charmap', 'preview',
					'searchreplace', 'visualblocks', 'code', 'fullscreen',
					'table', 'emoticons', 'specialchar', 'equationeditor'
				],
				toolbar: 'undo redo | bold italic underline strikethrough | ' +
					'bullist numlist | link | ' +
					'specialchar equationeditor emoticons',
				content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color:#0f2830; margin: 5px 0; }'
			});
		});
	});

	// Add short answer button functionality
	const addShortAnswerBtn = document.querySelector('.add-short-answer-btn');
	if (addShortAnswerBtn) {
		addShortAnswerBtn.addEventListener('click', function() {
			addShortAnswerItem();
		});
	}

	// Setup delete functionality for initial short answer items
	setupShortAnswerDeleteButtons();

	// Setup delete functionality for initial answer items
	setupAnswerDeleteButtons();

	// Setup manual grading toggle functionality
	setupManualGradingToggle();

	// Save button functionality
	const saveBtn = document.getElementById('save-btn');
	if (saveBtn) {
		saveBtn.addEventListener('click', function() {
			saveQuestion(false);
		});
	}

	// Save and add next button functionality
	const saveAddNextBtn = document.getElementById('save-add-next-btn');
	if (saveAddNextBtn) {
		saveAddNextBtn.addEventListener('click', function() {
			saveQuestion(true);
		});
	}

	// Cancel button functionality
	const cancelBtn = document.getElementById('cancel-btn');
	if (cancelBtn) {
		cancelBtn.addEventListener('click', function() {
			window.location.href = '/EducatorConfig/TestConfiguration/QuestionDashboard';
		});
	}
}


// Function to add a new short answer item
function addShortAnswerItem() {
	const shortAnswerItems = document.getElementById('short-answer-items');
	const template = `
        <div class="answer-item mb-3">
            <div class="card">
                <div class="card-body p-3">
                    <div class="answer-content">
                        <div class="row gx-2 gy-2 align-items-center">
                            <div class="col-md-8">
                                <label class="form-label text-muted mb-2">Correct Answer</label>
                                <input type="text" class="form-control short-answer-input" placeholder="Enter a correct answer">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label text-muted mb-2">Points</label>
                                <input type="number" class="form-control short-answer-points" value="1" min="0">
                            </div>
                            <div class="col-md-1 d-flex align-items-end">
                                <button class="btn btn-sm text-danger delete-short-answer mb-2">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

	// Insert the new answer item
	shortAnswerItems.insertAdjacentHTML('beforeend', template);

	// Setup delete button for the new item
	setupShortAnswerDeleteButtons();
}

// Function to set up delete buttons for short answer items
function setupShortAnswerDeleteButtons() {
	document.querySelectorAll('.delete-short-answer').forEach(button => {
		button.addEventListener('click', function() {
			const shortAnswerItems = document.getElementById('short-answer-items');
			const items = shortAnswerItems.querySelectorAll('.answer-item');

			// Prevent deleting if this is the only answer item
			if (items.length > 1) {
				this.closest('.answer-item').remove();
			} else {
				alert('You need at least one possible answer.');
			}
		});
	});
}

// Function to set up delete buttons for answer items
function setupAnswerDeleteButtons() {
	document.querySelectorAll('.delete-answer').forEach(button => {
		button.addEventListener('click', function() {
			const container = this.closest('.answer-type-container');
			if (container.querySelectorAll('.answer-item').length > 2) {
				// Get the editor ID before removing
				const editorToRemove = this.closest('.answer-item').querySelector('textarea');
				if (editorToRemove && editorToRemove.id) {
					// Remove TinyMCE instance before removing the element
					tinymce.remove('#' + editorToRemove.id);
				}
				this.closest('.answer-item').remove();
			} else {
				alert('You need at least two answer options.');
			}
		});
	});
}



// Function to handle manual grading toggle behavior for short answers
function setupManualGradingToggle() {
    const manualGradingToggle = document.getElementById('manually-grade-toggle');
    
    if (manualGradingToggle) {
        manualGradingToggle.addEventListener('change', function() {
            updateManualGradingUI(this.checked);
            
            // If turning OFF manual grading and no answers exist, add one
            if (!this.checked && document.getElementById('short-answer-items').children.length === 0) {
                addShortAnswerItem();
            }
        });
        
        // Initialize the UI based on current state
        updateManualGradingUI(manualGradingToggle.checked);
    }
}



// Continue from where it left off
// Save Question Function
function saveQuestion(addNext) {
	console.log('Saving question...');

	// Get question ID if editing
	const questionId = document.getElementById('question-id').value;
	const isEditMode = !!questionId;

	// Get question text from TinyMCE
	const questionText = tinymce.get('tinymce-editor').getContent();
	if (!questionText.trim()) {
		alert('Please enter a question text.');
		return;
	}

	// Get selected answer type
	const answerType = document.getElementById('answer-type-select').value;

	// Get question type ID based on answer type
	let questionTypeId;
	switch (answerType) {
		case 'single-choice':
			questionTypeId = 1;
			break;
		case 'multiple-choice':
			questionTypeId = 2;
			break;
		case 'true-false':
			questionTypeId = 3;
			break;
		case 'short-answer':
			questionTypeId = 4;
			break;
		case 'essay':
			questionTypeId = 5;
			break;
		default:
			questionTypeId = 1;
	}

	// Get question marks
	const questionMarks = parseInt(document.getElementById('question-marks').value, 10) || 1;

	// Prepare options and answers based on question type
	const options = [];
	let requiresManualGrading = false;
	let maxWordCount = 0;

	// Check if answer selections are valid based on question type
	switch (answerType) {
		case 'single-choice':
			// Get all options for single choice
			const singleChoiceItems = document.querySelectorAll('#single-choice-answers .answer-item');

			// Validate minimum options
			if (singleChoiceItems.length < 2) {
				alert('Single choice questions require at least 2 options.');
				return;
			}

			// Check if at least one option is selected as correct
			let hasCorrectSingleOption = false;

			// Process each option
			singleChoiceItems.forEach((item, index) => {
				const optionId = item.getAttribute('data-option-id') || null;
				const isCorrect = item.querySelector('input[type="radio"]').checked;
				if (isCorrect) hasCorrectSingleOption = true;

				// Get option text from TinyMCE if available
				const textareaId = item.querySelector('textarea').id;
				const optionText = tinymce.get(textareaId) ? tinymce.get(textareaId).getContent() : item.querySelector('textarea').value;

				options.push({
					optionId: optionId,
					optionText: optionText,
					isCorrect: isCorrect
				});
			});

			if (!hasCorrectSingleOption) {
				alert('Please select a correct answer for the single choice question.');
				return;
			}
			break;

		case 'multiple-choice':
			// Get all options for multiple choice
			const multipleChoiceItems = document.querySelectorAll('#multiple-choice-answers .answer-item');

			// Validate minimum options
			if (multipleChoiceItems.length < 2) {
				alert('Multiple choice questions require at least 2 options.');
				return;
			}

			// Check if at least one option is selected as correct
			let hasCorrectMultiOption = false;

			// Process each option
			multipleChoiceItems.forEach((item, index) => {
				const optionId = item.getAttribute('data-option-id') || null;
				const isCorrect = item.querySelector('input[type="checkbox"]').checked;
				if (isCorrect) hasCorrectMultiOption = true;

				// Get option text from TinyMCE if available
				const textareaId = item.querySelector('textarea').id;
				const optionText = tinymce.get(textareaId) ? tinymce.get(textareaId).getContent() : item.querySelector('textarea').value;

				options.push({
					optionId: optionId,
					optionText: optionText,
					isCorrect: isCorrect
				});
			});

			if (!hasCorrectMultiOption) {
				alert('Please select at least one correct answer for the multiple choice question.');
				return;
			}
			break;

		case 'true-false':
			// Get true/false selection
			const isTrueSelected = document.getElementById('answerTrue').checked;
			const isFalseSelected = document.getElementById('answerFalse').checked;

			// Validate that one option is selected
			if (!isTrueSelected && !isFalseSelected) {
				alert('Please select either True or False as the correct answer.');
				return;
			}

			// Add true option
			const trueOptionElement = document.querySelector('#true-false-answers .answer-item:first-child');
			options.push({
				optionId: trueOptionElement.getAttribute('data-option-id') || null,
				optionText: 'True',
				isCorrect: isTrueSelected
			});

			// Add false option
			const falseOptionElement = document.querySelector('#true-false-answers .answer-item:last-child');
			options.push({
				optionId: falseOptionElement.getAttribute('data-option-id') || null,
				optionText: 'False',
				isCorrect: isFalseSelected
			});
			break;

		case 'short-answer':
			// Get manual grading setting
			requiresManualGrading = document.getElementById('manually-grade-toggle').checked;

			// If manual grading is enabled, just add an empty option and skip validation
			if (requiresManualGrading) {
				options.push({
					optionId: null,
					optionText: 'Short Answer', // Placeholder text
					isCorrect: true,
					answers: []
				});
				break;
			}

			// Get all short answer items
			const shortAnswerItems = document.querySelectorAll('#short-answer-items .answer-item');

			// Validate at least one possible answer
			if (shortAnswerItems.length < 1) {
				alert('Short answer questions require at least one possible answer.');
				return;
			}

			// Create a single option for short answer with all possible answers
			const shortAnswerOption = {
				optionId: shortAnswerItems[0].getAttribute('data-option-id') || null,
				optionText: 'Short Answer', // Placeholder text
				isCorrect: true,
				answers: []
			};

			// Add all possible answers
			shortAnswerItems.forEach((item, index) => {
				const answerText = item.querySelector('.short-answer-input').value.trim();
				const points = parseInt(item.querySelector('.short-answer-points').value, 10) || 1;
				const answerId = item.getAttribute('data-answer-id') || null;

				if (answerText) {
					shortAnswerOption.answers.push({
						answerId: answerId,
						correctAnswerText: answerText,
						points: points
					});
				}
			});

			// Validate at least one answer with text
			if (shortAnswerOption.answers.length === 0) {
				alert('Please provide at least one possible answer for the short answer question.');
				return;
			}

			options.push(shortAnswerOption);
			break;

		case 'essay':
			// For essay questions, manual grading is always required
			requiresManualGrading = true;

			// Get maximum word count if available
			maxWordCount = parseInt(document.getElementById('essay-max-words').value, 10) || 0;

			// For essay, we don't need options but we'll add a placeholder
			options.push({
				optionId: null,
				optionText: 'Essay Answer',
				isCorrect: true
			});
			break;

		default:
			console.error('Unknown answer type:', answerType);
			return;
	}

	// Get the assessment ID from session storage or another source
	const assessmentId = sessionStorage.getItem('currentAssessmentId');

	// Prepare the question data
	const questionData = {
		questionText: questionText,
		questionTypeId: questionTypeId,
		questionMarks: answerType === 'essay' ? parseInt(document.getElementById('essay-max-points').value, 10) || 10 : questionMarks,
		requiresManualGrading: requiresManualGrading,
		maxWordCount: maxWordCount,
		options: options,
		saveAndAddNext: addNext && !isEditMode // Only allow addNext for new questions
	};

	// Add assessment ID if available
	if (assessmentId) {
		questionData.assessmentId = parseInt(assessmentId, 10);
	}

	console.log('Question data to save:', questionData);

	// Show saving indicator
	showSavingIndicator();

	// For edit mode, we'll use PUT instead of POST
	const url = isEditMode ?
		`/EducatorConfig/TestConfiguration/SaveQuestion?questionId=${questionId}` :
		'/EducatorConfig/TestConfiguration/SaveQuestion';

	const method = isEditMode ? 'PUT' : 'POST';

	fetch(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(questionData)
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok: ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			hideSavingIndicator();

			if (data && data.success) {
				// Show success message
				showSuccessMessage(isEditMode ? "Question updated successfully!" : "Question saved successfully!");

				// Handle redirection after a short delay
				setTimeout(() => {
					if (isEditMode || !addNext) {
						// For edit mode or regular save, go to dashboard
						window.location.href = '/EducatorConfig/TestConfiguration/QuestionDashboard';
					} else {
						// For new questions with addNext, create new question
						window.location.href = '/EducatorConfig/TestConfiguration/QuestionManager';
					}
				}, 1500);
			} else {
				// Show error message
				showErrorMessage(data && data.error ? data.error : 'Unknown error occurred');
			}
		})
		.catch(error => {
			hideSavingIndicator();
			console.error('Error saving question:', error);
			showErrorMessage('Error saving question: ' + error.message);
		});
}

// Show saving indicator
function showSavingIndicator() {
	// Create indicator if it doesn't exist
	if (!document.getElementById('saving-indicator')) {
		const indicator = document.createElement('div');
		indicator.id = 'saving-indicator';
		indicator.className = 'position-fixed top-0 start-50 translate-middle-x bg-primary text-white py-2 px-4 rounded-bottom';
		indicator.style.zIndex = '9999';
		indicator.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';
		document.body.appendChild(indicator);
	} else {
		document.getElementById('saving-indicator').style.display = 'block';
	}
}

// Hide saving indicator
function hideSavingIndicator() {
	const indicator = document.getElementById('saving-indicator');
	if (indicator) {
		indicator.style.display = 'none';
	}
}

// Show success message
function showSuccessMessage(message) {
	showMessage(message, 'success');
}

// Show error message
function showErrorMessage(message) {
	showMessage(message, 'danger');
}

// Show message helper
function showMessage(message, type) {
	// Create message container if it doesn't exist
	if (!document.getElementById('toast-container')) {
		const container = document.createElement('div');
		container.id = 'toast-container';
		container.className = 'position-fixed bottom-0 end-0 p-3';
		container.style.zIndex = '9999';
		document.body.appendChild(container);
	}

	// Create unique ID for this toast
	const toastId = 'toast-' + Date.now();

	// Create toast element
	const toast = document.createElement('div');
	toast.id = toastId;
	toast.className = `toast align-items-center text-white bg-${type} border-0`;
	toast.setAttribute('role', 'alert');
	toast.setAttribute('aria-live', 'assertive');
	toast.setAttribute('aria-atomic', 'true');

	toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

	// Add to container
	document.getElementById('toast-container').appendChild(toast);

	// Initialize and show the toast
	const bsToast = new bootstrap.Toast(toast, {
		delay: 3000
	});
	bsToast.show();

	// Remove toast from DOM after it's hidden
	toast.addEventListener('hidden.bs.toast', function() {
		document.getElementById(toastId).remove();
	});



}