document.addEventListener('DOMContentLoaded', function() {
    setupCollapsibleSections();
    loadTestInfo();
    setupButtonListeners();
    initActivationButton(); // Initialize the activation button handler
	

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



function loadTestInfo() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'text-center my-4';
    loadingIndicator.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
    
    const container = document.querySelector('.config-summary');
    container.innerHTML = '';
    container.appendChild(loadingIndicator);
    
    fetch('/EducatorConfig/TestInfo/GetTestInfo')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        renderTestInfo(data);
        checkConfigurationComplete(data);
    })
    .catch(error => {
        console.error('Error loading test info:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = 'Failed to load test information: ' + error.message;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    });
}

function renderTestInfo(data) {
    const container = document.querySelector('.config-summary');
    container.innerHTML = '';
    
    if (!data || !data.success || !data.assessment) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = 'No assessment data available';
        container.appendChild(errorDiv);
        return;
    }
    
    const assessment = data.assessment;
    const questionCount = data.questionCount || 0;
    const calculatedTotalMarks = data.calculatedTotalMarks || 0;
    
    // 1. Category/Module
	
	console.log(assessment);
    const categoryItem = createConfigItem(
        assessment.module && assessment.module.moduleName ? 
            `Test belongs to category: '${assessment.module.moduleName}'` : 
            'Test does not belong to any category',
        assessment.module != null,
        'Basic Settings'
    );
    container.appendChild(categoryItem);
    
    // 2. Questions
    const questionsItem = createConfigItem(
        questionCount > 0 ? 
            `${questionCount} Questions have been Created` : 
            'No questions have been created',
        questionCount > 0,
        'Question Manager'
    );
    container.appendChild(questionsItem);
    
    // 3. Question Order
    const orderItem = createConfigItem(
        assessment.questionOrder ? 
            `Question Order: ${getQuestionOrderDisplay(assessment.questionOrder)}` : 
            'No question order selected',
        assessment.questionOrder != null,
        'Test Sets'
    );
    container.appendChild(orderItem);
    
    // 4. Test Start Page
    const startPageItem = createConfigItem(
        assessment.instructionText ? 
            'Test start page content is configured' + 
            (assessment.hasInstructionTime ? ` with ${Math.floor(assessment.instructionTimeSeconds/60)} minutes instruction time` : '') : 
            'Test start page content is not configured',
        assessment.instructionText != null,
        'Test Start Page'
    );
    container.appendChild(startPageItem);
    
    // 5. Grading & Summary
    const gradingItem = createConfigItem(
        assessment.assessmentPassingScore != null && assessment.passingScoreUnit != null ?
            `Test pass mark: ${assessment.assessmentPassingScore}${assessment.passingScoreUnit === 'PERCENT' ? '%' : ' points'}` :
            'Test pass mark is not set',
        assessment.assessmentPassingScore != null && assessment.passingScoreUnit != null,
        'Grading & Summary'
    );
    container.appendChild(gradingItem);
    
    // Total marks sub-item
    const totalMarksSubItem = document.createElement('div');
    totalMarksSubItem.className = 'config-subtext';
    totalMarksSubItem.textContent = `Total marks: ${calculatedTotalMarks}`;
    gradingItem.querySelector('.config-text-group').appendChild(totalMarksSubItem);
    
    // 6. Time Settings
    const timeSettingsItem = createConfigItem(
        assessment.startDate && assessment.endDate ?
            'Test schedule is configured' :
            'Test schedule is not configured',
        assessment.startDate != null && assessment.endDate != null,
        'Time Settings'
    );
    container.appendChild(timeSettingsItem);
    
    // Schedule sub-items
    if (assessment.startDate && assessment.endDate) {
        const startDate = new Date(assessment.startDate);
        const endDate = new Date(assessment.endDate);
        
        const startDateSubItem = document.createElement('div');
        startDateSubItem.className = 'config-subtext';
        startDateSubItem.textContent = `Start Date: ${formatDateTime(startDate)}`;
        timeSettingsItem.querySelector('.config-text-group').appendChild(startDateSubItem);
        
        const endDateSubItem = document.createElement('div');
        endDateSubItem.className = 'config-subtext';
        endDateSubItem.textContent = `End Date: ${formatDateTime(endDate)}`;
        timeSettingsItem.querySelector('.config-text-group').appendChild(endDateSubItem);
        
        if (assessment.assessmentDurationMinutes) {
            const durationSubItem = document.createElement('div');
            durationSubItem.className = 'config-subtext';
            durationSubItem.textContent = `Duration: ${formatDuration(assessment.assessmentDurationMinutes)}`;
            timeSettingsItem.querySelector('.config-text-group').appendChild(durationSubItem);
        }
    }
}

function createConfigItem(text, isComplete, configPage) {
    const item = document.createElement('div');
    item.className = 'config-item';
    
    const icon = document.createElement('div');
    icon.className = 'config-icon';
    icon.innerHTML = isComplete ? 
        '<i class="bi bi-check-circle-fill text-success"></i>' : 
        '<i class="bi bi-x-circle-fill text-danger"></i>';
    item.appendChild(icon);
    
    const textGroup = document.createElement('div');
    textGroup.className = 'config-text-group';
    
    const mainText = document.createElement('p');
    mainText.className = 'config-text';
    mainText.textContent = text;
    textGroup.appendChild(mainText);
    
    const pageText = document.createElement('p');
    pageText.className = 'config-subtext text-muted';
    pageText.textContent = `Configured in: ${configPage}`;
    textGroup.appendChild(pageText);
    
    item.appendChild(textGroup);
    
    return item;
}

function getQuestionOrderDisplay(order) {
    switch(order) {
        case 'FIXED': return 'Fixed Order';
        case 'RANDOM': return 'Random Order';
        case 'DIFFICULTY': return 'Difficulty-based Order';
        default: return order;
    }
}

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function checkConfigurationComplete(data) {
    if (!data || !data.success || !data.assessment) return;
    
    const assessment = data.assessment;
    const questionCount = data.questionCount || 0;
    const isComplete = (
        assessment.module != null &&
        questionCount > 0 &&
        assessment.questionOrder != null &&
        assessment.instructionText != null &&
        assessment.assessmentPassingScore != null &&
        assessment.passingScoreUnit != null &&
        assessment.startDate != null &&
        assessment.endDate != null
    );
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.disabled = !isComplete;
    }
    
    const header = document.getElementById('config-status-header');
    if (header) {
        if (isComplete) {
            header.className = 'card-header bg-success text-white';
            header.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Configuration Completed';
        } else {
            header.className = 'card-header bg-danger text-white';
            header.innerHTML = '<i class="bi bi-x-circle-fill me-2"></i>Configuration Incomplete';
        }
    }
}

