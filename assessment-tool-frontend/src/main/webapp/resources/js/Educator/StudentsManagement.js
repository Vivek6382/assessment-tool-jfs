console.log(sessionStorage.getItem('user'));
let lastViewedStudentCourses = [];

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let mainContent = document.getElementById("main-content");

    // Toggle the 'active' class
    sidebar.classList.toggle("active");

    if (sidebar.classList.contains("active")) {
        sidebar.style.transform = "translateX(0)"; // Make sure sidebar appears
        mainContent.style.marginLeft = "250px";  // Shift main content
    } else {
        sidebar.style.transform = "translateX(-100%)"; // Hide sidebar completely
        mainContent.style.marginLeft = "0"; 
    }
}

function updateCount() {
    let textarea = document.getElementById("courseDescription");
    let charCount = document.getElementById("charCount");
    let remaining = 100 - textarea.value.length;
    charCount.textContent = remaining + " characters remaining";
    if (remaining <= 0) {
        textarea.value = textarea.value.substring(0, 100); // Trim text to 100 characters
    }
}

function updateEditCount() {
    let textarea = document.getElementById("editCourseDescription");
    let charCount = document.getElementById("charCount");
    let remaining = 100 - textarea.value.length;
    charCount.textContent = remaining + " characters remaining";
    if (remaining <= 0) {
        textarea.value = textarea.value.substring(0, 100); // Trim text to 100 characters
    }
}

// Function to get enrolled student count for a course
async function getEnrolledStudentCount(courseId) {
    try {
        const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/students`);
        if (!response.ok) {
            throw new Error(`Failed to fetch enrolled students: ${response.status}`);
        }
        const students = await response.json();
        return students.length;
    } catch (error) {
        console.error(`Error getting enrolled students for course ${courseId}:`, error);
        return 0;
    }
}

async function populateTopStats() {
    try {
        const courses = [...backendCourses];
        const now = new Date();
		
		const students = [...backendStudents];

        const totalCourses = students.length;
        const activeCourses = students.filter(c => c.userStatus?.toLowerCase() === 'active').length;
        const completedCourses = students.filter(c => c.userStatus?.toLowerCase() === 'inactive').length;

        let enrolledStudentIds = new Set();

        for (const course of courses) {
            try {
                const response = await fetch(`http://localhost:8082/api/enrollments/course/${course.courseId}/students`);
                if (response.ok) {
                    const students = await response.json();
                    students.forEach(student => enrolledStudentIds.add(student.userId));
                }
            } catch (err) {
                console.error(`Error fetching students for course ${course.courseId}:`, err);
            }
        }

        // Update DOM
        document.getElementById('totalStudents').textContent = totalCourses;
        document.getElementById('activeStudents').textContent = activeCourses;
        document.getElementById('inactiveStudents').textContent = completedCourses;
        document.getElementById('enrolledStudents').textContent = enrolledStudentIds.size;

    } catch (err) {
        console.error('Error loading top stats:', err);
    }
}

// Function to initialize the Weekly Performance Chart (Spline)
function initWeeklyPerformanceChart() {
    const ctx = document.getElementById('weeklyPerformanceChart').getContext('2d');

    // Simulated dynamic weekly scores from backendCourses
    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentWeekData = labels.map(() => Math.floor(70 + Math.random() * 15)); // simulated scores
    const previousWeekData = labels.map(() => Math.floor(65 + Math.random() * 15));

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Current Week',
                    data: currentWeekData,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Previous Week',
                    data: previousWeekData,
                    borderColor: '#6c757d',
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: { display: true, text: 'Score (%)' }
                }
            }
        }
    });
}

// Function to initialize the Performance Overview Chart (Combined Bar and Line)
function initPerformanceOverviewChart() {
    const ctx = document.getElementById('performanceOverviewChart').getContext('2d');

    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    // Simulated analytics (you can map real metrics later)
    const assessments = [8, 12, 10, 14];
    const attendance = [92, 89, 94, 90];
    const passRate = [85, 83, 88, 87];

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Assessments Added',
                    data: assessments,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Attendance %',
                    data: attendance,
                    borderColor: '#2ecc71',
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    yAxisID: 'y1'
                },
                {
                    label: 'Pass Rate %',
                    data: passRate,
                    borderColor: '#f1c40f',
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Assessments Count' }
                },
                y1: {
                    beginAtZero: true,
                    min: 50,
                    max: 100,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Percentage (%)' }
                }
            }
        }
    });
}

