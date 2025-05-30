// scripts.js - Core JavaScript functionality

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up collapsible sections in sidebar (if they exist)
    if (document.querySelectorAll('.sidebar-section-header').length) {
        setupCollapsibleSections();
    }
    
    // Handle responsive layout
    window.addEventListener('resize', handleResponsiveLayout);
    handleResponsiveLayout();
    
    // Initialize table functionality
    initializeTable();

    connectConfirmButton();

    connectClearButton();

});

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

// Handle responsive layout adjustments
function handleResponsiveLayout() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Add responsive data attributes to table cells
        addTableResponsiveAttributes();
    }
}

// Add data-label attributes to table cells for responsive design
function addTableResponsiveAttributes() {
    const tableRows = document.querySelectorAll('.results-table-container tbody tr');
    const headerTexts = [
        'Select', 'Last Name', 'First Name', 'Score', 
        'Start Date', 'End Date', 'Time', 'Passed', 'Date'
    ];
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            if (index < headerTexts.length) {
                cell.setAttribute('data-label', headerTexts[index]);
            }
        });
    });
}

// Initialize all table functionality
// Initialize all table functionality
function initializeTable() {
    // Check all checkboxes functionality
    setupCheckboxes();

    // Setup table sorting
    setupTableSorting();
    
    // Setup table filters
    setupTableFilters();
    
    // Setup pagination
    setupPagination();
    
    // Setup row click functionality
    setupRowClicks();
    
    // Setup date filter dropdown
    setupDateFilter();
    
    // Setup date filter input boxes
    setupDateFilterInputs();
    
    // Setup refresh button
    setupRefreshButton();
}

// Setup checkbox functionality
function setupCheckboxes() {
    const checkAllBox = document.getElementById('checkAll');
    if (!checkAllBox) return;
    
    checkAllBox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('tbody .form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkAllBox.checked;
        });
    });

    // Update the check all box state based on individual checkboxes
    const individualCheckboxes = document.querySelectorAll('tbody .form-check-input');
    individualCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = [...individualCheckboxes].every(cb => cb.checked);
            const someChecked = [...individualCheckboxes].some(cb => cb.checked);
            
            checkAllBox.checked = allChecked;
            checkAllBox.indeterminate = someChecked && !allChecked;
        });
    });
}

// Setup table sorting functionality
function setupTableSorting() {
    const sortableColumns = document.querySelectorAll('.sortable-column');
    
    sortableColumns.forEach(column => {
        column.addEventListener('click', function() {
            // Remove sort indicators from all columns
            sortableColumns.forEach(col => {
                col.classList.remove('asc', 'desc', 'active');
            });
            
            // Determine sort direction
            let sortDirection = 'asc';
            if (this.classList.contains('asc')) {
                sortDirection = 'desc';
            }
            
            // Add sort indicator to current column
            this.classList.add(sortDirection, 'active');
            
            // Get column index (skip checkbox column)
            const columnIndex = Array.from(this.parentNode.children).indexOf(this);
            
            // Sort the table
            sortTable(columnIndex, sortDirection);
        });
    });
}

// Sort table function
function sortTable(columnIndex, direction) {
    const table = document.querySelector('.results-table-container table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Sort the rows
    const sortedRows = rows.sort((a, b) => {
        const aValue = a.children[columnIndex].textContent.trim();
        const bValue = b.children[columnIndex].textContent.trim();
        
        // Handle date columns
        if (columnIndex === 4 || columnIndex === 5) {
            const aDate = new Date(aValue.split('\n')[0]);
            const bDate = new Date(bValue.split('\n')[0]);
            return direction === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // Handle score column
        if (columnIndex === 3) {
            const aMatch = aValue.match(/\d+(\.\d+)?/);
            const bMatch = bValue.match(/\d+(\.\d+)?/);
            
            const aScore = parseFloat(aMatch ? aMatch[0] : 0);
            const bScore = parseFloat(bMatch ? bMatch[0] : 0);
            
            // Handle "Pending" scores
            const aPending = aValue.includes('Pending');
            const bPending = bValue.includes('Pending');
            
            if (aPending && !bPending) return direction === 'asc' ? -1 : 1;
            if (!aPending && bPending) return direction === 'asc' ? 1 : -1;
            if (aPending && bPending) return 0;
            
            return direction === 'asc' ? aScore - bScore : bScore - aScore;
        }
        
        // Handle text columns
        return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });
    
    // Remove all existing rows
    rows.forEach(row => row.remove());
    
    // Append sorted rows
    sortedRows.forEach(row => tbody.appendChild(row));
}


// Setup table filters
function setupTableFilters() {
    const filterInputs = document.querySelectorAll('.filters input');
    
    filterInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            filterTable();
        });
    });
}

