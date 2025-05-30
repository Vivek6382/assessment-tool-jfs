// Global variable to store the modal instance
let updateCourseModal;
let deleteCourseModal;

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

function updateCount() {
    let textarea = document.getElementById("courseDescription");
    let charCount = document.getElementById("charCount");
    let remaining = 100 - textarea.value.length;
    charCount.textContent = remaining + " characters remaining";
	//console.log(remaining);
	if (remaining <= 0) {
	        textarea.value = textarea.value.substring(0, 100); // Trim text to 100 characters
	    }
}

function updateEditCount() {
    let textarea = document.getElementById("editCourseDescription");
    let charCount = document.getElementById("charCount");
    let remaining = 100 - textarea.value.length;
    charCount.textContent = remaining + " characters remaining";
	//console.log(remaining);
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

        const totalCourses = courses.length;
        const activeCourses = courses.filter(c => c.courseStatus?.toLowerCase() === 'active').length;
        const completedCourses = courses.filter(c => new Date(c.courseEndDate) < now).length;

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
        document.getElementById('totalCourses').textContent = totalCourses;
        document.getElementById('activeCourses').textContent = activeCourses;
        document.getElementById('completedCourses').textContent = completedCourses;
        document.getElementById('enrolledStudents').textContent = enrolledStudentIds.size;

    } catch (err) {
        console.error('Error loading top stats:', err);
    }
}

// Call this on page load
document.addEventListener("DOMContentLoaded", async function () {
    await populateTopStats();
});


// Use the backend data instead of hardcoded data
let currentCourses = [...backendCourses];
let currentSort = 'default';
let currentSearchTerm = '';

// Filter courses by status
function filterByStatus(courses, status) {
    return courses.filter(course => course.courseStatus.toLowerCase() === status.toLowerCase());
}

// Updated course card generator
// Updated course card generator
async function generateCourseCard(course) {
  // Format dates (using vanilla JS or a library like moment.js)
  const endDate = new Date(course.courseEndDate).toLocaleDateString();
  
  const totalModules = course.modules.length;
  const completedModules = course.modules.filter(m => new Date(m.endDate) < new Date()).length;

  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
  // Get student count
          const studentCount = await getEnrolledStudentCount(course.courseId);


  return `
  <div class="col-md-6 mb-4">
    <div class="card dashboard-card course-card">
      <div class="card-header course-card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          ${course.courseName}
          <span class="course-badge">#${course.courseId}</span>
        </h5>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary edit-course-btn"
                  data-course-id="${course.courseId}"
                  data-bs-toggle="modal"
                  data-bs-target="#updateCourseModal">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline-danger delete-course-btn"
                  data-course-id="${course.courseId}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <div class="card-body" onclick="gotoCourse(${course.courseId})">
	  <p class="course-description mb-3 text-muted">${course.courseDescription || 'No description available'}</p>
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

        <!-- Progress bar section -->
        <div class="row">
          <div class="col-12">
            <small class="text-muted">Progress</small>
            <div class="progress course-progress mt-1">
              <div class="progress-bar bg-primary" 
                   style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}">
              </div>
            </div>
            <small class="text-muted">${progressPercent}% Complete</small>
          </div>
        </div>
      </div>

      <div class="card-footer text-muted d-flex justify-content-between">
        <small>Instructor: ${course.instructorName}</small>
        <small>Ends: ${endDate}</small>
      </div>
    </div>
  </div>
  `;
}

// Update filter function to match your backend fields
function filterCourses(searchTerm) {
    if (!searchTerm) return [...currentCourses];
    
    const term = searchTerm.toLowerCase();
    return currentCourses.filter(course => 
        course.courseName.toLowerCase().includes(term) || 
        (course.instructorName && course.instructorName.toLowerCase().includes(term)) ||
        course.courseId.toString().includes(term)
    );
}

