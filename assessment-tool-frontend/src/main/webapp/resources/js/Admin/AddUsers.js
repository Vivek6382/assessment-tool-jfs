document.addEventListener('DOMContentLoaded', function() {
    const bulkSelectSection = document.getElementById('bulkSelectSection');
    const educatorFormsContainer = document.getElementById('educatorFormsContainer');
    const proceedButton = document.getElementById('proceedToForms');
    const educatorCountSelect = document.getElementById('educatorCount');
    const userCountDisplay = document.getElementById('userCountDisplay');
    const saveAndProceedButton = document.getElementById('saveAndProceed');
    const addUsersButton = document.getElementById('addUsersButton');
    const generatePasswordButton = document.getElementById('generatePassword');
    const totalEducatorsInput = document.getElementById('totalEducatorsCount');
    const currentEducatorIndexInput = document.getElementById('currentEducatorIndex');
    const hiddenEducatorsData = document.getElementById('hiddenEducatorsData');
    
    let currentUserIndex = 1;
    let totalUsers = 1;
    let educatorsData = []; // To store multiple educators' data
    let currentRole = 'educator'; // Default role

    // Proceed to forms
    proceedButton.addEventListener('click', function() {
        totalUsers = parseInt(educatorCountSelect.value);
        currentRole = document.querySelector("select[name='role']").value;
        totalEducatorsInput.value = totalUsers;
        userCountDisplay.textContent = `Adding User 1 of ${totalUsers}`;
        bulkSelectSection.style.display = 'none';
        educatorFormsContainer.style.display = 'block';
        
        // Set the selected role in the hidden field
        document.getElementById("selectedRole").value = currentRole;
        
        // Hide educator extra fields if role is student
        if (currentRole === 'student') {
            document.getElementById('educatorExtraFields').style.display = 'none';
        }
    });

    // Generate random password
    if (generatePasswordButton) {
        generatePasswordButton.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const randomPassword = generateRandomPassword(10);
            passwordInput.value = randomPassword;
            passwordInput.type = 'text'; // Show the password
            
            // Hide the password after 3 seconds
            setTimeout(() => {
                passwordInput.type = 'password';
            }, 3000);
        });
    }

    // Function to generate random password
    function generateRandomPassword(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // Section navigation
    const nextButtons = document.querySelectorAll('.next-section');
    const prevButtons = document.querySelectorAll('.prev-section');
    const sections = [
        document.getElementById('personalInfoSection'),
        document.getElementById('accountDetailsSection'),
        document.getElementById('additionalInfoSection')
    ];
    const stepIndicators = document.querySelectorAll('.step');

    nextButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (index < sections.length - 1) {
                // Basic validation for the current section
                const currentSection = sections[index];
                const requiredFields = currentSection.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                if (!isValid) {
                    alert('Please fill all required fields before proceeding.');
                    return;
                }
                
                sections[index].style.display = 'none';
                sections[index + 1].style.display = 'block';
                
                // Update step indicators
                stepIndicators[index].classList.remove('active');
                stepIndicators[index].classList.add('completed');
                stepIndicators[index + 1].classList.add('active');
                
                // If moving to additional info section and role is student, skip to submit
                if (index + 1 === 2 && currentRole === 'student') {
                    // Hide the educator extra fields
                    document.getElementById('educatorExtraFields').style.display = 'none';
                    
                    // If this is the last user, show submit button
                    if (currentUserIndex === totalUsers) {
                        saveAndProceedButton.style.display = 'none';
                        addUsersButton.classList.remove('d-none');
                    } else {
                        // Save current user's data and proceed to next
                        saveCurrentUserData();
                    }
                }
            }
        });
    });

    prevButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (index < sections.length) {
                sections[index + 1].style.display = 'none';
                sections[index].style.display = 'block';
                
                // Update step indicators
                stepIndicators[index + 1].classList.remove('active');
                stepIndicators[index].classList.add('active');
                stepIndicators[index].classList.remove('completed');
                
                // Show educator extra fields if they were hidden
                if (currentRole === 'educator') {
                    document.getElementById('educatorExtraFields').style.display = 'block';
                }
            }
        });
    });

    // Function to collect all form data
    function collectFormData() {
        const form = document.getElementById('educatorForm');
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Skip the hidden tracking fields
            if (key !== 'totalEducatorsCount' && key !== 'currentEducatorIndex') {
                data[key] = value;
            }
        }
        
        return data;
    }

    // Function to add hidden fields for storing educators data
    function addHiddenFields(educatorData, index) {
        for (const [key, value] of Object.entries(educatorData)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = value;
            hiddenEducatorsData.appendChild(hiddenField);
        }
    }

    // Function to clear all form fields
    function clearFormFields() {
        const form = document.getElementById('educatorForm');
        const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
        
        inputs.forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
                input.classList.remove('is-invalid');
            }
        });
        
        // Reset step indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index === 0) indicator.classList.add('active');
        });
        
        // Reset sections
        sections.forEach((section, index) => {
            section.style.display = index === 0 ? 'block' : 'none';
        });
        
        // Show educator extra fields if role is educator
        if (currentRole === 'educator') {
            document.getElementById('educatorExtraFields').style.display = 'block';
        }
    }

    // Function to save current user data and proceed
    function saveCurrentUserData() {
        // Save current educator's data
        const educatorData = collectFormData();
        educatorsData.push(educatorData);
        
        // Add hidden fields for this educator
        addHiddenFields(educatorData, currentUserIndex - 1);
        
        if (currentUserIndex < totalUsers) {
            currentUserIndex++;
            currentEducatorIndexInput.value = currentUserIndex;
            userCountDisplay.textContent = `Adding User ${currentUserIndex} of ${totalUsers}`;
            
            // Clear form fields for the next educator
            clearFormFields();
        } else {
            saveAndProceedButton.style.display = 'none';
            addUsersButton.classList.remove('d-none');
        }
    }

    saveAndProceedButton.addEventListener('click', function() {
        // For educators, validate additional fields
        if (currentRole === 'educator') {
            const requiredFields = sections[2].querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                alert('Please fill all required fields before proceeding.');
                return;
            }
        }
        
        saveCurrentUserData();
    });

    // Form submission
    document.getElementById('educatorForm').addEventListener('submit', function(event) {
        // If it's the last educator and we haven't saved their data yet
        if (currentUserIndex === totalUsers && saveAndProceedButton.style.display !== 'none') {
            event.preventDefault(); // Prevent default submission
            
            // Use the "Save and Proceed" button's click handler
            saveAndProceedButton.click();
            
            // After the data is saved, submit the form
            setTimeout(() => {
                document.getElementById('educatorForm').submit();
            }, 100);
        }
    });
});