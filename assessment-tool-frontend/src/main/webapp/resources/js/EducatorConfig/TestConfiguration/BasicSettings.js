// scripts.js - JavaScript for test UI functionality

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize TinyMCE for description textarea
    initializeTinyMCE();
    
    // Set up collapsible sections in sidebar
    setupCollapsibleSections();
    
    // Handle category dropdown and add category button
    setupCategoryFunctionality();
    
    // Set up button event listeners
    setupButtonListeners();
    
    // Character Counter for Test Name Input
    setupCharacterCounter();
    
    // Setup Save/Create button functionality
    setupSaveButton();
    
    // Handle disabled links
    setupDisabledLinks();
	

	// Initialize activation button - should be last
	initActivationButton();
	
	
	// Add this line after all other setup calls
	   setupDisabledStateBasedOnStatus();
	   
});


// Add this function to BasicSettings.js
function setupDisabledStateBasedOnStatus() {
    // Get assessment status from the body data attribute or hidden input
    const assessmentStatus = document.body.getAttribute('data-assessment-status') || 
                           (document.getElementById('hiddenAssessmentStatus') ? 
                           document.getElementById('hiddenAssessmentStatus').value : null);

    // Statuses that should disable fields
    const readOnlyStatuses = ['active', 'frozen', 'inactive'];
    
    if (assessmentStatus && readOnlyStatuses.includes(assessmentStatus.toLowerCase())) {
        // Disable form elements
        const testNameInput = document.getElementById('test-name-input');
        const categorySelect = document.getElementById('category-select');
        const addCategoryBtn = document.querySelector('.add-category-btn');
        const activateBtn = document.querySelector('.btn-activate');
        
        if (testNameInput) testNameInput.disabled = true;
        if (categorySelect) categorySelect.disabled = true;
        if (addCategoryBtn) addCategoryBtn.disabled = true;
        if (activateBtn) activateBtn.disabled = true;
        
        // Add visual indication that fields are read-only
        if (testNameInput) testNameInput.classList.add('read-only-field');
        if (categorySelect) categorySelect.classList.add('read-only-field');
        
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




// Initialize TinyMCE editor for description
function initializeTinyMCE() {
    if (document.getElementById('description-input')) {
        try {
            console.log('Initializing TinyMCE...');

            tinymce.init({
                selector: '#description-input',
                menubar: false,
                inline: false,
                min_height: 100,
                max_height: 200,
                statusbar: false,
                resize: false,
                plugins: [
                    'advlist', 'autolink', 'link', 'lists', 'charmap', 'preview', 
                    'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic underline strikethrough | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | link | ' +
                    'forecolor backcolor',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15.1px; color:#0f2830; margin: 5px 0; }',
                setup: function (editor) {
                    editor.on('init', function () {
                        console.log('TinyMCE initialized successfully');
                    });
                },
                // Making TinyMCE responsive
                mobile: {
                    theme: 'mobile',
                    plugins: [ 'autosave', 'lists', 'autolink' ],
                    toolbar: [ 'bold', 'italic', 'underline', 'bullist', 'numlist' ]
                }
            });

            console.log('TinyMCE initialization complete');
        } catch (e) {
            console.error('Error initializing TinyMCE:', e);
        }
    } else {
        console.error('Editor element not found');
    }
}

// Set up character counter for test name input
function setupCharacterCounter() {
    const testNameInput = document.getElementById('test-name-input');
    const charCount = document.getElementById('char-count');
    const maxChars = 100;
    
    if (testNameInput && charCount) {
        // Initialize character count
        updateCharCount();
        
        // Update character count on input
        testNameInput.addEventListener('input', updateCharCount);
        
        function updateCharCount() {
            const currentLength = testNameInput.value.length;
            charCount.textContent = `${currentLength} / ${maxChars}`;
            
            // Optional: Add validation for max characters
            if (currentLength > maxChars) {
                charCount.classList.add('text-danger');
                testNameInput.value = testNameInput.value.substring(0, maxChars);
            } else {
                charCount.classList.remove('text-danger');
            }
        }
    }
}

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
                toggleIcon.classList.toggle('bi-chevron-down');
                toggleIcon.classList.toggle('bi-chevron-up');
            }
        });
    });
}