// Function to sort courses
function sortCourses(courses, sortMethod) {
    const sorted = [...courses];
    
	switch(sortMethod) {
	       case 'title-asc':
	           return sorted.sort((a, b) => a.courseName.localeCompare(b.courseName));
	       case 'title-desc':
	           return sorted.sort((a, b) => b.courseName.localeCompare(a.courseName));
	       case 'date-asc':
	           return sorted.sort((a, b) => new Date(a.courseEndDate) - new Date(b.courseEndDate));
	       case 'date-desc':
	           return sorted.sort((a, b) => new Date(b.courseEndDate) - new Date(a.courseEndDate));
	       case 'credits-asc':
	           return sorted.sort((a, b) => a.courseCredits - b.courseCredits);
	       case 'credits-desc':
	           return sorted.sort((a, b) => b.courseCredits - a.courseCredits);
	       case 'id-asc':
	           return sorted.sort((a, b) => a.courseId - b.courseId);
	       case 'id-desc':
	           return sorted.sort((a, b) => b.courseId - a.courseId);
	       default:
	           return sorted;
	   }
}

// Function to update course display
async function updateCoursesDisplay() {
    const activeContainer = document.getElementById('activeCoursesContainer');
    const inactiveContainer = document.getElementById('inactiveCoursesContainer');
    
    // Clear containers
    activeContainer.innerHTML = '';
    inactiveContainer.innerHTML = '';
	
	
    
    // Filter by search term first
    let filteredCourses = currentSearchTerm ? filterCourses(currentSearchTerm) : [...currentCourses];
    
    // Then sort
    let sortedCourses = sortCourses(filteredCourses, currentSort);
    
    // Separate active and inactive courses
    const activeCourses = filterByStatus(sortedCourses, 'active');
    const inactiveCourses = filterByStatus(sortedCourses, 'inactive');
    
    // Display active courses
    if (activeCourses.length === 0) {
        activeContainer.innerHTML = `
            <div class="col-12 text-center py-3">
                <i class="fas fa-book fa-3x mb-3 text-muted"></i>
                <h4>No active courses</h4>
            </div>
        `;
    } else {
		for (const course of activeCourses) {
		        const cardHTML = await generateCourseCard(course); // 🔑 async call
		        activeContainer.insertAdjacentHTML("beforeend", cardHTML);
		    }
    }
    
    // Display inactive courses
    if (inactiveCourses.length === 0) {
        inactiveContainer.innerHTML = `
            <div class="col-12 text-center py-3">
                <i class="fas fa-archive fa-3x mb-3 text-muted"></i>
                <h4>No inactive courses</h4>
            </div>
        `;
    } else {
		for (const course of inactiveCourses) {
		        const cardHTML = await generateCourseCard(course); // 🔑 async call
		        inactiveContainer.insertAdjacentHTML("beforeend", cardHTML);
		    }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial load
    updateCoursesDisplay();
    
    // Search functionality
    const searchInput = document.getElementById('courseSearchInput');
    const searchButton = document.getElementById('courseSearchButton');
    
    searchInput.addEventListener('input', function() {
        currentSearchTerm = this.value;
        updateCoursesDisplay();
    });
    
    searchButton.addEventListener('click', function() {
        currentSearchTerm = searchInput.value;
        updateCoursesDisplay();
    });
    
    // Sort functionality
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            currentSort = this.getAttribute('data-sort');
            document.getElementById('sortDropdownButton').textContent = `Sort by: ${this.textContent}`;
            updateCoursesDisplay();
        });
    });
});

function gotoCourse(courseId) {
    window.location.href = `/Educator/ModulesManagement?courseId=${courseId}`;
}

