// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize TinyMCE editor for question display only
    initTinyMCE();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up collapsible sections in sidebar
    setupCollapsibleSections();
    
    // Set up button event listeners
    setupButtonListeners();
    
    // Handle responsive layout
    window.addEventListener('resize', handleResponsiveLayout);
    handleResponsiveLayout();
    
    // Initially hide the incomplete configuration card
    toggleConfigurationView(true);
});

// Initialize TinyMCE editor for question display
function initTinyMCE() {
    tinymce.init({
        selector: '#question-editor',
        height: 200,
        menubar: false,
        statusbar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
        readonly: true // Make it read-only since we're just displaying the question
    });
}

// Set up event listeners for buttons and interactive elements
function setupEventListeners() {
    // Expand/Collapse buttons
    const expandMarkedBtn = document.querySelector('button:has(span:contains("Expand marked"))');
    const collapseAllBtn = document.querySelector('button:has(span:contains("Collapse all"))');
    
    if (expandMarkedBtn) {
        expandMarkedBtn.addEventListener('click', function() {
            console.log('Expand marked answers button clicked');
            // Implement expand marked functionality here
        });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() {
            console.log('Collapse all answers button clicked');
            // Implement collapse all functionality here
        });
    }
    
    // Score input validation for all score inputs
    const scoreInputs = document.querySelectorAll('.score-input input');
    scoreInputs.forEach(scoreInput => {
        scoreInput.addEventListener('input', function() {
            // Validate that the input is a number between 0 and the maximum points
            const maxPoints = 1; // In this example, max is 1 point
            let value = this.value.replace(/[^0-9.-]/g, '');
            
            if (value === '') {
                this.value = '-';
            } else {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < 0) {
                    this.value = '0';
                } else if (numValue > maxPoints) {
                    this.value = maxPoints.toString();
                } else {
                    this.value = numValue.toString();
                }
            }
        });
    });
    
    // Answer card collapse/expand toggle for all cards
    const toggleAnswerBtns = document.querySelectorAll('.toggle-answer');
    toggleAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardBody = this.closest('.card').querySelector('.card-body');
            if (cardBody) {
                cardBody.classList.toggle('d-none');
                // Toggle icon between up and down
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-chevron-up');
                icon.classList.toggle('bi-chevron-down');
            }
        });
    });
    
    // Filter switch for open-ended questions
    const openEndedSwitch = document.getElementById('openEndedSwitch');
    if (openEndedSwitch) {
        openEndedSwitch.addEventListener('change', function() {
            console.log('Open ended questions filter:', this.checked);
            // Implement filtering logic here
        });
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

// Set up button event listeners
function setupButtonListeners() {
    // You can add button event listeners specific to your application here
    // This function was in your second script but had no implementation
}

// Toggle configuration view
function toggleConfigurationView(completed) {
    // This function was referenced in your second script but had no implementation
    // Adding a basic implementation based on the name
    const configCard = document.querySelector('.configuration-card');
    if (configCard) {
        if (completed) {
            configCard.classList.add('d-none');
        } else {
            configCard.classList.remove('d-none');
        }
    }
}

// Handle responsive layout adjustments
function handleResponsiveLayout() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Adjust filter controls layout for mobile
        const filterControls = document.querySelector('.filter-controls > div');
        if (filterControls) {
            filterControls.classList.remove('justify-content-between');
            filterControls.classList.add('flex-column');
        }
        
        // Make sure form switch is full width on mobile
        const formSwitch = document.querySelector('.form-check.form-switch');
        if (formSwitch) {
            formSwitch.classList.add('mt-2', 'w-100');
        }
        
        // Adjust student response layout for mobile
        const studentResponseRows = document.querySelectorAll('.student-response-row');
        studentResponseRows.forEach(row => {
            row.classList.add('flex-column');
            const scoreContainer = row.querySelector('.score-container');
            if (scoreContainer) {
                scoreContainer.classList.add('mt-3', 'align-items-start');
                scoreContainer.style.width = '100%';
            }
        });
    } else {
        // Restore desktop layout
        const filterControls = document.querySelector('.filter-controls > div');
        if (filterControls) {
            filterControls.classList.add('justify-content-between');
            filterControls.classList.remove('flex-column');
        }
        
        // Remove mobile-specific classes
        const formSwitch = document.querySelector('.form-check.form-switch');
        if (formSwitch) {
            formSwitch.classList.remove('mt-2', 'w-100');
        }
        
        // Restore student response layout for desktop
        const studentResponseRows = document.querySelectorAll('.student-response-row');
        studentResponseRows.forEach(row => {
            row.classList.remove('flex-column');
            const scoreContainer = row.querySelector('.score-container');
            if (scoreContainer) {
                scoreContainer.classList.remove('mt-3', 'align-items-start');
                scoreContainer.style.width = '150px';
            }
        });
    }
}

// Helper functions for element selection
Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
};

// Add :has selector polyfill for older browsers
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

document.querySelector = (function(originalQuerySelector) {
    return function(selector) {
        // Simple implementation to handle :has() and :contains()
        if (selector.includes(':has(') || selector.includes(':contains(')) {
            // For simplicity in this implementation, manually find buttons with specific text
            if (selector.includes('button:has(span:contains("Expand marked"))')) {
                const buttons = document.querySelectorAll('button');
                for (let button of buttons) {
                    const span = button.querySelector('span');
                    if (span && span.textContent.includes('Expand marked')) {
                        return button;
                    }
                }
                return null;
            }
            else if (selector.includes('button:has(span:contains("Collapse all"))')) {
                const buttons = document.querySelectorAll('button');
                for (let button of buttons) {
                    const span = button.querySelector('span');
                    if (span && span.textContent.includes('Collapse all')) {
                        return button;
                    }
                }
                return null;
            }
        }
        // Use the original querySelector for other cases
        return originalQuerySelector.call(this, selector);
    };
})(document.querySelector);