/**
 * Global variables to track sorting state
 */
let currentSortField = null;
let currentSortDirection = 'asc';
let filteredStudents = [];

/**
 * Function to populate the students table with filtering and sorting
 * @param {Array} studentsList - Array of student objects
 * @param {Object} filters - Object containing filter criteria
 */
function populateStudentsTable(studentsList, filters = {}) {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';
    
    // Apply filters if provided
    filteredStudents = filterStudents(studentsList, filters);
    
    // Apply sorting if available
    if (currentSortField) {
        sortStudentsList(filteredStudents, currentSortField, currentSortDirection);
    }
    
    if (!filteredStudents || filteredStudents.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `
            <td colspan="8" class="text-center py-4">
                <i class="fas fa-search me-2"></i>No student records found
            </td>
        `;
        tableBody.appendChild(noDataRow);
        return;
    }
    
    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
		console.log(student.userStatus);
        const statusBadge = student.userStatus.toLowerCase() === 'active'
            ? `<span class="status-badge bg-success">Active</span>`
            : `<span class="status-badge bg-secondary">Inactive</span>`;
        
        row.innerHTML = `
            <td>${student.userId || index + 1}</td>
            <td>${student.userFirstName}</td>
            <td>${student.userLastName}</td>
            <td>${student.userEmail}</td>
            <td>${student.userMobileNumber}</td>
            <td>${student.userDepartment}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="viewStudent(${student.userId})">
                    <i class="fas fa-eye"></i>
                </button>
                
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update pagination after populating the table
    updatePagination(filteredStudents.length);
}

/**
 * Filter students based on search text and status
 * @param {Array} students - Array of student objects
 * @param {Object} filters - Object containing filter criteria
 * @returns {Array} - Filtered array of students
 */
function filterStudents(students, filters = {}) {
    if (!students) return [];
    
    return students.filter(student => {
        // Filter by search text
        const searchMatch = !filters.searchText || 
            Object.values(student).some(value => 
                value && typeof value === 'string' && 
                value.toLowerCase().includes(filters.searchText.toLowerCase())
            );
        
        // Filter by status
        const statusMatch = !filters.status || 
            filters.status === 'all' || 
            student.userStatus.toLowerCase() === filters.status.toLowerCase();
        
        return searchMatch && statusMatch;
    });
}

/**
 * Sort the students list by a specific field
 * @param {Array} students - Array of student objects to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 */
function sortStudentsList(students, field, direction) {
    students.sort((a, b) => {
        let valueA = a[field] || '';
        let valueB = b[field] || '';
        
        // Handle string comparison
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Handle sorting when column header is clicked
 * @param {string} field - Field to sort by
 */
function sortStudents(field) {
    // Toggle sort direction if clicking on the same column
    if (currentSortField === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortDirection = 'asc';
    }
    
    // Update sort icons
    updateSortIcons(field, currentSortDirection);
    
    // Repopulate table with current filters and new sorting
    const searchText = document.getElementById('studentSearch').value;
    const status = document.getElementById('studentStatus').value;
    
    populateStudentsTable(backendStudents, { searchText, status });
}

/**
 * Update the sort icons in the table headers
 * @param {string} field - Currently sorted field
 * @param {string} direction - Current sort direction
 */
function updateSortIcons(field, direction) {
    // Reset all sort icons
    document.querySelectorAll('th i.fas').forEach(icon => {
        icon.className = 'fas fa-sort';
    });
    
    // Update the current sort column icon
    const thElement = document.querySelector(`th[onclick="sortStudents('${field}')"] i`);
    if (thElement) {
        thElement.className = direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
}

/**
 * Update pagination based on number of items
 * @param {number} totalItems - Total number of items after filtering
 */
function updatePagination(totalItems) {
    const paginationElement = document.getElementById('studentsPagination');
    // Simple pagination implementation - can be enhanced for actual page switching
    if (totalItems > 0) {
        paginationElement.style.display = 'flex';
    } else {
        paginationElement.style.display = 'none';
    }
}

/**
 * Initialize event listeners for search and filter functionality
 */
function initializeStudentTableControls() {
    // Search input event listener
    const searchInput = document.getElementById('studentSearch');
    searchInput.addEventListener('input', debounce(function() {
        const searchText = this.value;
        const status = document.getElementById('studentStatus').value;
        populateStudentsTable(backendStudents, { searchText, status });
    }, 300));
    
    // Status filter event listener
    const statusSelect = document.getElementById('studentStatus');
    statusSelect.addEventListener('change', function() {
        const status = this.value;
        const searchText = document.getElementById('studentSearch').value;
        populateStudentsTable(backendStudents, { searchText, status });
    });
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Update the document ready function
document.addEventListener("DOMContentLoaded", async function () {
    await populateTopStats(); // already present
    
    // Initialize the students table with unfiltered data
    populateStudentsTable(backendStudents);
    
    // Initialize event listeners for search and filters
    initializeStudentTableControls();
    
    initWeeklyPerformanceChart(); // spline chart
    initPerformanceOverviewChart(); // line chart
	// Initialize performance table with controls
	   populateStudentPerformanceTable(backendStudents);
	   initializePerformanceTableControls();
});

// Function signature already exists in your code
function editStudent(id) {
    console.log('Editing student with ID:', id);
    // Add logic to open edit modal
}



//RESPONSIVENESS
document.addEventListener('DOMContentLoaded', function() {
    const sidenav = document.getElementById('mainSidenav');
    const toggleBtn = document.getElementById('mainSidenavToggle');
    const backdrop = document.getElementById('sidenavBackdrop');
    const mainContent = document.querySelector('.main-content-container');

    // Toggle sidenav
    toggleBtn.addEventListener('click', function() {
        sidenav.classList.toggle('active');
        backdrop.style.display = sidenav.classList.contains('active') ? 'block' : 'none';
    });

    // Close sidenav when clicking backdrop
    backdrop.addEventListener('click', function() {
        sidenav.classList.remove('active');
        backdrop.style.display = 'none';
    });

    // Close sidenav when clicking on mobile
    if (window.innerWidth < 992) {
        const navLinks = document.querySelectorAll('.main-sidenav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                sidenav.classList.remove('active');
                backdrop.style.display = 'none';
            });
        });
    }

    // Responsive handling
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            sidenav.classList.add('active');
            backdrop.style.display = 'none';
        } else {
            sidenav.classList.remove('active');
        }
    });
});


let currentViewingStudentId = null;
let studentPerformanceChart = null;

// Function to view student details
async function viewStudent(id) {
    currentViewingStudentId = id;
    
    // Find the student in the backendStudents array
    const student = backendStudents.find(s => s.userId === id);
    
    if (!student) {
        console.error('Student not found with ID:', id);
        return;
    }
	
	console.log("Students:" , student);
    
    // Populate personal info
    document.getElementById('viewFirstName').textContent = student.userFirstName || '-';
    document.getElementById('viewLastName').textContent = student.userLastName || '-';
    document.getElementById('viewEmail').textContent = student.userEmail || '-';
    document.getElementById('viewMobile').textContent = student.userMobileNumber || '-';
    document.getElementById('viewDepartment').textContent = student.userDepartment || '-';
    document.getElementById('viewStatus').textContent = student.userStatus || '-';
    document.getElementById('viewDob').textContent = student.userDob ? new Date(student.userDob).toLocaleDateString() : '-';
    document.getElementById('viewGender').textContent = student.userGender ? 
        student.userGender.charAt(0).toUpperCase() + student.userGender.slice(1) : '-';
    document.getElementById('viewQualification').textContent = student.userHighestQualification || '-';
    
    // Fetch and populate enrolled courses
    await populateEnrolledCourses(id);
    
    // Initialize performance chart
    initStudentPerformanceChart();
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('studentViewModal'));
    modal.show();
}

// Function to populate enrolled courses
async function populateEnrolledCourses(studentId) {
    try {
        const response = await fetch(`/Educator/student/${studentId}/enrolled-courses`);
        const courses = await response.json();

        console.log("Received from server:", courses);

        const tbody = document.getElementById('enrolledCoursesBody');
        tbody.innerHTML = '';

        if (!Array.isArray(courses)) {
            throw new Error("Expected array, but got: " + JSON.stringify(courses));
        }

        if (courses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        No enrolled courses found
                    </td>
                </tr>
            `;
            return;
        }

        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.courseId}</td>
                <td>${course.courseName}</td>
                <td>${course.enrollmentDate ? new Date(course.enrollmentDate).toLocaleDateString() : '-'}</td>
                <td>${course.courseEndDate ? new Date(course.courseEndDate).toLocaleDateString() : '-'}</td>
                <td><span class="status-badge ${course.status.toLowerCase() === 'active' ? 'bg-success' : 'bg-secondary'}">${course.status || '-'}</span></td>
                <td>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar" role="progressbar" style="width: ${course.progress || 0}%"
                            aria-valuenow="${course.progress || 0}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <small>${course.progress || 0}%</small>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update performance metrics
        document.getElementById('completedCoursesCount').textContent =
            courses.filter(c => c.status === 'Completed').length;

    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        const tbody = document.getElementById('enrolledCoursesBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    Error loading enrolled courses
                </td>
            </tr>
        `;
    }
}

/**
 * Global variables to track performance table state
 */
let performanceCurrentSortField = null;
let performanceCurrentSortDirection = 'asc';
let filteredPerformanceStudents = [];

/**
 * Helper function to determine score color class based on score value
 * @param {number} score - The score value (0-100)
 * @returns {string} - CSS class for coloring
 */
function getScoreColorClass(score) {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-info';
    if (score >= 40) return 'bg-warning';
    return 'bg-danger';
}

/**
 * Function to determine performance category
 * @param {number} score - The score value (0-100)
 * @returns {string} - Performance category
 */
function getPerformanceCategory(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Populate the student performance table with filtering and sorting
 * @param {Array} students - Array of student objects
 * @param {Object} filters - Object containing filter criteria
 */
async function populateStudentPerformanceTable(students, filters = {}) {
    try {
        const tableContainer = document.getElementById('studentPerformanceTableBody');
        tableContainer.innerHTML = '';
        
        // Ensure we have a valid array to work with
        if (!Array.isArray(students) || students.length === 0) {
            tableContainer.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        <i class="fas fa-search me-2"></i>No students found
                    </td>
                </tr>
            `;
            return;
        }
        
        console.log('Processing performance data for', students.length, 'students');
        
        // Enhance students with performance data if needed
        const enhancedStudents = await Promise.all(students.map(async (student, index) => {
            // Calculate student performance metrics
            let assessmentsAttended = 0;
            let totalScore = 0;
            let assessmentCount = 0;
            
            // If we have performance data already
            if (student.performance) {
                assessmentsAttended = student.performance.assessmentsAttended || 0;
                totalScore = student.performance.totalScore || 0;
                assessmentCount = student.performance.assessmentCount || 0;
            } else {
                // Fetch student course data to calculate metrics
                try {
                    const response = await fetch(`/Educator/student/${student.userId}/enrolled-courses`);
                    const courses = await response.json();
					
					console.log(courses);
                    
                    if (Array.isArray(courses)) {
                        courses.forEach(course => {
                            if (course.modules) {
                                course.modules.forEach(module => {
                                    if (module.assessments) {
                                        module.assessments.forEach(assessment => {
                                            if (assessment.completed) {
                                                assessmentsAttended++;
												console.log(assessment.score);
                                                if (assessment.score) {
                                                    totalScore += assessment.score;
                                                    assessmentCount++;
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching performance data for student ${student.userId}:`, error);
                }
            }
            
            const averageScore = assessmentCount > 0 ? Math.round(totalScore / assessmentCount) : 0;
            const performanceCategory = getPerformanceCategory(averageScore);
            
            // Return enhanced student object with performance metrics
            return {
                ...student,
                assessmentsAttended,
                averageScore,
                performanceCategory
            };
        }));
        
        // Apply filters to the enhanced students
		console.log(enhancedStudents);
        filteredPerformanceStudents = filterPerformanceStudents(enhancedStudents, filters);
        
        // Apply sorting if available
        if (performanceCurrentSortField) {
            sortPerformanceStudents(filteredPerformanceStudents, performanceCurrentSortField, performanceCurrentSortDirection);
        }
        
        if (filteredPerformanceStudents.length === 0) {
            tableContainer.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        <i class="fas fa-search me-2"></i>No matching students found
                    </td>
                </tr>
            `;
            return;
        }
		
		console.log(filteredPerformanceStudents);

        
        // Render the filtered and sorted students
        filteredPerformanceStudents.forEach((student, index) => {
            const row = document.createElement('tr');
            
            // Safely handle status display - account for potential undefined status
            const userStatus = student.userStatus || student.status || 'Inactive';
            const isActive = (userStatus.toLowerCase && userStatus.toLowerCase() === 'active') || 
                             userStatus === 'Active';
            
            const statusBadge = `
                <span class="status-badge ${isActive ? 'bg-success' : 'bg-secondary'}">
                    ${userStatus}
                </span>
            `;
			
			console.log(student);
            
            row.innerHTML = `
                <td>${student.userId || index + 1}</td>
                <td>${student.userFirstName || '-'}</td>
                <td>${student.userLastName || '-'}</td>
                <td>${student.userEmail || '-'}</td>
                <td>${statusBadge}</td>
                <td>${student.assessmentsAttended}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="progress me-2" style="height: 6px; width: 80px;">
                            <div class="progress-bar ${getScoreColorClass(student.averageScore)}" 
                                 role="progressbar" 
                                 style="width: ${student.averageScore}%" 
                                 aria-valuenow="${student.averageScore}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                            </div>
                        </div>
                        <span>${student.averageScore}/100</span>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewStudentAssessments(${student.userId})">
                        <i class="fas fa-chart-bar"></i> View
                    </button>
                </td>
            `;
            tableContainer.appendChild(row);
        });
        
        // Update pagination
        updatePerformancePagination(filteredPerformanceStudents.length);
        
    } catch (error) {
        console.error('Error populating student performance table:', error);
        document.getElementById('studentPerformanceTableBody').innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-danger">
                    Error loading student performance data
                </td>
            </tr>
        `;
    }
}

/**
 * Filter students based on search text and performance category
 * @param {Array} students - Enhanced student objects with performance data
 * @param {Object} filters - Object containing filter criteria
 * @returns {Array} - Filtered array of students
 */
function filterPerformanceStudents(students, filters = {}) {
    if (!students) return [];
    
    return students.filter(student => {
        // Filter by search text
        const searchMatch = !filters.searchText || 
            ['userFirstName', 'userLastName', 'userEmail'].some(field => 
                student[field] && typeof student[field] === 'string' && 
                student[field].toLowerCase().includes(filters.searchText.toLowerCase())
            );
        
        // Filter by performance category
        const performanceMatch = !filters.performanceCategory || 
            filters.performanceCategory === 'all' || 
            student.performanceCategory === filters.performanceCategory;
        
        return searchMatch && performanceMatch;
    });
}

/**
 * Sort the students by specified field and direction
 * @param {Array} students - Array of student objects
 * @param {string} field - Field to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 */
function sortPerformanceStudents(students, field, direction) {
    students.sort((a, b) => {
        // Special handling for average score field (numeric sort)
        if (field === 'averageScore') {
            const scoreA = a.averageScore || 0;
            const scoreB = b.averageScore || 0;
            return direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
        }
        
        // Special handling for assessments field (numeric sort)
        if (field === 'assessmentsAttended') {
            const attendedA = a.assessmentsAttended || 0;
            const attendedB = b.assessmentsAttended || 0;
            return direction === 'asc' ? attendedA - attendedB : attendedB - attendedA;
        }
        
        // Standard string comparison for other fields
        let valueA = a[field] !== undefined ? a[field] : '';
        let valueB = b[field] !== undefined ? b[field] : '';
        
        // Handle string comparison
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
        }
        if (typeof valueB === 'string') {
            valueB = valueB.toLowerCase();
        }
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Handle sort events for performance table
 * @param {string} field - Field to sort by
 */
function sortPerformanceTable(field) {
    console.log('Sorting performance table by:', field);
    
    // Toggle sort direction if clicking on the same column
    if (performanceCurrentSortField === field) {
        performanceCurrentSortDirection = performanceCurrentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        performanceCurrentSortField = field;
        performanceCurrentSortDirection = 'asc';
    }
    
    // Update sort icons
    updatePerformanceSortIcons(field, performanceCurrentSortDirection);
    
    // Get current filter values
    const searchText = document.getElementById('performanceSearch').value;
    const performanceCategory = document.getElementById('performanceFilter').value;
    
    // Repopulate table with current filters and new sorting
    populateStudentPerformanceTable(backendStudents, { 
        searchText, 
        performanceCategory 
    });
}

/**
 * Update the sort icons in the performance table headers
 * @param {string} field - Currently sorted field
 * @param {string} direction - Current sort direction
 */
function updatePerformanceSortIcons(field, direction) {
    // Reset all sort icons
    document.querySelectorAll('#StudentsPerformance th i.fas').forEach(icon => {
        icon.className = 'fas fa-sort';
    });
    
    // Update the current sort column icon
    const thElement = document.querySelector(`#StudentsPerformance th[onclick="sortPerformanceTable('${field}')"] i`);
    if (thElement) {
        thElement.className = direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
}

/**
 * Update pagination based on number of items
 * @param {number} totalItems - Total number of items after filtering
 */
function updatePerformancePagination(totalItems) {
    const paginationElement = document.getElementById('performancePagination');
    // Simple pagination implementation
    if (totalItems > 0) {
        paginationElement.style.display = 'flex';
    } else {
        paginationElement.style.display = 'none';
    }
}

/**
 * Initialize performance table controls (search and filter)
 */
function initializePerformanceTableControls() {
    // Add sort icons to sortable columns
    document.querySelectorAll('#StudentsPerformance th[onclick]').forEach(th => {
        if (!th.querySelector('i.fas')) {
            th.innerHTML += ' <i class="fas fa-sort"></i>';
        }
    });
    
    // Performance search input event listener
    const searchInput = document.getElementById('performanceSearch');
    searchInput.addEventListener('input', debounce(function() {
        const searchText = this.value;
        const performanceCategory = document.getElementById('performanceFilter').value;
        populateStudentPerformanceTable(backendStudents, { 
            searchText, 
            performanceCategory 
        });
    }, 300));
    
    // Performance filter event listener
    const filterSelect = document.getElementById('performanceFilter');
    filterSelect.addEventListener('change', function() {
        const performanceCategory = this.value;
        const searchText = document.getElementById('performanceSearch').value;
        populateStudentPerformanceTable(backendStudents, { 
            searchText, 
            performanceCategory 
        });
    });
}

// Function to view student assessments details
function viewStudentAssessments(studentId) {
	
	const student = backendStudents.find(s => s.userId === studentId);
	   
	   if (!student) {
	       console.error('Student not found:', studentId);
	       alert('Student data not found.');
	       return;
	   }
    // Fetch the student data and courses
            return fetch(`/Educator/student/${studentId}/enrolled-courses`)
                .then(response => response.json())
                .then(courses => {
					lastViewedStudentCourses = courses; // ✅ Store it for later
                    showAssessmentsDetailsModal(student, courses);
                });
}

// Function to display assessments in a modal
function showAssessmentsDetailsModal(student, courses) {
    // Calculate overall statistics
    let totalAssessments = 0;
    let completedAssessments = 0;
    let totalScore = 0;
    let scoreCount = 0;
    let courseStatistics = [];
    
    courses.forEach(course => {
        let courseTotalAssessments = 0;
        let courseCompletedAssessments = 0;
        let courseTotalScore = 0;
        let courseScoreCount = 0;
        
        if (course.modules) {
            course.modules.forEach(module => {
                if (module.assessments) {
                    module.assessments.forEach(assessment => {
                        totalAssessments++;
                        courseTotalAssessments++;
                        
                        if (assessment.completed) {
                            completedAssessments++;
                            courseCompletedAssessments++;
                            
                            if (assessment.score) {
                                totalScore += assessment.score;
                                scoreCount++;
                                
                                courseTotalScore += assessment.score;
                                courseScoreCount++;
                            }
                        }
                    });
                }
            });
        }
        
        const courseAvgScore = courseScoreCount > 0 ? Math.round(courseTotalScore / courseScoreCount) : 0;
        const courseCompletionRate = courseTotalAssessments > 0 ? 
            Math.round((courseCompletedAssessments / courseTotalAssessments) * 100) : 0;
            
        courseStatistics.push({
            courseId: course.courseId,
            courseName: course.courseName,
            totalAssessments: courseTotalAssessments,
            completedAssessments: courseCompletedAssessments,
            averageScore: courseAvgScore,
            completionRate: courseCompletionRate
        });
    });
    
    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const completionPercentage = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0;
    
    // Create course-wise assessment statistics
    let courseStatsList = '';
    
    if (courseStatistics.length > 0) {
        courseStatsList = courseStatistics.map(stat => `
            <div class="mb-3 d-flex justify-content-center">
                <div class="card" style="width: 90%; max-width: 1000px;">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${stat.courseName}</h6>
                        <span class="badge bg-${getScoreColorClass(stat.averageScore)}">
                            Avg. Score: ${stat.averageScore}/100
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p>Assessments: ${stat.completedAssessments}/${stat.totalAssessments} completed</p>
                                <div class="progress mb-3" style="height: 8px;">
                                    <div class="progress-bar bg-primary" role="progressbar" 
                                         style="width: ${stat.completionRate}%" 
                                         aria-valuenow="${stat.completionRate}" 
                                         aria-valuemin="0" 
                                         aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-sm btn-outline-primary float-end" 
                                        onclick="viewDetailedAssessments(${stat.courseId})">
                                    View Detailed Assessments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        courseStatsList = '<div class="alert alert-info">No courses available for this student</div>';
    }

    // Create or update modal
    let modal = document.getElementById('assessmentsDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'assessmentsDetailsModal';
        modal.className = 'modal fade';
        modal.tabIndex = '-1';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Assessment Performance: ${student.userFirstName} ${student.userLastName}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Performance Overview -->
                    <div class="card mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Overall Performance</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <h6>Assessment Completion</h6>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <div class="position-relative" style="width: 100px; height: 100px;">
                                            <div class="position-absolute top-50 start-50 translate-middle">
                                                <h4 class="mb-0">${completionPercentage}%</h4>
                                            </div>
                                            <svg width="100" height="100" viewBox="0 0 36 36">
                                                <path class="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    stroke-width="3" />
                                                <path class="circle"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#4e73df"
                                                    stroke-width="3"
                                                    stroke-dasharray="${completionPercentage}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <span>${completedAssessments}/${totalAssessments} completed</span>
                                    </div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <h6>Average Score</h6>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <div class="position-relative" style="width: 100px; height: 100px;">
                                            <div class="position-absolute top-50 start-50 translate-middle">
                                                <h4 class="mb-0">${averageScore}</h4>
                                            </div>
                                            <svg width="100" height="100" viewBox="0 0 36 36">
                                                <path class="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    stroke-width="3" />
                                                <path class="circle"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#36b9cc"
                                                    stroke-width="3"
                                                    stroke-dasharray="${averageScore}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <span>out of 100 points</span>
                                    </div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <h6>Course Progress</h6>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <div class="position-relative" style="width: 100px; height: 100px;">
                                            <div class="position-absolute top-50 start-50 translate-middle">
                                                <h4 class="mb-0">${Math.round(courses.reduce((sum, course) => sum + (course.progress || 0), 0) / (courses.length || 1))}%</h4>
                                            </div>
                                            <svg width="100" height="100" viewBox="0 0 36 36">
                                                <path class="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    stroke-width="3" />
                                                <path class="circle"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#1cc88a"
                                                    stroke-width="3"
                                                    stroke-dasharray="${Math.round(courses.reduce((sum, course) => sum + (course.progress || 0), 0) / (courses.length || 1))}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <span>${courses.length} Course${courses.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Course-wise Assessment Statistics -->
                    <h6 class="mb-3 ms-4 fw-bold">Assessment Performance by Course</h6>
                    ${courseStatsList}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    // Show the modal (requires Bootstrap JS)
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Function to view detailed assessments for a specific course
function viewDetailedAssessments(courseId) {
    // First dismiss the current modal
    const currentModal = bootstrap.Modal.getInstance(document.getElementById('assessmentsDetailsModal'));
    currentModal.hide();
    
	// Use the already fetched courses list
	    const course = lastViewedStudentCourses.find(c => c.courseId === courseId);

	    if (course) {
	        showAssessmentsModal(course);
	    } else {
	        alert("Course details not available.");
	    }
}


// Function to show detailed assessments modal for a specific course
function showAssessmentsModal(course) {
    // Create or update modal
    let modal = document.getElementById('courseAssessmentsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'courseAssessmentsModal';
        modal.className = 'modal fade';
        modal.tabIndex = '-1';
        document.body.appendChild(modal);
    }

    // Prepare assessment details
    let assessmentDetails = '';
    let totalScore = 0;
    let scoreCount = 0;
    let completedCount = 0;
    let totalAssessments = 0;
	
	console.log(course);
	console.log(course.modules);

    // Process modules and assessments
    if (course.modules && course.modules.length > 0) {
        course.modules.forEach(module => {
            if (module.assessments && module.assessments.length > 0) {
                totalAssessments += module.assessments.length;
                
                assessmentDetails += `
                    <div class="card mb-3">
                        <div class="card-header">
                            <h5 class="mb-0">${module.moduleName}</h5>
                            <small class="text-muted">
                                ${module.startDate ? new Date(module.startDate).toLocaleDateString() : 'No start date'} - 
                                ${module.endDate ? new Date(module.endDate).toLocaleDateString() : 'No end date'}
                            </small>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Assessment</th>
                                            <th>Status</th>
                                            <th>Due Date</th>
                                            <th>Score</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                `;

                module.assessments.forEach(assessment => {
                    const completed = assessment.completed || false;
                    const score = assessment.score || 0;
                    const maxScore = assessment.maxScore || 100;
                    
                    if (completed) {
                        completedCount++;
                        if (assessment.score) {
                            totalScore += score;
                            scoreCount++;
                        }
                    }

                    assessmentDetails += `
                        <tr>
                            <td>${assessment.assessmentName || 'Unnamed Assessment'}</td>
                            <td>
                                <span class="badge ${completed ? 'bg-success' : 'bg-warning'}">
                                    ${completed ? 'Completed' : 'Pending'}
                                </span>
                            </td>
                            <td>${assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : '-'}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="progress me-2" style="height: 6px; width: 80px;">
                                        <div class="progress-bar ${getScoreColorClass(score)}" 
                                             role="progressbar" 
                                             style="width: ${score}%" 
                                             aria-valuenow="${score}" 
                                             aria-valuemin="0" 
                                             aria-valuemax="${maxScore}">
                                        </div>
                                    </div>
                                    <span>${score}/${maxScore}</span>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" 
                                        onclick="viewAssessmentDetails(${assessment.assessmentId})">
                                    <i class="fas fa-info-circle"></i> Details
                                </button>
                            </td>
                        </tr>
                    `;
                });

                assessmentDetails += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                assessmentDetails += `
                    <div class="alert alert-info mb-3">
                        No assessments found for module: ${module.moduleName}
                    </div>
                `;
            }
        });
    } else {
        assessmentDetails = `
            <div class="alert alert-info">
                No modules or assessments found for this course
            </div>
        `;
    }

    // Calculate average score
    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const completionPercentage = totalAssessments > 0 ? Math.round((completedCount / totalAssessments) * 100) : 0;

    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Assessment Details: ${course.courseName}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Performance Summary -->
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="card-title">Course Progress</h6>
                                    <div class="d-flex justify-content-center">
                                        <div class="position-relative" style="width: 120px; height: 120px;">
                                            <div class="position-absolute top-50 start-50 translate-middle">
                                                <h3 class="mb-0">${course.progress || 0}%</h3>
                                            </div>
                                            <svg width="120" height="120" viewBox="0 0 36 36">
                                                <path class="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    stroke-width="3" />
                                                <path class="circle"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#4e73df"
                                                    stroke-width="3"
                                                    stroke-dasharray="${course.progress || 0}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="card-title">Assessment Completion</h6>
                                    <div class="d-flex justify-content-center">
                                        <div class="position-relative" style="width: 120px; height: 120px;">
                                            <div class="position-absolute top-50 start-50 translate-middle">
                                                <h3 class="mb-0">${completionPercentage}%</h3>
                                            </div>
                                            <svg width="120" height="120" viewBox="0 0 36 36">
                                                <path class="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    stroke-width="3" />
                                                <path class="circle"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#1cc88a"
                                                    stroke-width="3"
                                                    stroke-dasharray="${completionPercentage}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p class="mb-0">${completedCount} of ${totalAssessments} assessments completed</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="card-title">Average Score</h6>
                                    <div class="d-flex justify-content-center">
                                        <div class="position-relative" style="width: 120px; height: 120px;">
                                            <div class="position-absolute top-50 start-50 translate-middle">
                                                <h3 class="mb-0">${averageScore}</h3>
                                            </div>
                                            <svg width="120" height="120" viewBox="0 0 36 36">
                                                <path class="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    stroke-width="3" />
                                                <path class="circle"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#36b9cc"
                                                    stroke-width="3"
                                                    stroke-dasharray="${averageScore}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p class="mb-0">out of 100 points</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Assessment Details -->
                    <h5 class="mb-3">Module Assessments</h5>
                    ${assessmentDetails}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    // Show the modal (requires Bootstrap JS)
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Function to initialize performance chart
function initStudentPerformanceChart() {
    const ctx = document.getElementById('studentPerformanceChart').getContext('2d');
    
    // Destroy previous chart if exists
    if (studentPerformanceChart) {
        studentPerformanceChart.destroy();
    }
    
    // Sample data - replace with actual data from API
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const performanceData = labels.map(() => Math.floor(60 + Math.random() * 35));
    
    studentPerformanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance Score',
                data: performanceData,
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
			maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: { display: true, text: 'Score (%)' }
                }
            }
        }
    });
    
    // Update performance metrics with random data (replace with actual API data)
    document.getElementById('overallScore').textContent = `${Math.floor(70 + Math.random() * 20)}%`;
    document.getElementById('avgAttendance').textContent = `${Math.floor(80 + Math.random() * 15)}%`;
    document.getElementById('assignmentsCompleted').textContent = `${Math.floor(5 + Math.random() * 10)}`;
}