// Show Toast Function
function showToast(message) {
    let toastElement = document.getElementById("successToast");
    let toastMessage = document.getElementById("toastMessage");
    toastMessage.innerText = message;

    let toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// Close Modal Function
function closeModal(modalId) {
    let modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
}

//CREATE COURSE FUNCTIONALITY
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {    

	    const createCourseForm = document.getElementById('createCourseForm');
	    const createCourseBtn = document.getElementById('createCourseBtn');
	    const createCourseModal = bootstrap.Modal.getInstance(document.getElementById('createCourseModal')) || 
	                              new bootstrap.Modal(document.getElementById('createCourseModal'));
	    const confirmCheckbox = document.getElementById('confirmCreation');
	    
	    // Set default dates
	    const now = new Date();
	    const futureDate = new Date();
	    futureDate.setMonth(now.getMonth() + 3);
	    
	    document.getElementById('courseStartDate').value = formatDateTimeLocal(now);
	    document.getElementById('courseEndDate').value = formatDateTimeLocal(futureDate);
	    
	    // Enable/disable button based on checkbox
	    confirmCheckbox.addEventListener('change', function() {
	        createCourseBtn.disabled = !this.checked;
	        this.classList.remove('is-invalid');
	    });
	    
	    // Form validation on input changes
	    createCourseForm.addEventListener('input', function() {
	        // This will provide real-time validation feedback
	        validateForm();
	    });
	    
	    // Form submission
	    createCourseForm.addEventListener('submit', function(e) {
	        e.preventDefault();
	        if (validateForm()) {
	            createCourse();
	        }
	    });
	    
	    createCourseBtn.addEventListener('click', function() {
	        if (validateForm()) {
	            createCourse();
	        }
	    });
	    
	    function formatDateTimeLocal(date) {
	        const offset = date.getTimezoneOffset() * 60000;
	        return new Date(date - offset).toISOString().slice(0, 16);
	    }
	    
		function validateForm() {
		    let isValid = true;
		    const titleInput = document.getElementById('courseTitle');
		    const creditsInput = document.getElementById('courseCredits');
		    const startDateInput = document.getElementById('courseStartDate');
		    const endDateInput = document.getElementById('courseEndDate');
		    const confirmCheckbox = document.getElementById('confirmCreation');
		    const dateErrorSpan = document.getElementById('dateError');

		    // Reset validation
		    [titleInput, creditsInput, startDateInput, endDateInput].forEach(input => {
		        input.classList.remove('is-invalid');
		    });
		    dateErrorSpan.textContent = ''; // clear previous error

		    const now = new Date();
		    const oneYearLater = new Date();
		    oneYearLater.setFullYear(now.getFullYear() + 1);

		    const startDate = new Date(startDateInput.value);
		    const endDate = new Date(endDateInput.value);

		    // Validate course title
		    if (!titleInput.value.trim()) {
		        titleInput.classList.add('is-invalid');
		        isValid = false;
		    }

		    // Validate credits
		    if (!creditsInput.value || creditsInput.value < 1 || creditsInput.value > 6) {
		        creditsInput.classList.add('is-invalid');
		        isValid = false;
		    }

		    // Validate date conditions
		    if (!startDateInput.value || !endDateInput.value) {
		        startDateInput.classList.add('is-invalid');
		        endDateInput.classList.add('is-invalid');
		        dateErrorSpan.textContent = 'Both dates are required.';
		        isValid = false;
		    } else if (startDate < now || endDate > oneYearLater || startDate >= endDate) {
		        startDateInput.classList.add('is-invalid');
		        endDateInput.classList.add('is-invalid');
		        if (startDate < now) {
		            dateErrorSpan.textContent = 'Start date must be today or later.';
		        } else if (endDate > oneYearLater) {
		            dateErrorSpan.textContent = 'End date must be within 1 year from today.';
		        } else {
		            dateErrorSpan.textContent = 'End date must be later than start date.';
		        }
		        isValid = false;
		    }

		    // Validate confirmation
		    if (!confirmCheckbox.checked) {
		        confirmCheckbox.classList.add('is-invalid');
		        isValid = false;
		    }

		    return isValid;
		}

	    
	    async function createCourse() {
	        if (!validateForm()) return;

	        const courseData = {
	            courseName: document.getElementById('courseTitle').value.trim(),
				courseDescription: document.getElementById('courseDescription').value.trim(),
	            courseCredits: parseInt(document.getElementById('courseCredits').value),
	            courseStartDate: document.getElementById('courseStartDate').value + ':00',
	            courseEndDate: document.getElementById('courseEndDate').value + ':00',
	            courseStatus: document.getElementById('courseStatus').value
	        };
			
			console.log("Course data:", courseData);

	        try {
	            const response = await fetch('/Educator/courses', {
	                method: 'POST',
	                headers: {
	                    'Content-Type': 'application/json',
	                },
	                body: JSON.stringify(courseData)
	            });

	            const result = await response.json();
	            
	            if (!response.ok) {
	                throw new Error(result.error || 'Failed to create course');
	            }

	            showToast(result.message || 'Course created successfully!');
	            createCourseModal.hide();
	            createCourseForm.reset();
	            document.getElementById('confirmCreation').checked = false;
	            createCourseBtn.disabled = true;
	            
	            setTimeout(() => window.location.reload(), 1500);
	            
	        } catch (error) {
	            showToast(error.message, 'danger');
	            console.error('Error:', error);
	        }
	    }
});

