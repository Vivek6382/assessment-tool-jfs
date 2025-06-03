document.addEventListener('DOMContentLoaded', function() {
    setupCollapsibleSections();
    setupButtonListeners();
    loadCurrentQuestionOrder();
	setupDisabledStateBasedOnStatus();
	
	// Initialize activation button - should be last
	initActivationButton();
});



function setupDisabledStateBasedOnStatus() {
    // Get assessment status from the body data attribute or hidden input
    const assessmentStatus = document.body.getAttribute('data-assessment-status') || 
                           (document.getElementById('hiddenAssessmentStatus') ? 
                           document.getElementById('hiddenAssessmentStatus').value : null);

    // Statuses that should disable fields
    const readOnlyStatuses = ['active', 'frozen', 'inactive'];
    
    if (assessmentStatus && readOnlyStatuses.includes(assessmentStatus.toLowerCase())) {
        // Disable form elements
        const radioButtons = document.querySelectorAll('input[name="questionOrder"]');
        const saveButton = document.getElementById('saveOrderBtn');
        const activateBtn = document.querySelector('.btn-activate');
        
        radioButtons.forEach(radio => {
            radio.disabled = true;
            radio.closest('.form-check').classList.add('read-only-field');
        });
        
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.classList.add('read-only-field');
        }
        
        if (activateBtn) {
            activateBtn.disabled = true;
            activateBtn.classList.add('read-only-field');
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

function setupButtonListeners() {
    const saveBtn = document.getElementById('saveOrderBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveQuestionOrder);
    }
}

function loadCurrentQuestionOrder() {
    try {
        // Get assessment data from Thymeleaf model
        const assessmentId = document.getElementById('assessmentId').value;
        if (!assessmentId) {
            console.error('No assessment ID found');
            return;
        }

        // Make API call to get current question order
        fetch(`/EducatorConfig/TestConfiguration/GetAssessmentById?assessmentId=${assessmentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch assessment data');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const questionOrder = data.questionOrder || 'RANDOM';
                    const radio = document.querySelector(`input[name="questionOrder"][value="${questionOrder}"]`);
                    if (radio) {
                        radio.checked = true;
                    } else {
                        document.getElementById('randomOrder').checked = true;
                    }
                } else {
                    console.error('Error loading assessment:', data.error);
                    document.getElementById('randomOrder').checked = true;
                }
            })
            .catch(error => {
                console.error('Error loading assessment:', error);
                document.getElementById('randomOrder').checked = true;
            });
    } catch (e) {
        console.error('Error loading current question order:', e);
        document.getElementById('randomOrder').checked = true;
    }
}

function saveQuestionOrder() {
    const selectedOrder = document.querySelector('input[name="questionOrder"]:checked').value;
    const saveStatus = document.getElementById('saveStatus');
    const assessmentId = document.getElementById('assessmentId').value;
    
    if (!assessmentId) {
        showStatusMessage('Error: No assessment selected', 'red');
        showToast('Please create an assessment first', 'danger');
        return;
    }
    
    // Show saving status
    showStatusMessage('Saving...', 'blue');
    
    // Create the request body
    const requestBody = {
        questionOrder: selectedOrder
    };
    
    // Make the API call with POST method
    fetch(`/EducatorConfig/TestConfiguration/SaveQuestionOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Failed to save question order');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showStatusMessage('Order saved successfully!', 'green', true);
            showToast('Question order saved successfully!', 'success');
        } else {
            const errorMsg = data.error || 'Failed to save order';
            showStatusMessage('Error: ' + errorMsg, 'red');
            showToast('Failed to save question order: ' + errorMsg, 'danger');
        }
    })
    .catch(error => {
        showStatusMessage('Error: ' + error.message, 'red');
        showToast('Error saving question order: ' + error.message, 'danger');
    });
}

function showToast(message, type) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toastEl = document.createElement('div');
    toastEl.className = `toast show align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toastEl);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 300);
    }, 3000);
}

function showStatusMessage(message, color, withCheckmark = false) {
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = message;
    saveStatus.style.color = color;
    saveStatus.style.fontWeight = 'bold';
    
    if (withCheckmark) {
        const checkmark = document.createElement('span');
        checkmark.innerHTML = ' ✓';
        checkmark.style.color = color;
        saveStatus.appendChild(checkmark);
    }
    
    // Hide status after 3 seconds
    setTimeout(() => {
        saveStatus.textContent = '';
        saveStatus.style.color = '';
    }, 3000);
}