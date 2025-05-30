document.addEventListener('DOMContentLoaded', function() {
    // Initialize test data
    let testData = {
        startTime: new Date(),
        endTime: null,
        questionStatus: {},
        answers: {}
    };

    // Initialize question statuses and answers
    if (questions && questions.length > 0) {
        questions.forEach(question => {
            testData.questionStatus[question.questionId] = 'unanswered';
            testData.answers[question.questionId] = null;
            
            // Add mark indicators to all question buttons in the sidebar
            const btn = document.querySelector(`.question-number-btn[data-question-id="${question.questionId}"]`);
            if (btn) {
                // Create mark indicator if it doesn't exist
                if (!btn.querySelector('.mark-indicator')) {
                    const markIndicator = document.createElement('span');
                    markIndicator.className = 'mark-indicator';
                    btn.appendChild(markIndicator);
                }
            }
        });
    }

    // Initialize the assessment
    initializeAssessment();

    // Add event listeners for radio buttons (single choice and true/false)
    document.querySelectorAll('.form-check-input[type="radio"]').forEach(input => {
        input.addEventListener('change', function() {
            const questionId = this.name.split('_')[1];
            const optionId = this.value;
            handleOptionSelection(questionId, optionId);
        });
    });

    // Add event listeners for checkboxes (multiple choice)
    document.querySelectorAll('.form-check-input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', function() {
            const questionId = this.name.split('_')[1];
            handleMultipleChoiceSelection(this);
        });
    });

    // Add event listeners for text areas (short answer and essay)
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const questionId = this.name.split('_')[1];
            const characterCount = this.value.length;
            const maxLength = parseInt(this.getAttribute('maxlength'));
            
            // Update character count display
            const charCountDisplay = this.parentElement.querySelector('.char-count');
            if (charCountDisplay) {
                charCountDisplay.textContent = `${characterCount}/${maxLength} characters`;
            }
            
            // Save answer
            testData.answers[questionId] = this.value;
            
            // Update question status
            if (this.value.trim() !== '') {
                testData.questionStatus[questionId] = 'answered';
            } else {
                testData.questionStatus[questionId] = 'unanswered';
            }
            
            updateQuestionIndicator(questionId);
            updateProgress();
        });
    });

    // Add event listener for finish test button
    document.getElementById('finishTest').addEventListener('click', function() {
        if (confirm("Are you sure you want to finish the test? You won't be able to change your answers after submission.")) {
            submitTest();
        }
    });

    // Add event listener for final submit button
    document.getElementById('finalSubmitBtn').addEventListener('click', function(e) {
        e.preventDefault();
        submitTest();
    });

    // Look for existing mark review buttons and add event listeners
    document.querySelectorAll('.mark-review-btn').forEach(btn => {
        const questionIdAttr = btn.getAttribute('onclick');
        if (questionIdAttr) {
            // Extract the question ID from the onclick attribute
            const questionId = questionIdAttr.match(/\d+/)[0];
            // Replace the existing onclick handler with our function
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                toggleMarkForReview(questionId);
            });
        }
    });

    // Start the timer
    startTimer();
});

/**
 * Initialize the assessment
 */
function initializeAssessment() {
    updateProgress();
    
    // Set up question count
    if (questions && questions.length > 0) {
        document.getElementById('progressInfo').textContent = `0 of ${questions.length} questions answered`;
        document.getElementById('remainingCount').textContent = questions.length;
    }
}

/**
 * Start the timer for the assessment
 */
function startTimer() {
    const timerElement = document.getElementById('timerValue');
    if (!timerElement) return;
    
    let minutes = 0;
    let seconds = 0;
    
    const durationText = timerElement.textContent;
    const parts = durationText.split(':');
    if (parts.length === 2) {
        minutes = parseInt(parts[0]) || 0;
        seconds = parseInt(parts[1]) || 0;
    }
    
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) return;
    
    const timerContainer = document.getElementById('mainTimer');
    const endTime = new Date(new Date().getTime() + totalSeconds * 1000);
    
    function updateTimer() {
        const now = new Date();
        const diff = Math.max(0, Math.floor((endTime - now) / 1000));
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        const formattedTime = hours > 0 
            ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timerElement.textContent = formattedTime;
        
        // Add warning class for last 5 minutes
        if (diff <= 300 && diff > 60) {
            timerContainer.classList.add('warning');
            timerContainer.classList.remove('danger');
        }
        
        // Add danger class for last minute
        if (diff <= 60) {
            timerContainer.classList.add('danger');
            timerContainer.classList.remove('warning');
        }
        
        // Auto-submit when time is up
        if (diff === 0) {
            alert("Time's up! Your test will be submitted automatically.");
            submitTest();
            return;
        }
        
        setTimeout(updateTimer, 1000);
    }
    
    updateTimer();
}

