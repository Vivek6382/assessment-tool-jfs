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

function initWeeklyPerformanceChart() {
    const ctx = document.getElementById('weeklyPerformanceChart').getContext('2d');

    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentWeekData = new Array(7).fill(0);
    const currentWeekCounts = new Array(7).fill(0);
    const previousWeekData = new Array(7).fill(0);
    const previousWeekCounts = new Array(7).fill(0);

    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay()); // Sunday start
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    backendResults.forEach(r => {
        if (!r.completedDate) return;
        const completedDate = new Date(r.completedDate);
        const dayOfWeek = completedDate.getDay();

        if (completedDate >= currentWeekStart) {
            currentWeekData[dayOfWeek] += r.resultPercentage || 0;
            currentWeekCounts[dayOfWeek]++;
        } else if (completedDate >= previousWeekStart) {
            previousWeekData[dayOfWeek] += r.resultPercentage || 0;
            previousWeekCounts[dayOfWeek]++;
        }
    });

    // Calculate average per day
    for (let i = 0; i < 7; i++) {
        if (currentWeekCounts[i] > 0) {
            currentWeekData[i] = Math.round(currentWeekData[i] / currentWeekCounts[i]);
        } else {
			currentWeekData[i] = 0;  // Show 0 instead of null
        }

        if (previousWeekCounts[i] > 0) {
            previousWeekData[i] = Math.round(previousWeekData[i] / previousWeekCounts[i]);
        } else {
			previousWeekData[i] = 0;
        }
    }

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
                    min: 0,
                    max: 100,
                    title: { display: true, text: 'Average Score (%)' }
                }
            }
        }
    });
}



