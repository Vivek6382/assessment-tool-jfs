console.log(sessionStorage.getItem('user'));

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

// Function to get enrolled student count for a course
async function getEnrolledStudentCount(courseId) {
    try {
        const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/students`);
        if (!response.ok) {
            throw new Error(`Failed to fetch enrolled students: ${response.status}`);
        }
        const students = await response.json();
		console.log(students);
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

        const totalCourses = courses.length;
        const activeCourses = courses.filter(c => c.courseStatus?.toLowerCase() === 'active').length;
        const completedCourses = courses.filter(c => new Date(c.courseEndDate) < now).length;

        // Count total enrolled students (unique)
        let enrolledStudentIds = new Set();
        
        // Fetch enrolled students for each course
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
        document.getElementById('totalCourses').textContent = totalCourses;
        document.getElementById('activeCourses').textContent = activeCourses;
        document.getElementById('completedCourses').textContent = completedCourses;
        document.getElementById('enrolledStudents').textContent = enrolledStudentIds.size;

    } catch (err) {
        console.error('Error loading top stats:', err);
    }
}

// Course cards initialization
async function initializeCourseCards() {
    const coursesContainer = document.getElementById("coursesContainer");
    coursesContainer.innerHTML = ""; // Clear existing content

    for (const course of backendCourses) {
        const card = document.createElement("div");
        card.className = "col-md-6 mb-4";
        
        const endDate = new Date(course.courseEndDate).toLocaleDateString();
        
        const totalModules = course.modules.length;
        const completedModules = course.modules.filter(m => new Date(m.endDate) < new Date()).length;
        const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
        
        // Get student count
        let studentCount = 0;
        try {
            studentCount = await getEnrolledStudentCount(course.courseId);
        } catch (error) {
            console.error(`Error getting student count for course ${course.courseId}:`, error);
        }

        card.innerHTML = `
            <div class="card dashboard-card course-card h-100">
                <div class="card-header course-card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        ${course.courseName}
                        <span class="course-badge ms-2">#${course.courseId}</span>
                    </h5>
                    <span class="badge ${course.courseStatus.toLowerCase() === 'active' ? 'bg-success' : 'bg-secondary'} text-white">
                        ${course.courseStatus}
                    </span>
                </div>
                <div class="card-body pb-0" onclick="gotoCourse(${course.courseId})">
                    <p class="course-description mb-3 text-muted">
                        ${course.courseDescription ?? 'No description available'}
                    </p>
                    <div class="row mb-3">
                        <div class="col-6">
                            <small class="text-muted">Modules</small>
                            <p class="mb-0">${totalModules}</p>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Assessments</small>
                            <p class="mb-0">${course.assessmentCount}</p>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-6">
                            <small class="text-muted">Students</small>
                            <p class="mb-0">${studentCount}</p>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Credits</small>
                            <p class="mb-0">${course.courseCredits}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <small class="text-muted">Progress</small>
                            <div class="progress course-progress mt-1">
                                <div class="progress-bar bg-primary"
                                    style="width: ${progressPercent}%;"
                                    aria-valuenow="${progressPercent}">
                                </div>
                            </div>
                            <small class="text-muted">${progressPercent}% Complete</small>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between">
                    <button class="btn btn-sm btn-primary manage-students-btn" data-course-id="${course.courseId}">
                        <i class="fas fa-users me-1"></i> Manage 
                    </button>
                    <button class="btn btn-sm btn-outline-secondary view-details-btn" data-course-id="${course.courseId}" onclick="gotoCourse(${course.courseId})">
                        <i class="fas fa-info-circle me-1"></i> Details
                    </button>
                </div>
            </div>
        `;

        coursesContainer.appendChild(card);
    }
}

// Course and Student Management
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize variables
    let currentCourseId = null;
    const studentManagementModal = new bootstrap.Modal(document.getElementById('studentManagementModal'));
    
    // Call populate stats after DOM is loaded
    await populateTopStats();
    
    // Initialize course cards
    await initializeCourseCards();
    
    // Event delegation for manage students buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.manage-students-btn')) {
            const courseId = e.target.closest('.manage-students-btn').dataset.courseId;
            openStudentManagement(courseId);
        }
    });
    
    // Open student management modal
    async function openStudentManagement(courseId) {
        currentCourseId = courseId;
        const course = backendCourses.find(c => c.courseId == courseId);
        
        // Set modal title
        document.getElementById('modalCourseTitle').textContent = `${course.courseName} (#${course.courseId})`;
        
        // Load enrolled students
        await loadEnrolledStudents(courseId);
        
        // Load available students
        await loadAvailableStudents(courseId);
        
        // Show modal
        studentManagementModal.show();
    }
    
    // Load enrolled students from API
    async function loadEnrolledStudents(courseId) {
        try {
            const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/students`);
            if (!response.ok) {
                throw new Error(`Failed to fetch enrolled students: ${response.status}`);
            }
            
            const enrolledStudents = await response.json();
			console.log("Enrolled: ", enrolledStudents);
            
            const tbody = document.getElementById('enrolledStudentsList');
            tbody.innerHTML = '';
            
            enrolledStudents.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="form-check-input student-checkbox" data-student-id="${student.userId}"></td>
                    <td>${student.userFirstName} ${student.userLastName}</td>
                    <td>${student.userEmail}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger remove-student-btn" data-student-id="${student.userId}">
                            <i class="fas fa-user-minus"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners for individual remove buttons
            tbody.querySelectorAll('.remove-student-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const studentId = this.dataset.studentId;
                    unenrollStudent(courseId, studentId);
                });
            });
            
            // Add event listener for selectAll checkbox
            document.getElementById('selectAllEnrolled').checked = false;
            document.getElementById('selectAllEnrolled').addEventListener('change', function() {
                const checkboxes = tbody.querySelectorAll('.student-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
            
        } catch (error) {
            console.error('Error loading enrolled students:', error);
            showToast('Failed to load enrolled students', 'error');
        }
		
		// Refresh the page after a short delay
/*		setTimeout(() => window.location.reload(), 1500);
*/    }
    
    // Load available students from API
    async function loadAvailableStudents(courseId) {
        try {
            const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/available-students`);
            if (!response.ok) {
                throw new Error(`Failed to fetch available students: ${response.status}`);
            }
            
            const availableStudents = await response.json();
			console.log("Available: ", availableStudents);
            
            const tbody = document.getElementById('availableStudentsList');
            tbody.innerHTML = '';
            
            availableStudents.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="form-check-input student-checkbox" data-student-id="${student.userId}"></td>
                    <td>${student.userFirstName} ${student.userLastName}</td>
                    <td>${student.userEmail}</td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listener for selectAll checkbox
            document.getElementById('selectAllAvailable').checked = false;
            document.getElementById('selectAllAvailable').addEventListener('change', function() {
                const checkboxes = tbody.querySelectorAll('.student-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
            
        } catch (error) {
            console.error('Error loading available students:', error);
            showToast('Failed to load available students', 'error');
        }
    }
    
    // Enroll a single student
    async function enrollStudent(courseId, studentId) {
        try {
            const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([studentId])
            });
            
            if (!response.ok) {
                throw new Error(`Failed to enroll student: ${response.status}`);
            }
            
            showToast('Student enrolled successfully');
            
            // Refresh student lists
            await loadEnrolledStudents(courseId);
            await loadAvailableStudents(courseId);
            
            // Update course card student count
            updateCourseCardStudentCount(courseId);
            
        } catch (error) {
            console.error('Error enrolling student:', error);
            showToast('Failed to enroll student', 'error');
        }
    }
    
    // Unenroll a single student
	// Update the unenroll function to include better error handling and logging
	async function unenrollStudent(courseId, studentId) {
	    try {
	        console.log(`Attempting to unenroll student ${studentId} from course ${courseId}`);
	        
	        // Ensure studentId is properly converted to integer
	        const studentIdInt = parseInt(studentId, 10);
	        
	        const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/unenroll`, {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify([studentIdInt]) // Make sure it's an array with integer
	        });
	        
	        const responseText = await response.text();
	        console.log('Unenroll response:', response.status, responseText);
	        
	        if (!response.ok) {
	            throw new Error(`Failed to unenroll student: ${response.status} - ${responseText}`);
	        }
	        
	        showToast('Student unenrolled successfully');
	        
	        // Refresh student lists
	        await loadEnrolledStudents(courseId);
	        await loadAvailableStudents(courseId);
	        
	        // Update course card student count
	        updateCourseCardStudentCount(courseId);
	        
	    } catch (error) {
	        console.error('Error unenrolling student:', error);
	        showToast(`Failed to unenroll student: ${error.message}`, 'error');
	    }
	}
    
    // Update student count on a course card
    async function updateCourseCardStudentCount(courseId) {
        try {
            const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/students`);
            if (!response.ok) {
                throw new Error(`Failed to fetch enrolled students: ${response.status}`);
            }
            
            const students = await response.json();
            const studentCount = students.length;
            
            // Find the course card and update the student count
            const courseCard = document.querySelector(`.manage-students-btn[data-course-id="${courseId}"]`)
                .closest('.card')
                .querySelector('small.text-muted:contains("Students")');
                
            if (courseCard) {
                courseCard.nextElementSibling.textContent = studentCount;
            }
            
            // Also update the top stats
            await populateTopStats();
            
        } catch (error) {
            console.error('Error updating student count:', error);
        }
    }
    
    // Add students to course - Handle button click
    document.getElementById('addStudentsBtn').addEventListener('click', async function() {
        const checkboxes = document.querySelectorAll('#availableStudentsList .student-checkbox:checked');
        const studentIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.studentId));
        
        if (studentIds.length === 0) {
            showToast('Please select at least one student to add', 'warning');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8082/api/enrollments/course/${currentCourseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentIds)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to enroll students: ${response.status}`);
            }
            
            showToast(`${studentIds.length} student(s) enrolled successfully`);
            
            // Refresh student lists
            await loadEnrolledStudents(currentCourseId);
            await loadAvailableStudents(currentCourseId);
            
            // Update course card student count
            updateCourseCardStudentCount(currentCourseId);
            
        } catch (error) {
            console.error('Error enrolling students:', error);
            showToast('Failed to enroll students', 'error');
        }
    });
    
	// Similarly update the bulk unenroll function
	document.getElementById('removeStudentsBtn').addEventListener('click', async function() {
	    const checkboxes = document.querySelectorAll('#enrolledStudentsList .student-checkbox:checked');
	    const studentIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.studentId, 10));
	    
	    if (studentIds.length === 0) {
	        showToast('Please select at least one student to remove', 'warning');
	        return;
	    }
	    
	    try {
	        console.log(`Attempting to unenroll students: ${JSON.stringify(studentIds)} from course ${currentCourseId}`);
	        
	        const response = await fetch(`http://localhost:8082/api/enrollments/course/${currentCourseId}/unenroll`, {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            body: JSON.stringify(studentIds)
	        });
	        
	        const responseText = await response.text();
	        console.log('Bulk unenroll response:', response.status, responseText);
	        
	        if (!response.ok) {
	            throw new Error(`Failed to unenroll students: ${response.status} - ${responseText}`);
	        }
	        
	        showToast(`${studentIds.length} student(s) unenrolled successfully`);
	        
	        // Refresh student lists
	        await loadEnrolledStudents(currentCourseId);
	        await loadAvailableStudents(currentCourseId);
	        
	        // Update course card student count
	        updateCourseCardStudentCount(currentCourseId);
	        
	    } catch (error) {
	        console.error('Error unenrolling students:', error);
	        showToast(`Failed to unenroll students: ${error.message}`, 'error');
	    }
	});
    
    // Save changes button
    document.getElementById('saveChangesBtn').addEventListener('click', function() {
        studentManagementModal.hide();
        showToast('Student assignments updated successfully');
    });
    
    // Course search functionality
    document.getElementById('courseSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const courseName = card.querySelector('.card-header h5').textContent.toLowerCase();
            const courseId = card.querySelector('.badge').textContent.toLowerCase();
            const courseDescription = card.querySelector('.course-description').textContent.toLowerCase();
            
            const matches = courseName.includes(searchTerm) || 
                           courseId.includes(searchTerm) ||
                           courseDescription.includes(searchTerm);
                           
            card.closest('.col-md-6').style.display = matches ? 'block' : 'none';
        });
    });
    
    // Student search functionality
    document.getElementById('studentSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const studentRows = document.querySelectorAll('#availableStudentsList tr');
        
        studentRows.forEach(row => {
            if (!row.cells || row.cells.length < 3) return;
            
            const studentName = row.cells[1].textContent.toLowerCase();
            const studentEmail = row.cells[2].textContent.toLowerCase();
            const matches = studentName.includes(searchTerm) || studentEmail.includes(searchTerm);
            
            row.style.display = matches ? 'table-row' : 'none';
        });
    });
    
    // Show toast function with support for different types (success, error, warning)
    function showToast(message, type = 'success') {
        const toast = document.getElementById('successToast');
        
        // Set toast color based on type
        toast.className = 'toast align-items-center text-white border-0';
        
        if (type === 'success') {
            toast.classList.add('bg-success');
        } else if (type === 'error') {
            toast.classList.add('bg-danger');
        } else if (type === 'warning') {
            toast.classList.add('bg-warning');
        }
        
        document.getElementById('toastMessage').textContent = message;
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
    
    // Helper function to find elements by text content (for jQuery-like :contains functionality)
    Document.prototype.querySelector_contains = function(selector, text) {
        const elements = this.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function(element) {
            return element.textContent.trim().indexOf(text) > -1;
        });
    };
    
    // Adding jQuery-like contains selector
    Element.prototype.querySelector_contains = Document.prototype.querySelector_contains;
	
	
	await renderClassCards();

	document.getElementById("classSearch").addEventListener("input", renderClassCards);
	document.getElementById("classSort").addEventListener("change", renderClassCards);

	// Handle view details clicks
	document.addEventListener("click", function(e) {
	    if (e.target.closest(".view-class-btn")) {
	        const courseId = e.target.closest(".view-class-btn").dataset.courseId;
	        openStudentManagement(courseId); // Reuse your existing modal
	    }
	});

});