/**
 * Handle single or true/false option selection
 * @param {string} questionId - The question ID
 * @param {string} optionId - The selected option ID
 */
function handleOptionSelection(questionId, optionId) {
    // Save the answer
    testData.answers[questionId] = optionId;
    
    // Update question status
    testData.questionStatus[questionId] = 'answered';
    
    // Update UI
    updateQuestionIndicator(questionId);
    updateProgress();
}

/**
 * Handle multiple choice option selection
 * @param {HTMLElement} checkbox - The checkbox element that was changed
 */
function handleMultipleChoiceSelection(checkbox) {
    const questionId = checkbox.name.split('_')[1];
    
    // Get all selected options for this question
    const selectedOptions = Array.from(
        document.querySelectorAll(`input[name="question_${questionId}"]:checked`)
    ).map(input => input.value);
    
    // Save the answer
    testData.answers[questionId] = selectedOptions.length > 0 ? selectedOptions.join(',') : null;
    
    // Update question status
    if (selectedOptions.length > 0) {
        testData.questionStatus[questionId] = 'answered';
    } else {
        testData.questionStatus[questionId] = 'unanswered';
    }
    
    // Update UI
    updateQuestionIndicator(questionId);
    updateProgress();
}

/**
 * Navigate to a specific question
 * @param {string} questionId - The question ID to navigate to
 */
function navigateToQuestion(questionId) {
    // Hide all questions
    document.querySelectorAll('.question-container').forEach(container => {
        container.classList.remove('active-question');
    });
    
    // Show the selected question
    const questionContainer = document.getElementById(`question-${questionId}`);
    if (questionContainer) {
        questionContainer.classList.add('active-question');
    }
    
    // Update active state in the question grid
    document.querySelectorAll('.question-number-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const questionBtn = document.querySelector(`.question-number-btn[data-question-id="${questionId}"]`);
    if (questionBtn) {
        questionBtn.classList.add('active');
    }
    
    // Hide summary container if visible
    document.getElementById('summaryContainer').classList.remove('active-question');
}

/**
 * Toggle mark for review status for a question
 * @param {string} questionId - The question ID
 */
function toggleMarkForReview(questionId) {
    // Find the current status
    const currentStatus = testData.questionStatus[questionId];
    
    // Find the mark review button
    const btn = document.querySelector(`.question-container#question-${questionId} .mark-review-btn`);
    
    if (currentStatus === 'marked') {
        // If already marked, unmark it
        testData.questionStatus[questionId] = testData.answers[questionId] ? 'answered' : 'unanswered';
        if (btn) {
            btn.classList.remove('marked');
            btn.innerHTML = '<i class="fas fa-bookmark me-1"></i> Mark for Review';
        }
    } else {
        // If not marked, mark it
        testData.questionStatus[questionId] = 'marked';
        if (btn) {
            btn.classList.add('marked');
            btn.innerHTML = '<i class="fas fa-bookmark me-1"></i> Marked for Review';
        }
    }
    
    // Update the indicator in the sidebar
    updateQuestionIndicator(questionId);
    updateProgress();
}

/**
 * Clear the answer for a question
 * @param {string} questionId - The question ID
 */
function clearAnswer(questionId) {
    const questionContainer = document.querySelector(`.question-container#question-${questionId}`);
    if (!questionContainer) return;
    
    // Clear radio buttons
    const radioInputs = questionContainer.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.checked = false;
    });
    
    // Clear checkboxes
    const checkboxInputs = questionContainer.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach(input => {
        input.checked = false;
    });
    
    // Clear textareas
    const textareas = questionContainer.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
        const charCountDisplay = textarea.parentElement.querySelector('.char-count');
        if (charCountDisplay) {
            const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
            charCountDisplay.textContent = `0/${maxLength} characters`;
        }
    });
    
    // Update test data
    testData.answers[questionId] = null;
    
    // If it was marked, keep it marked, otherwise set to unanswered
    if (testData.questionStatus[questionId] !== 'marked') {
        testData.questionStatus[questionId] = 'unanswered';
    }
    
    // Update UI
    updateQuestionIndicator(questionId);
    updateProgress();
}