//UPDATE COURSE FUNCTIONALITY
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the modal
    updateCourseModal = new bootstrap.Modal(document.getElementById('updateCourseModal'));
    
    // Event listener for confirmation checkbox
    document.getElementById('confirmUpdate').addEventListener('change', function() {
        document.getElementById('updateCourseBtn').disabled = !this.checked;
    });
    
    // Event listener for update button
    document.getElementById('updateCourseBtn').addEventListener('click', updateCourse);
    
    // Set up edit button click handler via event delegation
    document.addEventListener('click', function(event) {
        const editBtn = event.target.closest('.edit-course-btn');
        if (editBtn) {
            const courseId = editBtn.dataset.courseId;
            loadCourseData(courseId);
        }
    });
});
// Function to load course data for editing
let id; 

async function loadCourseData(courseId) {
    try {
        const response = await fetch(`/Educator/courses/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch course data');
        }
        
        const course = await response.json();
        
        // Populate the form with course data
        document.getElementById('editCourseId').value = courseId;
        document.getElementById('editCourseTitle').value = course.courseName;
		document.getElementById('editCourseDescription').value = course.courseDescription;
        document.getElementById('editCourseCredits').value = course.courseCredits;
        
        // Format dates for datetime-local input
        // Remove the seconds part and timezone part for datetime-local input
        const startDateTime = course.courseStartDate.substring(0, 16);
        const endDateTime = course.courseEndDate.substring(0, 16);
        
        document.getElementById('editCourseStartDate').value = startDateTime;
        document.getElementById('editCourseEndDate').value = endDateTime;
        document.getElementById('editCourseStatus').value = course.courseStatus;
		
		console.log(course.instructorId);
		 id = course.instructorId;
		
		document.getElementById('editCourseInstructor').value = course.instructorName || 'You';
        
        // Reset confirmation checkbox
        document.getElementById('confirmUpdate').checked = false;
        document.getElementById('updateCourseBtn').disabled = true;
        
        // Show the modal
        updateCourseModal.show();
        
    } catch (error) {
        showToast(error.message, 'danger');
        console.error('Error:', error);
    }
}

// Function to update course
async function updateCourse() {
    if (!validateUpdateForm()) return;
    
    const courseId = document.getElementById('editCourseId').value;
	console.log("ID: ", id);
    
    const courseData = {
        courseName: document.getElementById('editCourseTitle').value.trim(),
		courseDescription: document.getElementById('editCourseDescription').value.trim(),
        courseCredits: parseInt(document.getElementById('editCourseCredits').value),
        courseStartDate: document.getElementById('editCourseStartDate').value + ':00',
        courseEndDate: document.getElementById('editCourseEndDate').value + ':00',
        courseStatus: document.getElementById('editCourseStatus').value,
		instructorId: id  // Preserve the original instructor ID

    };
    
    console.log("Updating course data:", courseData);
    
    try {
        const response = await fetch(`/Educator/courses/${courseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to update course');
        }
        
        showToast(result.message || 'Course updated successfully!');
        updateCourseModal.hide();
        document.getElementById('updateCourseForm').reset();
        document.getElementById('confirmUpdate').checked = false;
        document.getElementById('updateCourseBtn').disabled = true;
        
        // Refresh the page after a short delay
        setTimeout(() => window.location.reload(), 1500);
        
    } catch (error) {
        showToast(error.message, 'danger');
        console.error('Error:', error);
    }
}

// Validate update form
function validateUpdateForm() {
    const form = document.getElementById('updateCourseForm');
    const startDateInput = document.getElementById('editCourseStartDate');
    const endDateInput = document.getElementById('editCourseEndDate');
    const errorSpan = document.getElementById('editDateError');

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1);

    // Clear previous errors
    errorSpan.textContent = '';
    startDateInput.classList.remove('is-invalid');
    endDateInput.classList.remove('is-invalid');
    form.classList.remove('was-validated');

    // HTML5 required field validation
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }

    

    // End date must be within 1 year from now
    if (endDate > oneYearLater) {
        endDateInput.classList.add('is-invalid');
        errorSpan.textContent = 'End date must be within 1 year from today.';
        return false;
    }

    // End date must be after start date
    if (endDate <= startDate) {
        startDateInput.classList.add('is-invalid');
        endDateInput.classList.add('is-invalid');
        errorSpan.textContent = 'End date must be after start date.';
        return false;
    }

    return true;
}