// Renders the "My Classes" section
async function renderClassCards() {
    const container = document.getElementById("classCardsContainer");
    container.innerHTML = "";

    let classData = await Promise.all(backendCourses.map(async (course) => {
        const response = await fetch(`http://localhost:8082/api/enrollments/course/${course.courseId}/students`);
        const students = await response.json();
        return {
            courseId: course.courseId,
            courseName: course.courseName,
            studentCount: students.length,
            students: students,
			educator: course.educatorName ?? `${userInfo.userFirstName} ${userInfo.userLastName}`, // fallback
			startDate: course.courseStartDate,
			endDate: course.courseEndDate
        };
    }));

    // Filter on search input
    const searchTerm = document.getElementById("classSearch").value.toLowerCase();
    if (searchTerm) {
        classData = classData.filter(c =>
            c.courseName.toLowerCase().includes(searchTerm) ||
            String(c.courseId).includes(searchTerm)
        );
    }

    // Sort classes
    const sortOption = document.getElementById("classSort").value;
    classData.sort((a, b) => {
        switch (sortOption) {
            case "name-asc": return a.courseName.localeCompare(b.courseName);
            case "name-desc": return b.courseName.localeCompare(a.courseName);
            case "students-desc": return b.studentCount - a.studentCount;
            case "students-asc": return a.studentCount - b.studentCount;
        }
    });

    // Render cards
    classData.forEach(cls => {
        const card = document.createElement("div");
        card.className = "col-md-6 mb-4";
        card.innerHTML = `
            <div class="card dashboard-card shadow-sm class-card h-100">
			<div class="card-body">
			    <div class="d-flex justify-content-between align-items-start mb-4">
			        <h5 class="card-title mb-0 fw-semibold text-truncate pe-2">${cls.courseName}</h5>
			        <span class="course-badge">#${cls.courseId}</span>
			    </div>
			    
			    <div class="course-meta mb-4">
			        <div class="d-flex align-items-center mb-2">
			            <i class="fas fa-user-tie text-muted me-2" style="width: 16px;"></i>
			            <small class="text-muted">${cls.educator}</small>
			        </div>
			        <div class="d-flex align-items-center mb-2">
			            <i class="fas fa-calendar-day text-muted me-2" style="width: 16px;"></i>
			            <small class="text-muted">${formatDateRange(cls.startDate, cls.endDate)}</small>
			        </div>
			    </div>
			    
			    <div class="d-flex justify-content-between align-items-center border-top pt-3">
			        <div class="student-count">
			            <span class="badge">
			                <i class="fas fa-users me-1"></i> ${cls.studentCount}
			            </span>
			        </div>
			        <button class="btn btn-sm btn-link text-decoration-none p-0 view-class-btn" 
			                 onclick='showClassDetails(${JSON.stringify(cls)})'>
			            View details <i class="fas fa-chevron-right ms-1"></i>
			        </button>
			    </div>
			</div>
            </div>
        `;
        container.appendChild(card);
    });
}