/**
 * Update the question indicator in the sidebar
 * @param {string} questionId - The question ID
 */
function updateQuestionIndicator(questionId) {
    const btn = document.querySelector(`.question-number-btn[data-question-id="${questionId}"]`);
    if (!btn) return;
    
    // Remove existing status classes
    btn.classList.remove('answered', 'skipped', 'marked');
    
    // Add appropriate class based on status
    const status = testData.questionStatus[questionId];
    if (status === 'answered') {
        btn.classList.add('answered');
    } else if (status === 'skipped') {
        btn.classList.add('skipped');
    } else if (status === 'marked') {
        btn.classList.add('marked');
    }
    
    // Show/hide mark indicator
    const markIndicator = btn.querySelector('.mark-indicator');
    if (markIndicator) {
        markIndicator.style.display = status === 'marked' ? 'block' : 'none';
    }
}

/**
 * Update the overall progress display
 */
function updateProgress() {
    if (!testData.questionStatus) return;
    
    // Count questions by status
    let answered = 0;
    let marked = 0;
    let skipped = 0;
    
    for (const questionId in testData.questionStatus) {
        const status = testData.questionStatus[questionId];
        if (status === 'answered') answered++;
        else if (status === 'marked') marked++;
        else if (status === 'skipped') skipped++;
    }
    
    const total = Object.keys(testData.questionStatus).length;
    const remaining = total - answered - marked - skipped;
    
    // Update counters
    document.getElementById('answeredCount').textContent = answered;
    document.getElementById('markedCount').textContent = marked;
    document.getElementById('skippedCount').textContent = skipped;
    document.getElementById('remainingCount').textContent = remaining;
    
    // Update progress text
    document.getElementById('progressInfo').textContent = `${answered} of ${total} questions answered`;
    
    // Update progress bar
    const progressPercentage = Math.round((answered / total) * 100);
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
    }
}

/**
 * Show the summary screen
 */