//DELETE COURSE FUNCTIONALITY
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the modal
    deleteCourseModal = new bootstrap.Modal(document.getElementById('inactivateCourseModal'));
    
    // Set up delete button click handler via event delegation
    document.addEventListener('click', function(event) {
        const deleteBtn = event.target.closest('.delete-course-btn');
        if (deleteBtn) {
            const courseId = deleteBtn.dataset.courseId;
            prepareDeleteModal(courseId);
        }
    });
    
    // Set up confirm delete button handler
    document.getElementById('confirmDelete').addEventListener('click', deleteCourse);
});

// Function to prepare the delete modal with course information
async function prepareDeleteModal(courseId) {
    try {
        // Fetch course data
        const response = await fetch(`/Educator/courses/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch course data');
        }
        
        const course = await response.json();
        
        // Update modal with course details
        document.getElementById('deleteCourseTitle').textContent = `${course.courseName} #${course.courseId}`;
        
        // Format the course details
        const startDate = new Date(course.courseStartDate).toLocaleDateString();
        const endDate = new Date(course.courseEndDate).toLocaleDateString();
        
        // Display course details
        const detailsElement = document.getElementById('deleteCourseDetails');
        detailsElement.innerHTML = `
            <div>Credits: ${course.courseCredits}</div>
            <div>Instructor: ${course.instructorName}</div>
            <div>Duration: ${startDate} - ${endDate}</div>
        `;
        
        // Store course ID in modal
        document.getElementById('inactivateCourseModal').dataset.courseId = courseId;
        
        // Show the modal
        deleteCourseModal.show();
        
    } catch (error) {
        // If fetch fails, just display the course ID
        document.getElementById('deleteCourseTitle').textContent = `Course #${courseId}`;
        document.getElementById('deleteCourseDetails').innerHTML = '<div class="text-center">Unable to load course details</div>';
        
        // Store course ID in modal
        document.getElementById('inactivateCourseModal').dataset.courseId = courseId;
        
        // Show the modal
        deleteCourseModal.show();
        
        console.error('Error loading course details:', error);
    }
}

// Function to delete course
async function deleteCourse() {
    const courseId = document.getElementById('inactivateCourseModal').dataset.courseId;
    
    try {
        const response = await fetch(`/Educator/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete course');
        }
        
        // Show success message
        showToast('Course deleted successfully');
        
        // Close the modal
        deleteCourseModal.hide();
        
        // Remove the course card from the display
        const courseCard = document.querySelector(`.delete-course-btn[data-course-id="${courseId}"]`).closest('.col-md-6');
        if (courseCard) {
            // Fade out animation
            courseCard.style.transition = 'opacity 0.5s';
            courseCard.style.opacity = '0';
            
            // Remove after animation completes
            setTimeout(() => {
                courseCard.remove();
                
                // Check if there are no more courses
                const remainingCourses = document.querySelectorAll('.course-card').length;
                if (remainingCourses === 0) {
                    // Show "no courses" message
                    const courseContainer = document.querySelector('.course-container');
                    courseContainer.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
                            <h4 class="text-muted">No active courses</h4>
                            <p>Click the "Create Course" button to add your first course.</p>
                        </div>
                    `;
                }
            }, 500);
        } else {
            // If we can't find the card, just refresh the page
            setTimeout(() => window.location.reload(), 1000);
        }
        
    } catch (error) {
        showToast(error.message, 'danger');
        console.error('Error:', error);
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