// Filter table function
function filterTable() {
    const filterInputs = document.querySelectorAll('.filters input');
    const tableRows = document.querySelectorAll('.results-table-container tbody tr');

    tableRows.forEach(row => {
        let shouldShow = true;

        filterInputs.forEach((input, index) => {
            if (!input.value.trim()) return;

            // Skip empty filters
            const cellElement = row.children[index + 1];
            // Corrected the optional chaining
            const cellValue = cellElement ? cellElement.textContent.toLowerCase() : '';
            const filterValue = input.value.toLowerCase();

            if (!cellValue.includes(filterValue)) {
                shouldShow = false;
            }
        });

        row.style.display = shouldShow ? '' : 'none';
    });
}


// Setup pagination
function setupPagination() {
    const pageSizeDropdown = document.getElementById('resultsPerPage');
    if (!pageSizeDropdown) return;
    
    const pageSizeOptions = document.querySelectorAll('[aria-labelledby="resultsPerPage"] .dropdown-item');
    
    pageSizeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update button text
            pageSizeDropdown.textContent = this.textContent;
            
            // Remove active class from all options
            pageSizeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Update pagination display
            updatePagination(parseInt(this.textContent));
        });
    });
    
    // Initialize with default value
    updatePagination(parseInt(pageSizeDropdown.textContent));
}

// Update pagination display
function updatePagination(rowsPerPage) {
    const tableRows = document.querySelectorAll('.results-table-container tbody tr');
    const totalRows = tableRows.length;
    
    // Calculate total pages
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    
    // Update results count
    const resultsCountDisplay = document.querySelector('.results-count');
    if (resultsCountDisplay) {
        if (totalRows === 0) {
            resultsCountDisplay.textContent = '0 - 0 of 0';
        } else {
            resultsCountDisplay.textContent = `1 - ${Math.min(rowsPerPage, totalRows)} of ${totalRows}`;
        }
    }
}

// Setup row click functionality
function setupRowClicks() {
    const tableRows = document.querySelectorAll('.table-row-clickable');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't navigate when clicking on checkbox
            if (e.target.type === 'checkbox' || e.target.closest('.form-check')) {
                return;
            }
            
            // Simulate navigation to another page
            console.log('Navigating to details page for row:', this.rowIndex);
            // In production, you would replace this with:
            // window.location.href = '/details/' + someIdentifier;
        });
    });
}

// Setup date filter dropdown
// Add this inside your setupDateFilter function after the existing code
function setupDateFilter() {
    const dateFilterDropdown = document.getElementById('dateFilterDropdown');
    if (!dateFilterDropdown) return;
    
    const dateOptions = document.querySelectorAll('[aria-labelledby="dateFilterDropdown"] .dropdown-item');
    
    dateOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update button text
            dateFilterDropdown.textContent = this.textContent;
            
            // Remove active class from all options
            dateOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Apply date filter
            applyDateFilter(this.textContent);
            
            // Initialize date range picker if custom range is selected
            if (this.id === 'customRangeOption') {
                initializeDateRangePicker();
            }
        });
    });
}


// Apply date filter
function applyDateFilter(filter) {
    const tableRows = document.querySelectorAll('.results-table-container tbody tr');
    
    // Set all rows visible by default
    tableRows.forEach(row => row.style.display = '');
    
    // Apply custom date range filter
    if (filter === 'Custom range') {
        // Show date range picker (not implemented in this example)
        console.log('Custom date range picker would be shown here');
        return;
    }
    
    // Apply pre-defined filters
    if (filter !== 'All dates') {
        const today = new Date();
        const startDate = new Date();
        
        // Calculate filter start date
        switch(filter) {
            case 'This week':
                startDate.setDate(today.getDate() - today.getDay()); // Start of current week
                break;
            case 'This month':
                startDate.setDate(1); // Start of current month
                break;
            case 'Last month':
                startDate.setMonth(today.getMonth() - 1);
                startDate.setDate(1); // Start of last month
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
        }
        
        // Filter rows
        tableRows.forEach(row => {
            const dateCell = row.querySelector('td:nth-child(9)').textContent;
            const rowDate = new Date(); // This would need actual date parsing based on your data format
            
            if (rowDate < startDate) {
                row.style.display = 'none';
            }
        });
    }
}

// Setup refresh button
function setupRefreshButton() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (!refreshBtn) return;
    
    refreshBtn.addEventListener('click', function() {
        // Add rotating class for animation
        this.classList.add('rotating');
        
        // Simulate refresh action
        setTimeout(() => {
            // Update timestamp
            const timestamp = document.querySelector('.data-timestamp');
            if (timestamp) {
                const now = new Date();
                const formattedDate = now.getFullYear() + '-' + 
                                     String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                                     String(now.getDate()).padStart(2, '0') + ' ' +
                                     String(now.getHours()).padStart(2, '0') + ':' +
                                     String(now.getMinutes()).padStart(2, '0') + ':' +
                                     String(now.getSeconds()).padStart(2, '0');
                timestamp.textContent = formattedDate;
            }
            
            // Remove rotating class
            this.classList.remove('rotating');
            
            console.log('Table refreshed at', new Date().toISOString());
        }, 1000);
    });
}