// Function to initialize the Performance Overview Chart (Combined Bar and Line)
function initPerformanceOverviewChart() {
    const ctx = document.getElementById('performanceOverviewChart').getContext('2d');

    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const assessmentsPerWeek = [0, 0, 0, 0];
    const studentsAttendedPerWeek = [new Set(), new Set(), new Set(), new Set()]; // Sets for unique student IDs
    const totalStudents = backendStudents.length;  // Total students count
    const passRatePerWeek = [0, 0, 0, 0];

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    backendResults.forEach(r => {
        if (!r.completedDate) return;
        const date = new Date(r.completedDate);
		// If you want to process all dates regardless of month
		const daysDiff = Math.floor((date - startOfThisMonth) / (24 * 60 * 60 * 1000));
		const weekNumber = Math.max(0, Math.min(3, Math.floor(daysDiff / 7)));
		
		console.log("R: ", r);

        assessmentsPerWeek[weekNumber]++;
        if (r.resultStatus === 'Passed') passRatePerWeek[weekNumber]++;
		
        studentsAttendedPerWeek[weekNumber].add(r.studentId); // Collect unique studentId
    });

    // Convert attendance Sets to percentages
    const attendancePerWeek = studentsAttendedPerWeek.map(set => {
        const attendanceCount = set.size;
        return totalStudents > 0 ? Math.round((attendanceCount / totalStudents) * 100) : 0;
    });

    // Calculate pass rates
    for (let i = 0; i < 4; i++) {
        if (assessmentsPerWeek[i] > 0) {
            passRatePerWeek[i] = Math.round((passRatePerWeek[i] / assessmentsPerWeek[i]) * 100);
        } else {
            passRatePerWeek[i] = 0;
        }
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Assessments Taken',
                    data: assessmentsPerWeek,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Attendance %',
                    data: attendancePerWeek,
                    borderColor: '#2ecc71',
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    yAxisID: 'y1'
                },
                {
                    label: 'Pass Rate %',
                    data: passRatePerWeek,
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
                    title: { display: true, text: 'Assessments' }
                },
                y1: {
                    beginAtZero: true,
                    min: 0,
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
	
	// 🔥 Fetch courses for the student
	    fetch(`/Educator/student/${id}/enrolled-courses`)
	        .then(response => response.json())
	        .then(courses => {
	            lastViewedStudentCourses = courses || [];  // 🔥 Store courses for calculations
	        })
	        .catch(error => {
	            console.error('Error fetching courses:', error);
	            lastViewedStudentCourses = [];
	        });
	
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
// Assume backendResults is populated from Thymeleaf
// <script th:inline="javascript">
// const backendResults = /*[[${results}]]*/ [];
// </script>

async function populateStudentPerformanceTable(students, filters = {}) {
    try {
        const tableContainer = document.getElementById('studentPerformanceTableBody');
        tableContainer.innerHTML = '';

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
        console.log('backendResults:', backendResults);  // Inspect the data structure

        const enrichedStudents = students.map(student => {
            const studentId = Number(student.userId);
            const studentResults = backendResults.filter(r => Number(r.studentId) === studentId);

            console.log(`Student ${student.userId} has ${studentResults.length} results`);

            const assessmentsAttended = studentResults.length;
            const totalScore = studentResults.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0);
            const assessmentCount = assessmentsAttended;
            const averageScore = assessmentCount > 0 ? Math.round(totalScore / assessmentCount) : 0;
            const performanceCategory = getPerformanceCategory(averageScore);

            return {
                ...student,
                assessmentsAttended,
                averageScore,
                performanceCategory
            };
        });

        filteredPerformanceStudents = filterPerformanceStudents(enrichedStudents, filters);

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

        filteredPerformanceStudents.forEach((student, index) => {
            const row = document.createElement('tr');
            const userStatus = student.userStatus || student.status || 'Inactive';
            const isActive = (userStatus.toLowerCase && userStatus.toLowerCase() === 'active') || userStatus === 'Active';

            const statusBadge = `
                <span class="status-badge ${isActive ? 'bg-success' : 'bg-secondary'}">
                    ${userStatus}
                </span>
            `;

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

function viewStudentAssessments(studentId) {
    const student = backendStudents.find(s => Number(s.userId) === Number(studentId));

    if (!student) {
        console.error('Student not found:', studentId);
        alert('Student data not found.');
        return;
    }

    // Filter backendResults for this student
    const studentResults = backendResults.filter(r => Number(r.studentId) === Number(studentId));

    // Pass to modal display
    showAssessmentsDetailsModal(student, studentResults);
}

function showAssessmentsDetailsModal(student, results) {
    let totalAssessments = results.length;
    let completedAssessments = totalAssessments;
    let totalScore = results.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0);
    let scoreCount = results.length;
    let averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    let completionPercentage = totalAssessments > 0 ? 100 : 0;

    // 🔥 Simulate course grouping (for now use assessmentTitle as placeholder)
    const courseGroups = {};
    results.forEach(r => {
        const courseName = r.assessmentTitle || 'General Course'; // 🔥 Replace with courseName from ResultDTO if available
        if (!courseGroups[courseName]) {
            courseGroups[courseName] = [];
        }
        courseGroups[courseName].push(r);
    });

    let courseStatsList = '';
    const courseStatistics = [];

    for (const [courseName, courseResults] of Object.entries(courseGroups)) {
        const courseTotalAssessments = courseResults.length;
        const courseCompletedAssessments = courseTotalAssessments;
        const courseTotalScore = courseResults.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0);
        const courseAvgScore = courseTotalScore > 0 ? Math.round(courseTotalScore / courseTotalAssessments) : 0;
        const courseCompletionRate = 100; // All assessments in ResultDTO are completed

        courseStatistics.push({
            courseId: null, // 🔥 No courseId from ResultDTO; can be added later
            courseName,
            totalAssessments: courseTotalAssessments,
            completedAssessments: courseCompletedAssessments,
            averageScore: courseAvgScore,
            completionRate: courseCompletionRate
        });

        courseStatsList += `
            <div class="mb-3 d-flex justify-content-center">
                <div class="card" style="width: 90%; max-width: 1000px;">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${courseName}</h6>
                        <span class="badge bg-${getScoreColorClass(courseAvgScore)}">
                            Avg. Score: ${courseAvgScore}/100
                        </span>
                    </div>
                    <div class="card-body">
                        <p>Assessments: ${courseCompletedAssessments}/${courseTotalAssessments} completed</p>
                        <div class="progress mb-3" style="height: 8px;">
                            <div class="progress-bar bg-primary" role="progressbar" 
                                 style="width: ${courseCompletionRate}%;" 
                                 aria-valuenow="${courseCompletionRate}" 
                                 aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
						<button class="btn btn-sm btn-outline-primary float-end" 
						                        onclick="viewDetailedAssessments(${student.userId}, '${courseName.replace(/'/g, "\\'")}')">
						                    View Detailed Assessments
						                </button>
                    </div>
                </div>
            </div>
        `;
    }

    if (!courseStatsList) {
        courseStatsList = '<div class="alert alert-info">No assessments available for this student</div>';
    }

    // 🔥 Calculate simulated course progress (using distinct courseNames as "courses")
    const totalCourses = courseStatistics.length;
    const avgCourseProgress = totalCourses > 0 ? Math.round((courseStatistics.reduce((sum, stat) => sum + stat.completionRate, 0)) / totalCourses) : 0;

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
                                                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3" />
                                                <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4e73df" stroke-width="3" stroke-dasharray="${completionPercentage}, 100" />
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
                                                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3" />
                                                <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#36b9cc" stroke-width="3" stroke-dasharray="${averageScore}, 100" />
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
                                                <h4 class="mb-0">${avgCourseProgress}%</h4>
                                            </div>
                                            <svg width="100" height="100" viewBox="0 0 36 36">
                                                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3" />
                                                <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1cc88a" stroke-width="3" stroke-dasharray="${avgCourseProgress}, 100" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <span>${totalCourses} Course${totalCourses !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h6 class="mb-3 ms-4 fw-bold">Assessment Performance Details</h6>
                    ${courseStatsList}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}


// Function to view detailed assessments for a specific course
function viewDetailedAssessments(studentId, courseName) {
    const currentModal = bootstrap.Modal.getInstance(document.getElementById('assessmentsDetailsModal'));
    currentModal.hide();

    // 🔥 Filter by studentId and courseName
    const courseResults = backendResults.filter(r => Number(r.studentId) === Number(studentId) && r.assessmentTitle === courseName);

    if (courseResults.length > 0) {
        showAssessmentsModal(courseName, courseResults);
    } else {
        alert("No assessment details available for this student in this course.");
    }
}


function showAssessmentsModal(courseName, courseResults) {
    let modal = document.getElementById('courseAssessmentsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'courseAssessmentsModal';
        modal.className = 'modal fade';
        modal.tabIndex = '-1';
        document.body.appendChild(modal);
    }

    const totalAssessments = courseResults.length;
    const completedCount = totalAssessments; // All are completed in ResultDTO
    const totalScore = courseResults.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0);
    const averageScore = totalAssessments > 0 ? Math.round(totalScore / totalAssessments) : 0;
    const completionPercentage = totalAssessments > 0 ? 100 : 0;

    // 🔥 Group by module if module info is available (optional)
    const moduleGroups = {};  // Replace with moduleName from ResultDTO if available
    courseResults.forEach(r => {
        const moduleName = "Module 1"; // 🔥 Replace with r.moduleName if ResultDTO has it
        if (!moduleGroups[moduleName]) {
            moduleGroups[moduleName] = [];
        }
        moduleGroups[moduleName].push(r);
    });

    let assessmentDetails = '';
    for (const [moduleName, assessments] of Object.entries(moduleGroups)) {
        assessmentDetails += `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">${moduleName}</h5>
                    </div>
                    <div class="d-flex gap-4 align-items-center">
                        <div class="text-center">
                            <small>Completion</small>
                            ${createCircularProgress(100, '#1cc88a')}
                        </div>
                        <div class="text-center">
                            <small>Avg. Score</small>
                            ${createCircularProgress(
                                Math.round(assessments.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0) / assessments.length),
                                '#36b9cc'
                            )}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Assessment</th>
                                    <th>Status</th>
                                    <th>Completed Date</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${assessments.map(a => `
                                    <tr>
                                        <td>${a.assessmentTitle || 'Unnamed'}</td>
                                        <td><span class="badge bg-success">Completed</span></td>
                                        <td>${a.completedDate ? new Date(a.completedDate).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="progress me-2" style="height: 6px; width: 80px;">
                                                    <div class="progress-bar ${getScoreColorClass(a.obtainedMarks)}"
                                                         role="progressbar"
                                                         style="width: ${a.obtainedMarks}%"
                                                         aria-valuenow="${a.obtainedMarks}" aria-valuemin="0" aria-valuemax="${a.totalMarks}">
                                                    </div>
                                                </div>
                                                <span>${a.obtainedMarks}/${a.totalMarks}</span>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Assessment Details: ${courseName}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-4 justify-content-center text-center">
                        <div class="col-md-4">
                            <h6>Course Completion</h6>
                            ${createCircularProgress(completionPercentage, '#4e73df')}
                        </div>
                        <div class="col-md-4">
                            <h6>Assessment Completion</h6>
                            ${createCircularProgress(completionPercentage, '#1cc88a')}
                            <p>${completedCount} of ${totalAssessments} assessments completed</p>
                        </div>
                        <div class="col-md-4">
                            <h6>Average Score</h6>
                            ${createCircularProgress(averageScore, '#36b9cc')}
                            <p>out of 100 points</p>
                        </div>
                    </div>
                    <h5 class="mb-3">Module Assessments</h5>
                    ${assessmentDetails}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// 🔥 Helper function remains the same:
function createCircularProgress(percentage, strokeColor) {
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - percentage / 100);
    return `
        <svg width="120" height="120" viewBox="0 0 36 36" class="mx-auto d-block">
            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3"/>
            <path class="circle" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" class="percentage-text" text-anchor="middle" font-size="8" fill="#333">${percentage}%</text>
        </svg>
    `;
}


// Function to initialize performance chart

// Function to initialize performance chart and metrics dynamically
function initStudentPerformanceChart() {
    const ctx = document.getElementById('studentPerformanceChart').getContext('2d');

    if (studentPerformanceChart) {
        studentPerformanceChart.destroy();
    }

    // Filter backendResults for current student
    const studentResults = backendResults.filter(r => Number(r.studentId) === Number(currentViewingStudentId));

    // === Grouping by unique completed assessment IDs ===
    const uniqueAssessmentIds = new Set();
    studentResults.forEach(r => {
        if (r.assessmentId != null) {
            uniqueAssessmentIds.add(r.assessmentId);
        }
    });
    const totalUniqueAssessmentsCompleted = uniqueAssessmentIds.size;

    // Performance Chart - Group by week (use all attempts)
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const performanceData = [0, 0, 0, 0];
    const assessmentCounts = [0, 0, 0, 0];
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    studentResults.forEach(r => {
        if (!r.completedDate) return;
        const date = new Date(r.completedDate);
        const weekIndex = Math.min(Math.floor((date - startOfThisMonth) / (7 * 24 * 60 * 60 * 1000)), 3);
        performanceData[weekIndex] += r.resultPercentage || 0;
        assessmentCounts[weekIndex]++;
    });

    for (let i = 0; i < 4; i++) {
        if (assessmentCounts[i] > 0) {
            performanceData[i] = Math.round(performanceData[i] / assessmentCounts[i]);
        } else {
            performanceData[i] = 0;
        }
    }

    // Metric Calculations

    // 1️⃣ Overall Score (average of percentages) - using all attempts
    const totalAssessmentsCompleted = studentResults.length;
    const overallScore = totalAssessmentsCompleted > 0
        ? Math.round(studentResults.reduce((sum, r) => sum + (r.resultPercentage || 0), 0) / totalAssessmentsCompleted)
        : 0;

    // 2️⃣ Pass Rate = (passed attempts / total attempts) * 100
    const passedCount = studentResults.filter(r => r.resultStatus && r.resultStatus.toLowerCase() === 'passed').length;
    const passRate = totalAssessmentsCompleted > 0 ? Math.round((passedCount / totalAssessmentsCompleted) * 100) : 0;

    // 3️⃣ Attendance = (unique assessments completed / total assigned) * 100
    const assignedAssessments = getTotalAssignedAssessmentsForStudent(currentViewingStudentId);
    const attendance = assignedAssessments > 0
        ? Math.round((totalUniqueAssessmentsCompleted / assignedAssessments) * 100)
        : 0;

    // 4️⃣ Assignments Completed = count of unique assessments completed (not total attempts)
    const assignmentsCompleted = totalUniqueAssessmentsCompleted;

    // Render the chart
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
                fill: true,
                spanGaps: true
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
                            return `Score: ${context.raw !== null ? context.raw + '%' : 'No Data'}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 10,
                    max: 100,
                    title: { display: true, text: 'Score (%)' }
                }
            }
        }
    });

    // Update metrics in UI
    document.getElementById('overallScore').textContent = `${overallScore}%`;
    document.getElementById('completedCoursesCount').textContent = `${passRate}%`; // Pass Rate
    document.getElementById('avgAttendance').textContent = `${attendance}%`; // Attendance
    document.getElementById('assignmentsCompleted').textContent = `${assignmentsCompleted}`;
}


function getTotalAssignedAssessmentsForStudent(studentId) {
    let totalAssigned = 0;
	console.log("LastViewedCourses: ", lastViewedStudentCourses);
    lastViewedStudentCourses.forEach(course => {
        course.modules?.forEach(module => {
            module.assessments?.forEach(assessment => {
                totalAssigned++;
            });
        });
    });
    return totalAssigned;
}