function setupButtonListeners() {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            activateAssessment();
        });
    }
}

function activateAssessment() {
    const saveBtn = document.getElementById('saveBtn');
    const originalBtnText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Activating...';
    saveBtn.disabled = true;

    fetch('/EducatorConfig/TestInfo/ActivateTest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showSuccessMessage('Test activated successfully!');
            // Refresh the page to show updated status
            setTimeout(() => window.location.reload(), 1500);
        } else {
            showErrorMessage(data.error || 'Failed to activate test');
        }
    })
    .catch(error => {
        showErrorMessage('Error activating test: ' + error.message);
    })
    .finally(() => {
        saveBtn.innerHTML = originalBtnText;
        saveBtn.disabled = false;
    });
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 3000);
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

function setupCollapsibleSections() {
    const sectionHeaders = document.querySelectorAll('.sidebar-section-header');
    
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const toggleIcon = this.querySelector('.toggle-icon');
            const nextElement = this.nextElementSibling.nextElementSibling;
            
            if (nextElement && nextElement.classList.contains('collapsible-section')) {
                nextElement.classList.toggle('collapsed');
                toggleIcon.classList.toggle('collapsed');
            }
        });
    });
}

// STANDALONE ACTIVATION HANDLER - COPY THIS TO ALL PAGES
function initActivationButton() {
    const activateBtn = document.querySelector('.btn-activate');
    if (activateBtn) {
        activateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/EducatorConfig/TestConfiguration/TestInfo';
        });
    }
}