// Delete selected rows functionality
document.addEventListener('DOMContentLoaded', function() {
   // Fixed version (vanilla JS)
   Array.from(document.querySelectorAll('.action-item a')).find(el => el.textContent.includes('Delete selected'))
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const checkedRows = document.querySelectorAll('tbody .form-check-input:checked');
            if (checkedRows.length === 0) {
                alert('No rows selected for deletion');
                return;
            }
            
            // Confirm deletion
            if (confirm(`Are you sure you want to delete ${checkedRows.length} selected item(s)?`)) {
                checkedRows.forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    row.remove();
                });
                
                // Update table counts and pagination
                updateResultsCounts();
                updatePagination(parseInt(document.getElementById('resultsPerPage').textContent));
            }
        });
    }
});

// Update results counts after deletions
function updateResultsCounts() {
    const resultCountElements = document.querySelectorAll('.results-count');
    const remainingRows = document.querySelectorAll('.results-table-container tbody tr').length;
    
    resultCountElements.forEach(element => {
        if (element.closest('.results-controls')) {
            element.textContent = `Results (${remainingRows})`;
        }
    });
}






// Add event listeners to date filter input boxes
function setupDateFilterInputs() {
    // Make sure we're selecting the correct filter inputs
    const startDateFilterInput = document.querySelector('.filters td:nth-child(5) input');
    const endDateFilterInput = document.querySelector('.filters td:nth-child(6) input');
    
    if (startDateFilterInput && endDateFilterInput) {
        // Add click event listeners to both date filter inputs
        startDateFilterInput.addEventListener('click', function(e) {
            e.preventDefault();
            openDateRangePicker('start');
        });
        
        endDateFilterInput.addEventListener('click', function(e) {
            e.preventDefault();
            openDateRangePicker('end');
        });
        
        // Make them readonly to prevent direct typing
        startDateFilterInput.setAttribute('readonly', true);
        endDateFilterInput.setAttribute('readonly', true);
        
        // Add placeholder text indicating they're date filters
        startDateFilterInput.setAttribute('placeholder', 'Select date...');
        endDateFilterInput.setAttribute('placeholder', 'Select date...');
    }
}

// Function to open the date range picker with focus on either start or end date
function openDateRangePicker(focusOn) {
    // Initialize the date range picker if it hasn't been already
    initializeDateRangePicker();
    
    // Get the date range modal
    const dateRangeModal = document.getElementById('dateRangeModal');
    
    // Show the modal
    const bsModal = new bootstrap.Modal(dateRangeModal);
    bsModal.show();
    
    // Set the active date based on which filter was clicked
    currentActiveDate = focusOn;
    
    // Focus on the appropriate input inside the modal
    if (focusOn === 'start') {
        document.getElementById('startDateInput').classList.add('selected');
        document.getElementById('endDateInput').classList.remove('selected');
    } else {
        document.getElementById('endDateInput').classList.add('selected');
        document.getElementById('startDateInput').classList.remove('selected');
    }
    
    // Make sure both calendar columns are displayed
    document.querySelectorAll('.calendar-col').forEach(col => {
        col.style.display = 'block';
    });
}

// Function to apply selected date range to the filter inputs
// Function to apply selected date range to the filter inputs
function applyDateRangeToFilters() {
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');
    
    // Get the filter input elements for dates
    const dateFilterInputs = document.querySelectorAll('.filters input.form-control-borderless');
    const startDateFilterInput = dateFilterInputs[3];  // Start date is the 4th input
    const endDateFilterInput = dateFilterInputs[4];    // End date is the 5th input
    
    // Show combined date range in the start date filter input
    if (startDateInput.value && endDateInput.value) {
        // Format the date range as "YYYY-MM-DD HH:MM - YYYY-MM-DD HH:MM"
        const formattedStartDate = formatCompleteDate(startDateInput.value);
        const formattedEndDate = formatCompleteDate(endDateInput.value);
        startDateFilterInput.value = `${formattedStartDate} - ${formattedEndDate}`;
        
        // Clear the end date filter input since we're showing both dates in the start input
        endDateFilterInput.value = '';
    }
    
    // Update dropdown button to show custom range is selected
    const dateFilterDropdown = document.getElementById('dateFilterDropdown');
    if (dateFilterDropdown) {
        dateFilterDropdown.textContent = 'Custom range';
        
        // Update active class on dropdown items
        document.querySelectorAll('[aria-labelledby="dateFilterDropdown"] .dropdown-item').forEach(item => {
            item.classList.remove('active');
            if (item.id === 'customRangeOption') {
                item.classList.add('active');
            }
        });
    }
    
    // Apply the filter to the table
    filterTable();
}

