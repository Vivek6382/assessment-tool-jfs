document.addEventListener('DOMContentLoaded', function() {
    // Initialize toasts
    const successToast = new bootstrap.Toast(document.getElementById('successToast'));
    const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

    // Get elements
    const passingScoreInput = document.getElementById('passingScoreInput');
    const unitSelect = document.getElementById('unitSelect');
    const unitDisplay = document.getElementById('unitDisplay');
    const passingScoreError = document.getElementById('passingScoreError');
    const saveBtn = document.querySelector('.btn-success');
    const maxScoreDisplay = document.querySelector('.max-score-display span');

    // Initialize variables
    let maxPossibleScore = maxScoreDisplay ? parseInt(maxScoreDisplay.textContent) || 0 : 0;
    let currentUnit = unitSelect ? unitSelect.value : 'POINTS';

    // Check assessment status and disable activation button if needed
    const assessmentStatus = document.body.getAttribute('data-assessment-status') || 
                           document.getElementById('hiddenAssessmentStatus').value;
    
    const readOnlyStatuses = ['active', 'frozen', 'inactive'];
    const activateBtn = document.querySelector('.btn-activate');
    
    if (activateBtn && assessmentStatus && readOnlyStatuses.includes(assessmentStatus.toLowerCase())) {
        activateBtn.disabled = true;
        activateBtn.classList.add('disabled');
    }

    // Input handling
    if (passingScoreInput) {
        passingScoreInput.addEventListener('input', function(e) {
            // Allow backspace and delete
            if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
                return;
            }
            
            // Ensure only numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Validate immediately
            validatePassingScore();
        });

        passingScoreInput.addEventListener('change', validatePassingScore);
    }

    // Unit change handling
    if (unitSelect) {
        unitSelect.addEventListener('change', function() {
            currentUnit = this.value;
            if (unitDisplay) {
                unitDisplay.textContent = this.value === 'PERCENT' ? '%' : 'p.';
            }
            validatePassingScore();
        });
    }

    // Save button handling
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validatePassingScore()) {
                saveGradingSummary();
            }
        });
    }

    // Validation function
    function validatePassingScore() {
        if (!passingScoreInput) return false;
        
        const value = parseInt(passingScoreInput.value) || 0;
        
        if (value < 0) {
            showError('Passing score cannot be negative');
            return false;
        }
        
        if (currentUnit === 'POINTS' && value > maxPossibleScore) {
            showError('Passing score cannot exceed maximum possible score (' + maxPossibleScore + 'p)');
            return false;
        }
        
        if (currentUnit === 'PERCENT' && value > 100) {
            showError('Percentage cannot exceed 100%');
            return false;
        }
        
        clearError();
        return true;
    }

    // Save function
    function saveGradingSummary() {
        if (!passingScoreInput) return;
        
        // Get assessment ID from hidden input or data attribute
        const assessmentId = document.body.getAttribute('data-assessment-id') || 
                           document.getElementById('hiddenAssessmentId').value;
        
        if (!assessmentId) {
            showErrorToast('No assessment selected');
            return;
        }

        const data = {
            passingScore: parseInt(passingScoreInput.value) || 0,
            unit: currentUnit
        };

        // Show loading state
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
        }

        fetch('/EducatorConfig/TestConfiguration/SaveGradingSummary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(result) {
            if (result.success) {
                showSuccessToast('Settings saved successfully');
                // Update max score if changed
                if (result.totalMarks && maxScoreDisplay) {
                    maxPossibleScore = result.totalMarks;
                    maxScoreDisplay.textContent = maxPossibleScore;
                }
            } else {
                showErrorToast(result.error || 'Failed to save settings');
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            showErrorToast('Network error - please try again');
        })
        .finally(function() {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Save';
            }
        });
    }

    // Helper functions
    function showError(message) {
        if (passingScoreInput && passingScoreError) {
            passingScoreInput.classList.add('is-invalid');
            passingScoreError.textContent = message;
            passingScoreError.style.display = 'block';
        }
    }

    function clearError() {
        if (passingScoreInput && passingScoreError) {
            passingScoreInput.classList.remove('is-invalid');
            passingScoreError.style.display = 'none';
        }
    }

    function showSuccessToast(message) {
        const toastMessage = document.getElementById('successToastMessage');
        if (toastMessage) {
            toastMessage.textContent = message;
            successToast.show();
        }
    }

    function showErrorToast(message) {
        const toastMessage = document.getElementById('errorToastMessage');
        if (toastMessage) {
            toastMessage.textContent = message;
            errorToast.show();
        }
    }

    // Initial validation
    validatePassingScore();

    // Initialize activation button if not disabled
    initActivationButton();
});

// Activation button handler
function initActivationButton() {
    var activateBtn = document.querySelector('.btn-activate:not(.disabled)');
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
            
            // Get assessment ID
            var assessmentId = document.body.getAttribute('data-assessment-id') || 
                             document.getElementById('hiddenAssessmentId').value;
            
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
                
            }, 2000);
        });
    }
}

function showSuccessMessage(message) {
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