function gotoCourse(courseId) {
    window.location.href = `/Educator/ModulesManagement?courseId=${courseId}`;
}


async function showClassDetails(cls) {
    try {
        const res = await fetch(`http://localhost:8082/api/enrollments/course/${cls.courseId}/students`);
        const students = await res.json();

        // Populate modal fields
        document.getElementById("modalCourseName").textContent = `${cls.courseName} (#${cls.courseId})`;
        document.getElementById("modalEducator").textContent = cls.educator;
		document.getElementById("modalCourseDates").textContent = formatDateRange(cls.startDate, cls.endDate);
        document.getElementById("modalStudentCount").textContent = `${students.length} student${students.length !== 1 ? 's' : ''}`;

        const listContainer = document.getElementById("modalStudentList");
        listContainer.innerHTML = "";

        students.forEach((s, idx) => {
            const initials = (s.userFirstName[0] + s.userLastName[0]).toUpperCase();
            const avatarColor = stringToColor(s.userId);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>
                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                         style="width: 40px; height: 40px; background-color: ${avatarColor};">
                        ${initials}
                    </div>
                </td>
                <td>${s.userFirstName} ${s.userLastName}</td>
                <td>${s.userEmail}</td>
				<td>${s.userDepartment}</td>
            `;
            listContainer.appendChild(row);
        });

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('classDetailsModal'));
        modal.show();

    } catch (error) {
        console.error("Failed to load class details:", error);
        showToast("Unable to load class details", "error");
    }
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 55%)`;
    return color;
}

function formatDateRange(startStr, endStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    if (isNaN(startDate) || isNaN(endDate)) {
        return "Invalid date";
    }

    const startFormatted = startDate.toLocaleDateString('en-US', options);
    const endFormatted = endDate.toLocaleDateString('en-US', options);

    return `${startFormatted} – ${endFormatted}`;
}


function exportClassToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(document.getElementById("modalCourseName").textContent, 14, 20);
    doc.setFontSize(10);
    doc.text("Educator: " + document.getElementById("modalEducator").textContent, 14, 28);
    doc.text("Dates: " + document.getElementById("modalCourseDates").textContent, 14, 34);
    doc.text("Total Students: " + document.getElementById("modalStudentCount").textContent, 14, 40);

    doc.autoTable({
        startY: 48,
        head: [['#', 'Name', 'Email', 'Department']],
        body: Array.from(document.querySelectorAll("#modalStudentList tr")).map(tr => {
            const cells = tr.querySelectorAll("td");
            return [
                cells[0].textContent,
                cells[2].textContent,
                cells[3].textContent,
				cells[4].textContent
            ];
        }),
        styles: { fontSize: 10 }
    });

    doc.save("ClassDetails.pdf");
}