// Format date to maintain YYYY-MM-DD HH:MM format
function formatCompleteDate(dateString) {
    // Ensure we have a properly formatted date
    if (!dateString) return '';
    
    // Parse the date string
    const parts = dateString.split(' ');
    if (parts.length >= 2) {
        const datePart = parts[0]; // YYYY-MM-DD
        const timePart = parts[1]; // HH:MM
        return `${datePart} ${timePart}`;
    }
    
    return dateString;
}

// Format date from the datepicker format to a more readable format for filter display
function formatDateForFilter(dateString) {
    // Convert "YYYY-MM-DD HH:MM" to "MM/DD/YYYY"
    const parts = dateString.split(' ');
    if (parts.length > 0) {
        const dateParts = parts[0].split('-');
        if (dateParts.length === 3) {
            return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        }
    }
    return dateString;
}

// Connect confirm button in the date range modal to apply filters
function connectConfirmButton() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            applyDateRangeToFilters();
            // Close the modal
            const dateRangeModal = document.getElementById('dateRangeModal');
            const bsModal = bootstrap.Modal.getInstance(dateRangeModal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
}

// Connect clear button to clear the filters
function connectClearButton() {
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            // Clear the date inputs in the modal
            document.getElementById('startDateInput').value = '';
            document.getElementById('endDateInput').value = '';
            
            // Clear the filter inputs
            const dateFilterInputs = document.querySelectorAll('.filters input.form-control-borderless');
            const startDateFilterInput = dateFilterInputs[3];
            const endDateFilterInput = dateFilterInputs[4];
            
            startDateFilterInput.value = '';
            endDateFilterInput.value = '';
            
            // Apply filter to update the table
            filterTable();
        });
    }
}






 // Your existing code...
    

    // Add this new function to initialize the date range picker
    function initializeDateRangePicker() {
        // Initialize date objects
        let startDate = new Date();
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // Default end date is one month later
        let currentActiveDate = 'start'; // 'start' or 'end'
        let activeSelector = null; // 'month' or 'year' or null
    
        // DOM elements
        const startDateInput = document.getElementById('startDateInput');
        const endDateInput = document.getElementById('endDateInput');
    
        // Month and year elements
        const monthStartEl = document.getElementById('monthStart');
        const yearStartEl = document.getElementById('yearStart');
        const monthEndEl = document.getElementById('monthEnd');
        const yearEndEl = document.getElementById('yearEnd');
    
        // Month and year selectors
        const monthSelectorStart = document.getElementById('monthSelectorStart');
        const yearSelectorStart = document.getElementById('yearSelectorStart');
        const monthSelectorEnd = document.getElementById('monthSelectorEnd');
        const yearSelectorEnd = document.getElementById('yearSelectorEnd');
    
        // Calendar days containers
        const calendarDaysStart = document.getElementById('calendarDaysStart');
        const calendarDaysEnd = document.getElementById('calendarDaysEnd');
    
        // Time input elements
        const hourInputStart = document.getElementById('hourInputStart');
        const minuteInputStart = document.getElementById('minuteInputStart');
        const hourSliderStart = document.getElementById('hourSliderStart');
        const minuteSliderStart = document.getElementById('minuteSliderStart');
    
        const hourInputEnd = document.getElementById('hourInputEnd');
        const minuteInputEnd = document.getElementById('minuteInputEnd');
        const hourSliderEnd = document.getElementById('hourSliderEnd');
        const minuteSliderEnd = document.getElementById('minuteSliderEnd');
    
        // Buttons
        const clearBtn = document.getElementById('clearBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const confirmBtn = document.getElementById('confirmBtn');
    
        // Initialize month and year selectors
        initializeMonthYearSelectors();
    
        // Initialize date inputs click event
        startDateInput.addEventListener('click', function () {
            startDateInput.classList.add('selected');
            endDateInput.classList.remove('selected');
            currentActiveDate = 'start';
        });
    
        endDateInput.addEventListener('click', function () {
            endDateInput.classList.add('selected');
            startDateInput.classList.remove('selected');
            currentActiveDate = 'end';
        });
    
        // Initialize month and year display click events
        monthStartEl.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSelector(monthSelectorStart, 'month-start', monthStartEl);
        });
    
        yearStartEl.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSelector(yearSelectorStart, 'year-start', yearStartEl);
        });
    
        monthEndEl.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSelector(monthSelectorEnd, 'month-end', monthEndEl);
        });
    
        yearEndEl.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSelector(yearSelectorEnd, 'year-end', yearEndEl);
        });
    
        // Function to toggle selector visibility
        function toggleSelector(selector, type, trigger) {
            const isActive = selector.classList.contains('active');
    
            // Hide all selectors first
            hideAllSelectors();
    
            // If it wasn't already active, show it
            if (!isActive) {
                selector.classList.add('active');
                trigger.classList.add('active');
                activeSelector = type;
    
                // Position the selector below the trigger element
                positionSelector(selector, trigger);
            }
        }
    
        // Function to position selector correctly
        function positionSelector(selector, trigger) {
            const triggerRect = trigger.getBoundingClientRect();
            const parentRect = selector.parentElement.getBoundingClientRect();
    
            // Calculate position relative to the parent container
            const top = triggerRect.bottom - parentRect.top + 5;
            const left = triggerRect.left - parentRect.left + (triggerRect.width / 2);
    
            selector.style.top = `${top}px`;
            selector.style.left = `${left}px`;
            selector.style.transform = 'translateX(-50%)';
        }
    
        // Hide selectors when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.month-year-selector') &&
                !e.target.closest('.month-display') &&
                !e.target.closest('.year-display')) {
                hideAllSelectors();
            }
        });
    
        // Stop propagation for clicks inside selectors
        document.querySelectorAll('.month-year-selector').forEach(selector => {
            selector.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });
    
        // Initialize month navigation buttons
        document.getElementById('prevMonthStart').addEventListener('click', () => navigateMonth('start', -1));
        document.getElementById('nextMonthStart').addEventListener('click', () => navigateMonth('start', 1));
        document.getElementById('prevMonthEnd').addEventListener('click', () => navigateMonth('end', -1));
        document.getElementById('nextMonthEnd').addEventListener('click', () => navigateMonth('end', 1));
    
        // Time slider events
        hourSliderStart.addEventListener('input', function () {
            const hour = parseInt(this.value);
            hourInputStart.value = hour.toString().padStart(2, '0');
            startDate.setHours(hour);
            updateDateDisplay();
        });
    
        minuteSliderStart.addEventListener('input', function () {
            const minute = parseInt(this.value);
            minuteInputStart.value = minute.toString().padStart(2, '0');
            startDate.setMinutes(minute);
            updateDateDisplay();
        });
    
        hourSliderEnd.addEventListener('input', function () {
            const hour = parseInt(this.value);
            hourInputEnd.value = hour.toString().padStart(2, '0');
            endDate.setHours(hour);
            updateDateDisplay();
        });
    
        minuteSliderEnd.addEventListener('input', function () {
            const minute = parseInt(this.value);
            minuteInputEnd.value = minute.toString().padStart(2, '0');
            endDate.setMinutes(minute);
            updateDateDisplay();
        });
    
        // Time input events
        hourInputStart.addEventListener('change', function () {
            let hour = parseInt(this.value);
            if (isNaN(hour) || hour < 0) hour = 0;
            if (hour > 23) hour = 23;
            this.value = hour.toString().padStart(2, '0');
            hourSliderStart.value = hour;
            startDate.setHours(hour);
            updateDateDisplay();
        });
    
        minuteInputStart.addEventListener('change', function () {
            let minute = parseInt(this.value);
            if (isNaN(minute) || minute < 0) minute = 0;
            if (minute > 59) minute = 59;
            this.value = minute.toString().padStart(2, '0');
            minuteSliderStart.value = minute;
            startDate.setMinutes(minute);
            updateDateDisplay();
        });
    
        hourInputEnd.addEventListener('change', function () {
            let hour = parseInt(this.value);
            if (isNaN(hour) || hour < 0) hour = 0;
            if (hour > 23) hour = 23;
            this.value = hour.toString().padStart(2, '0');
            hourSliderEnd.value = hour;
            endDate.setHours(hour);
            updateDateDisplay();
        });
    
        minuteInputEnd.addEventListener('change', function () {
            let minute = parseInt(this.value);
            if (isNaN(minute) || minute < 0) minute = 0;
            if (minute > 59) minute = 59;
            this.value = minute.toString().padStart(2, '0');
            minuteSliderEnd.value = minute;
            endDate.setMinutes(minute);
            updateDateDisplay();
        });
    
        // Restrict input to numbers only
        [hourInputStart, minuteInputStart, hourInputEnd, minuteInputEnd].forEach(input => {
            input.addEventListener('keypress', function (e) {
                if (!/^\d*$/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });
    
        // Button events
        clearBtn.addEventListener('click', function () {
            const today = new Date();
            startDate = new Date(today);
            endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + 1);
            updateCalendars();
            updateDateDisplay();
        });
    
        cancelBtn.addEventListener('click', function () {
            // Modal will be closed by Bootstrap's data-bs-dismiss attribute
        });
    
        confirmBtn.addEventListener('click', function () {
            // Update the filter dropdown button text to show the selected range
            const dateFilterDropdown = document.getElementById('dateFilterDropdown');
            if (dateFilterDropdown) {
                dateFilterDropdown.textContent = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
            }
            
            // Apply custom date filter
            applyCustomDateFilter(startDate, endDate);
        });
    
        // Helper functions
        function formatDate(date) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
        }
        
        function formatDateShort(date) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    
        function updateDateDisplay() {
            startDateInput.value = formatDate(startDate);
            endDateInput.value = formatDate(endDate);
    
            // Update time inputs and sliders
            hourInputStart.value = String(startDate.getHours()).padStart(2, '0');
            minuteInputStart.value = String(startDate.getMinutes()).padStart(2, '0');
            hourSliderStart.value = startDate.getHours();
            minuteSliderStart.value = startDate.getMinutes();
    
            hourInputEnd.value = String(endDate.getHours()).padStart(2, '0');
            minuteInputEnd.value = String(endDate.getMinutes()).padStart(2, '0');
            hourSliderEnd.value = endDate.getHours();
            minuteSliderEnd.value = endDate.getMinutes();
    
            // Highlight the days in range
            updateCalendars();
        }
    
        function navigateMonth(calendar, direction) {
            if (calendar === 'start') {
                const newDate = new Date(startDate);
                newDate.setMonth(newDate.getMonth() + direction);
                startDate = newDate;
            } else {
                const newDate = new Date(endDate);
                newDate.setMonth(newDate.getMonth() + direction);
                endDate = newDate;
            }
            updateCalendars();
            updateDateDisplay();
        }
    
        function hideAllSelectors() {
            monthSelectorStart.classList.remove('active');
            yearSelectorStart.classList.remove('active');
            monthSelectorEnd.classList.remove('active');
            yearSelectorEnd.classList.remove('active');
    
            monthStartEl.classList.remove('active');
            yearStartEl.classList.remove('active');
            monthEndEl.classList.remove('active');
            yearEndEl.classList.remove('active');
    
            activeSelector = null;
        }
    
        function initializeMonthYearSelectors() {
            // Months array
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
            // Create month selectors
            createMonthSelector(monthSelectorStart, months, 'start');
            createMonthSelector(monthSelectorEnd, months, 'end');
    
            // Create year selectors
            createYearSelector(yearSelectorStart, 'start');
            createYearSelector(yearSelectorEnd, 'end');
        }
    
        function createMonthSelector(container, months, calendarType) {
            container.innerHTML = '';
    
            // Add header
            const header = document.createElement('div');
            header.className = 'selector-header';
            header.textContent = 'Select Month';
            container.appendChild(header);
    
            // Create month grid
            const monthGrid = document.createElement('div');
            monthGrid.className = 'month-selector-grid';
            container.appendChild(monthGrid);
    
            // Add months to grid
            months.forEach((month, index) => {
                const monthEl = document.createElement('div');
                monthEl.className = 'month-option';
                monthEl.textContent = month;
                monthEl.dataset.month = index;
    
                // Select current month
                const currentDate = calendarType === 'start' ? startDate : endDate;
                if (index === currentDate.getMonth()) {
                    monthEl.classList.add('selected');
                }
    
                monthEl.addEventListener('click', function (e) {
                    e.stopPropagation();
    
                    // Update all selections
                    monthGrid.querySelectorAll('.month-option').forEach(el => {
                        el.classList.remove('selected');
                    });
                    this.classList.add('selected');
    
                    // Update date
                    const newMonth = parseInt(this.dataset.month);
                    const newDate = new Date(calendarType === 'start' ? startDate : endDate);
                    newDate.setMonth(newMonth);
    
                    if (calendarType === 'start') {
                        startDate = newDate;
                    } else {
                        endDate = newDate;
                    }
    
                    updateCalendars();
                    updateDateDisplay();
                    hideAllSelectors();
                });
    
                monthGrid.appendChild(monthEl);
            });
    
            // Add footer with close button
            addSelectorFooter(container);
        }
    
        function createYearSelector(container, calendarType) {
            container.innerHTML = '';
    
            // Add header
            const header = document.createElement('div');
            header.className = 'selector-header';
            header.textContent = 'Select Year';
            container.appendChild(header);
    
            // Create year grid
            const yearGrid = document.createElement('div');
            yearGrid.className = 'year-selector-grid';
            container.appendChild(yearGrid);
    
            // Current date
            const currentDate = calendarType === 'start' ? startDate : endDate;
            const currentYear = currentDate.getFullYear();
    
            // Generate a range of years (current year ± 10 years)
            const startYear = currentYear - 10;
            const endYear = currentYear + 10;
    
            // Add prev/next decade buttons
            const navRow = document.createElement('div');
            navRow.className = 'selector-nav';
    
            const prevDecade = document.createElement('button');
            prevDecade.className = 'decade-nav prev-decade';
            prevDecade.innerHTML = '&laquo;';
            prevDecade.setAttribute('type', 'button');
            prevDecade.addEventListener('click', function (e) {
                e.stopPropagation();
                createYearRangeSelector(container, calendarType, startYear - 20, endYear - 20);
            });
    
            const nextDecade = document.createElement('button');
            nextDecade.className = 'decade-nav next-decade';
            nextDecade.innerHTML = '&raquo;';
            nextDecade.setAttribute('type', 'button');
            nextDecade.addEventListener('click', function (e) {
                e.stopPropagation();
                createYearRangeSelector(container, calendarType, startYear + 20, endYear + 20);
            });
    
            navRow.appendChild(prevDecade);
            navRow.appendChild(nextDecade);
            yearGrid.appendChild(navRow);
    
            // Add years to grid
            for (let year = startYear; year <= endYear; year++) {
                const yearEl = document.createElement('div');
                yearEl.className = 'year-option';
                yearEl.textContent = year;
                yearEl.dataset.year = year;
    
                if (year === currentDate.getFullYear()) {
                    yearEl.classList.add('selected');
                }
    
                yearEl.addEventListener('click', function (e) {
                    e.stopPropagation();
    
                    // Update all selections
                    yearGrid.querySelectorAll('.year-option').forEach(el => {
                        el.classList.remove('selected');
                    });
                    this.classList.add('selected');
    
                    // Update date
                    const newYear = parseInt(this.dataset.year);
                    const newDate = new Date(calendarType === 'start' ? startDate : endDate);
                    newDate.setFullYear(newYear);
    
                    if (calendarType === 'start') {
                        startDate = newDate;
                    } else {
                        endDate = newDate;
                    }
    
                    updateCalendars();
                    updateDateDisplay();
                    hideAllSelectors();
                });
    
                yearGrid.appendChild(yearEl);
            }
    
            // Add footer with close button
            addSelectorFooter(container);
        }
    
        function createYearRangeSelector(container, calendarType, startYear, endYear) {
            // Store original position
            const originalTop = container.style.top;
            const originalLeft = container.style.left;
            const originalTransform = container.style.transform;
    
            // Clear container but keep positioning
            container.innerHTML = '';
    
            // Add header
            const header = document.createElement('div');
            header.className = 'selector-header';
            header.textContent = 'Select Year';
            container.appendChild(header);
    
            // Create year grid
            const yearGrid = document.createElement('div');
            yearGrid.className = 'year-selector-grid';
            container.appendChild(yearGrid);
    
            // Current date
            const currentDate = calendarType === 'start' ? startDate : endDate;
    
            // Add prev/next decade buttons
            const navRow = document.createElement('div');
            navRow.className = 'selector-nav';
    
            const prevDecade = document.createElement('button');
            prevDecade.className = 'decade-nav prev-decade';
            prevDecade.innerHTML = '&laquo;';
            prevDecade.setAttribute('type', 'button');
            prevDecade.addEventListener('click', function (e) {
                e.stopPropagation();
                createYearRangeSelector(container, calendarType, startYear - 20, endYear - 20);
            });
    
            const nextDecade = document.createElement('button');
            nextDecade.className = 'decade-nav next-decade';
            nextDecade.innerHTML = '&raquo;';
            nextDecade.setAttribute('type', 'button');
            nextDecade.addEventListener('click', function (e) {
                e.stopPropagation();
                createYearRangeSelector(container, calendarType, startYear + 20, endYear + 20);
            });
    
            navRow.appendChild(prevDecade);
            navRow.appendChild(nextDecade);
            yearGrid.appendChild(navRow);
    
            // Add years to grid
            for (let year = startYear; year <= endYear; year++) {
                const yearEl = document.createElement('div');
                yearEl.className = 'year-option';
                yearEl.textContent = year;
                yearEl.dataset.year = year;
    
                if (year === currentDate.getFullYear()) {
                    yearEl.classList.add('selected');
                }
    
                yearEl.addEventListener('click', function (e) {
                    e.stopPropagation();
    
                    // Update all selections
                    yearGrid.querySelectorAll('.year-option').forEach(el => {
                        el.classList.remove('selected');
                    });
                    this.classList.add('selected');
    
                    // Update date
                    const newYear = parseInt(this.dataset.year);
                    const newDate = new Date(calendarType === 'start' ? startDate : endDate);
                    newDate.setFullYear(newYear);
    
                    if (calendarType === 'start') {
                        startDate = newDate;
                    } else {
                        endDate = newDate;
                    }
    
                    updateCalendars();
                    updateDateDisplay();
                    hideAllSelectors();
                });
    
                yearGrid.appendChild(yearEl);
            }
    
            // Add footer with close button
            addSelectorFooter(container);
    
            // Restore positioning
            container.style.top = originalTop;
            container.style.left = originalLeft;
            container.style.transform = originalTransform;
        }
    
        function addSelectorFooter(container) {
            const footer = document.createElement('div');
            footer.className = 'selector-footer';
    
            const closeBtn = document.createElement('button');
            closeBtn.className = 'selector-close';
            closeBtn.textContent = 'Close';
            closeBtn.setAttribute('type', 'button');
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                hideAllSelectors();
            });
    
            footer.appendChild(closeBtn);
            container.appendChild(footer);
        }
    
        function updateCalendars() {
            // Update month and year display
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
            monthStartEl.textContent = months[startDate.getMonth()];
            yearStartEl.textContent = startDate.getFullYear();
            monthEndEl.textContent = months[endDate.getMonth()];
            yearEndEl.textContent = endDate.getFullYear();
    
            // Generate calendar for start date
            renderCalendar(calendarDaysStart, new Date(startDate.getFullYear(), startDate.getMonth(), 1), 'start');
    
            // Generate calendar for end date
            renderCalendar(calendarDaysEnd, new Date(endDate.getFullYear(), endDate.getMonth(), 1), 'end');
        }
    
        function renderCalendar(container, date, calendarType) {
            container.innerHTML = '';
    
            // Get the first day of the month
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            // Get the last day of the month
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
            // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
            // We need to adjust because our calendar starts with Monday as the first day
            let firstDayIndex = firstDay.getDay() - 1;
            if (firstDayIndex < 0) firstDayIndex = 6; // Sunday should be 6 in our format
    
            // Calculate previous month's days to show
            const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
            // Get the total number of days to render (maximum 42 = 6 weeks)
            const totalDays = 42;
    
            // Get today's date for highlighting
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            // Loop through all days
            for (let i = 0; i < totalDays; i++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'day';
    
                // Previous month days
                if (i < firstDayIndex) {
                    const prevMonthDay = prevMonthLastDay - firstDayIndex + i + 1;
                    dayEl.textContent = prevMonthDay;
                    dayEl.classList.add('other-month');
    
                    // Check if it's in the selected range
                    const dayDate = new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDay);
                    checkDayStatus(dayEl, dayDate);
    
                    dayEl.addEventListener('click', function () {
                        selectDay(dayDate, calendarType);
                    });
                }
                // Current month days
                else if (i < firstDayIndex + lastDay.getDate()) {
                    const currentMonthDay = i - firstDayIndex + 1;
                    dayEl.textContent = currentMonthDay;
    
                    // Check if it's today
                    const dayDate = new Date(date.getFullYear(), date.getMonth(), currentMonthDay);
                    if (dayDate.toDateString() === today.toDateString()) {
                        dayEl.classList.add('today');
                    }
    
                    // Check if it's in the selected range
                    checkDayStatus(dayEl, dayDate);
    
                    dayEl.addEventListener('click', function () {
                        selectDay(dayDate, calendarType);
                    });
                }
                // Next month days
                else {
                    const nextMonthDay = i - firstDayIndex - lastDay.getDate() + 1;
                    dayEl.textContent = nextMonthDay;
                    dayEl.classList.add('other-month');
    
                    // Check if it's in the selected range
                    const dayDate = new Date(date.getFullYear(), date.getMonth() + 1, nextMonthDay);
                    checkDayStatus(dayEl, dayDate);
    
                    dayEl.addEventListener('click', function () {
                        selectDay(dayDate, calendarType);
                    });
                }
    
                container.appendChild(dayEl);
            }
        }
    
        function checkDayStatus(dayEl, date) {
            // Check if the date is within the selected range
            date.setHours(0, 0, 0, 0);
            const startDateOnly = new Date(startDate);
            startDateOnly.setHours(0, 0, 0, 0);
            const endDateOnly = new Date(endDate);
            endDateOnly.setHours(0, 0, 0, 0);
    
            if (date.getTime() === startDateOnly.getTime()) {
                dayEl.classList.add('selected', 'range-start');
            } else if (date.getTime() === endDateOnly.getTime()) {
                dayEl.classList.add('selected', 'range-end');
            } else if (date > startDateOnly && date < endDateOnly) {
                dayEl.classList.add('in-range');
            }
        }
    
        function selectDay(date, calendarType) {
            if (calendarType === 'start') {
                // If selecting start date after end date, adjust end date
                if (date > endDate) {
                    endDate = new Date(date);
                    endDate.setDate(endDate.getDate() + 1);
                }
                startDate = new Date(date);
                startDate.setHours(parseInt(hourInputStart.value), parseInt(minuteInputStart.value));
            } else {
                // If selecting end date before start date, adjust start date
                if (date < startDate) {
                    startDate = new Date(date);
                    startDate.setDate(startDate.getDate() - 1);
                }
                endDate = new Date(date);
                endDate.setHours(parseInt(hourInputEnd.value), parseInt(minuteInputEnd.value));
            }
    
            updateCalendars();
            updateDateDisplay();
        }
    
        // Initialize calendars on modal open
        updateCalendars();
        updateDateDisplay();
    }
    
        // Initialize the date range picker when the modal is shown
        const dateRangeModal = document.getElementById('dateRangeModal');
        if (dateRangeModal) {
            dateRangeModal.addEventListener('shown.bs.modal', function() {
                initializeDateRangePicker();
            });
        }




// Add this function to apply the custom date filter
function applyCustomDateFilter(startDate, endDate) {
    // Implement the filtering logic here
    console.log("Applying custom date filter:", formatDate(startDate), "to", formatDate(endDate));
    
    // You'd typically filter your table data here based on the date range
    // For example, you might update some UI elements or make an API call
    
    // For demonstration, update a status element if it exists
    const dataTimestamp = document.querySelector('.data-timestamp');
    if (dataTimestamp) {
        const now = new Date();
        dataTimestamp.textContent = formatDate(now) + ' (filtered)';
    }
}

// Helper function for formatting dates
function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}