function showSummary() {
    // Hide all questions
    document.querySelectorAll('.question-container').forEach(container => {
        container.classList.remove('active-question');
    });
    
    // Remove active state from all question buttons
    document.querySelectorAll('.question-number-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Generate summary content
    generateSummary();
    
    // Show summary container
    document.getElementById('summaryContainer').classList.add('active-question');
}

/**
 * Generate the summary content
 */
function generateSummary() {
    const summaryList = document.getElementById('summaryList');
    summaryList.innerHTML = '';
    
    // Exit if no questions
    if (!questions || !questions.length) return;
    
    // Generate summary items
    questions.forEach((question, index) => {
        const questionId = question.questionId;
        const status = testData.questionStatus[questionId];
        const answer = testData.answers[questionId];
        
        // Create summary item
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        
        // Determine status class and text
        let statusClass = 'status-unanswered';
        let statusText = 'Not Answered';
        
        if (status === 'answered') {
            statusClass = 'status-answered';
            statusText = 'Answered';
        } else if (status === 'marked') {
            statusClass = 'status-marked';
            statusText = 'Marked for Review';
        } else if (status === 'skipped') {
            statusClass = 'status-skipped';
            statusText = 'Skipped';
        }
        
        // Generate answer text
        let answerText = 'No answer provided';
        if (answer) {
            if (question.questionType === 'Multiple Choice') {
                const optionIds = answer.split(',');
                const selectedOptions = question.options
                    .filter(option => optionIds.includes(option.optionId.toString()))
                    .map(option => option.optionText);
                
                answerText = selectedOptions.join(', ');
            } else if (question.questionType === 'Single Choice' || question.questionType === 'True/False') {
                const selectedOption = question.options.find(option => option.optionId.toString() === answer);
                answerText = selectedOption ? selectedOption.optionText : 'No answer provided';
            } else {
                // For text-based answers, show truncated answer
                answerText = answer.length > 50 ? answer.substring(0, 50) + '...' : answer;
            }
        }
        
        // Build summary item HTML
        summaryItem.innerHTML = `
            <div>
                <strong>${index + 1}. ${question.questionText.length > 70 ? question.questionText.substring(0, 70) + '...' : question.questionText}</strong>
                <div class="mt-1 text-muted small">
                    <i class="fas fa-check-circle me-1"></i> ${answerText}
                </div>
            </div>
            <div>
                <span class="question-status ${statusClass}">${statusText}</span>
                <button type="button" class="btn btn-sm btn-link" onclick="navigateToQuestion('${questionId}')">Review</button>
            </div>
        `;
        
        summaryList.appendChild(summaryItem);
    });
    
    // Add warning for unanswered questions
    const unansweredCount = Object.values(testData.questionStatus).filter(status => status === 'unanswered').length;
    if (unansweredCount > 0) {
        const warningElement = document.createElement('div');
        warningElement.className = 'alert alert-warning mt-3';
        warningElement.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            <strong>Warning:</strong> You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}.
        `;
        summaryList.appendChild(warningElement);
    }
}

/**
 * Continue the test from summary
 */
function continueTest() {
    // Hide summary container
    document.getElementById('summaryContainer').classList.remove('active-question');
    
    // Find the first unanswered or marked question
    let navigateToId = null;
    for (const questionId in testData.questionStatus) {
        const status = testData.questionStatus[questionId];
        if (status === 'unanswered' || status === 'marked') {
            navigateToId = questionId;
            break;
        }
    }
    
    // If all questions are answered, go to the first question
    if (!navigateToId && questions && questions.length > 0) {
        navigateToId = questions[0].questionId;
    }
    
    // Navigate to the question
    if (navigateToId) {
        navigateToQuestion(navigateToId);
    }
}

/**
 * Submit all responses to the server
 */
function submitTest() {
    // Show a loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-overlay';
    loadingSpinner.innerHTML = '<div class="spinner"><i class="fas fa-circle-notch fa-spin"></i></div>';
    document.body.appendChild(loadingSpinner);
    
    // Create an array to track all API requests
    const apiRequests = [];
    
    // Process each answer
    for (const questionId in testData.answers) {
        const answer = testData.answers[questionId];
        if (!answer) continue; // Skip empty answers
        
        // Find the question to determine its type
        const question = questions.find(q => q.questionId.toString() === questionId.toString());
        if (!question) continue;
        
        // Process based on question type
        if (question.questionType === 'Short Answer' || question.questionType === 'Essay') {
            // Text response
            const textResponse = {
                studentId: userId,
                questionId: parseInt(questionId),
                responseText: answer
            };
            
            // Make API call for text response
            const textRequest = fetch(`${window.location.origin}/api/responses/text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(textResponse)
            }).catch(error => {
                console.error('Error saving text response:', error);
            });
            
            apiRequests.push(textRequest);
        } else {
            // Option-based responses (Single Choice, Multiple Choice, True/False)
            let optionIds = [];
            
            if (question.questionType === 'Multiple Choice') {
                // Multiple options can be selected
                optionIds = answer.split(',');
            } else {
                // Single option selected
                optionIds = [answer];
            }
            
            // Process each selected option
            for (const optionId of optionIds) {
                const response = {
                    student: {
                        userId: userId
                    },
                    option: {
                        optionId: parseInt(optionId)
                    },
                    responseText: null
                };
                
                // Make API call for option response
                const optionRequest = fetch(`${window.location.origin}/api/responses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(response)
                }).catch(error => {
                    console.error('Error saving option response:', error);
                });
                
                apiRequests.push(optionRequest);
            }
        }
    }
    
    // Submit the form when all API calls are completed or after a timeout
    Promise.all(apiRequests)
        .then(() => {
            console.log('All responses submitted successfully');
            // Remove the loading spinner
            document.body.removeChild(loadingSpinner);
            // Submit the form to redirect to the results page
            document.getElementById('assessmentForm').submit();
        })
        .catch(error => {
            console.error('Error submitting responses:', error);
            // Remove the loading spinner and still try to submit the form
            if (document.body.contains(loadingSpinner)) {
                document.body.removeChild(loadingSpinner);
            }
            document.getElementById('assessmentForm').submit();
        });
}