// Set up category dropdown and add category functionality
// Update in BasicSettings.js - setupCategoryFunctionality function
function setupCategoryFunctionality() {
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            console.log('Category selected:', this.value);
        });
    }
    
    // Handle "Create Module" button in modal
    const saveModuleBtn = document.getElementById('save-module-btn');
    if (saveModuleBtn) {
        saveModuleBtn.addEventListener('click', function() {
            createNewModule();
        });
    }
    
    // Support Enter key in modal input
    const newModuleNameInput = document.getElementById('new-module-name');
    if (newModuleNameInput) {
        newModuleNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                createNewModule();
            }
        });
        
        // Clear validation messages when typing
        newModuleNameInput.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            document.getElementById('module-name-validation').style.display = 'none';
        });
    }
    
    function createNewModule() {
        const newModuleName = document.getElementById('new-module-name').value.trim();
        
        // Validate module name
        if (!newModuleName) {
            document.getElementById('new-module-name').classList.add('is-invalid');
            document.getElementById('module-name-validation').style.display = 'block';
            return;
        }
        
        // Show loading state
        const saveBtn = document.getElementById('save-module-btn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Creating...';
        saveBtn.disabled = true;
        
        // Prepare module data
        const moduleData = {
            moduleName: newModuleName
        };
        
        console.log('Sending module creation request with data:', moduleData);
        
        fetch('/EducatorConfig/api/assessment-modules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moduleData)
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response body:', text);
                    throw new Error(`Network response was not ok: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                // Add the new module to the dropdown
                const option = document.createElement('option');
                option.value = data.data.moduleId;
                option.textContent = data.data.moduleName;
                option.selected = true;
                
                const categorySelect = document.getElementById('category-select');
                categorySelect.appendChild(option);
                
                // Close the modal
                const modalElement = document.getElementById('createModuleModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                
                // Clear input for next time
                document.getElementById('new-module-name').value = '';
                
                // Show confirmation message
                alert('Module created successfully!');
            } else {
                console.error('Error in response:', data.error);
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error creating module:', error);
            alert('Failed to create module: ' + error.message);
        })
        .finally(() => {
            // Reset button state
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        });
    }
}

// Set up button event listeners
function setupButtonListeners() {
    // Test info button
    const testInfoBtn = document.querySelector('.btn-test-info');
    if (testInfoBtn) {
        testInfoBtn.addEventListener('click', function() {
            console.log('Test info button clicked');
            // Navigation is handled by the link
        });
    }
    
    // Handle responsive menu toggle for mobile if needed
    window.addEventListener('resize', handleResponsiveLayout);
    handleResponsiveLayout();
}

// Handle responsive layout adjustments
function handleResponsiveLayout() {
    const isMobile = window.innerWidth < 768;
    // Additional mobile-specific adjustments if needed
}

// Setup save button functionality
// In setupSaveButton function:
function setupSaveButton() {
    const saveBtn = document.getElementById('save-button');
    const isNewAssessment = document.getElementById('is-new-assessment').value === 'true';
    const assessmentId = document.getElementById('assessment-id').value;
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Gather form data
            const testNameInput = document.getElementById('test-name-input');
            const categorySelect = document.getElementById('category-select');
            let descriptionValue = '';
            
            // Get TinyMCE content
            if (tinymce.get('description-input')) {
                descriptionValue = tinymce.get('description-input').getContent();
            } else {
                descriptionValue = document.getElementById('description-input').value;
            }
            
            // Validate required fields
            if (!testNameInput.value.trim()) {
                alert('Test name is required!');
                testNameInput.focus();
                return;
            }
            
            // Prepare data for API
            const assessmentData = {
                assessmentTitle: testNameInput.value.trim(),
                moduleId: categorySelect.value ? parseInt(categorySelect.value) : null,
                assessmentDescription: descriptionValue
            };
            
            // Send data to server
            saveAssessmentData(assessmentData, isNewAssessment, assessmentId);
        });
    }
}

// Function to save assessment data
function saveAssessmentData(assessmentData, isNewAssessment, assessmentId) {
    const saveBtn = document.getElementById('save-button');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    const url = isNewAssessment ? 
        '/EducatorConfig/TestConfiguration/SaveBasicSettings' : 
        '/EducatorConfig/TestConfiguration/UpdateBasicSettings?assessmentId=' + assessmentId;
    
    const method = isNewAssessment ? 'POST' : 'PUT';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Network response was not ok');
            });
        }
        return response.json();
    })
	.then(data => {
	    if (data.error) {
	        alert('Error: ' + data.error);
	    } else {
	        alert(isNewAssessment ? 'Test created successfully!' : 'Test updated successfully!');
	        
	        if (isNewAssessment) {
	            saveBtn.textContent = 'Save';
	            document.getElementById('is-new-assessment').value = 'false';
	            if (data.assessmentId) {
	                document.getElementById('assessment-id').value = data.assessmentId;
	                document.body.setAttribute('data-assessment-id', data.assessmentId);
	                document.getElementById('hiddenAssessmentId').value = data.assessmentId;
	                enableNavigationLinks();
	            }
	        }
	        
	        const testTitleHeader = document.getElementById('test-title-header');
	        if (testTitleHeader) {
	            testTitleHeader.textContent = assessmentData.assessmentTitle;
	        }
	    }
	})
    .catch(error => {
        console.error('Error saving assessment:', error);
        alert('Failed to save assessment: ' + error.message);
    })
    .finally(() => {
        saveBtn.disabled = false;
    });
}

// Handle disabled links
function setupDisabledLinks() {
    document.querySelectorAll('.sidebar-link.disabled').forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent navigation for disabled links
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                alert('Please create a test first before accessing this section.');
            }
        });
    });
}



// Add this new function to update navigation
function updateNavigationWithNewAssessment(assessmentId) {
    // Update all navigation links with the new assessment ID
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('data-href');
        if (href && !href.includes('BasicSettings')) {
            link.setAttribute('href', href);
        }
    });
}


// New helper function to enable navigation links
function enableNavigationLinks() {
    // Enable all sidebar links that were disabled
    document.querySelectorAll('.sidebar-link.disabled').forEach(link => {
        link.classList.remove('disabled');
        // Update the href if it's a placeholder
        if (link.getAttribute('href') === '#') {
            const newHref = link.getAttribute('data-href');
            if (newHref) {
                link.setAttribute('href', newHref);
            }
        }
    });
    
    // Enable activate button
    const activateBtn = document.querySelector('.btn-activate');
    if (activateBtn) {
        activateBtn.classList.remove('disabled');
    }
}


