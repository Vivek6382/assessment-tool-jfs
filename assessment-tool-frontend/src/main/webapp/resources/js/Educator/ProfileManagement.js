document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('main > section');
    
    sidebarItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Update active sidebar item
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => section.style.display = 'none');
            if (sections[index]) {
                sections[index].style.display = 'block';
            }
            
            // Hide sidebar on mobile after selection
            if (window.innerWidth < 992) {
                document.getElementById('sidebar').classList.remove('show');
                document.getElementById('overlay').classList.remove('show');
            }
        });
    });
    
    // Initialize - show only first section
    sections.forEach((section, index) => {
        if (index > 0) section.style.display = 'none';
    });
    
    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }
    
    // Responsive handling
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }
    });
});

// Main sidenav toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mainSidenav = document.getElementById('mainSidenav');
    const mainSidenavToggle = document.getElementById('mainSidenavToggle');
    const sidenavBackdrop = document.getElementById('sidenavBackdrop');

    if (mainSidenavToggle) {
        mainSidenavToggle.addEventListener('click', function() {
            mainSidenav.classList.toggle('active');
            sidenavBackdrop.style.display = mainSidenav.classList.contains('active') ? 'block' : 'none';
        });
    }

    if (sidenavBackdrop) {
        sidenavBackdrop.addEventListener('click', function() {
            mainSidenav.classList.remove('active');
            sidenavBackdrop.style.display = 'none';
        });
    }

    // Close main sidenav when clicking on a nav link (for mobile)
    const navLinks = document.querySelectorAll('.main-sidenav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                mainSidenav.classList.remove('active');
                sidenavBackdrop.style.display = 'none';
            }
        });
    });
});

// Responsive handling for main sidenav
window.addEventListener('resize', function() {
    const mainSidenav = document.getElementById('mainSidenav');
    const sidenavBackdrop = document.getElementById('sidenavBackdrop');
    
    if (window.innerWidth >= 992) {
        mainSidenav.classList.remove('active');
        sidenavBackdrop.style.display = 'none';
    }
});

// JavaScript for handling profile edit functionality
document.addEventListener('DOMContentLoaded', function() {
	const profileButton = document.querySelector('.profile-form .btn-primary');
	    const inputFields = document.querySelectorAll('.profile-form input, .profile-form select');

	    const emailField = document.getElementById('email');
	    const usernameField = document.getElementById('username');
	    const statusField = document.getElementById('status');
	    const dobField = document.getElementById('dob');

	    // Set all fields to readonly by default
	    inputFields.forEach(field => {
	        field.setAttribute('readonly', true);
	        if (field.tagName === 'SELECT') field.setAttribute('disabled', true);
	    });

	    let isEditMode = false;

	    profileButton.addEventListener('click', function(e) {
	        e.preventDefault();

	        if (!isEditMode) {
	            inputFields.forEach(field => {
	                if (![emailField, usernameField, statusField, dobField].includes(field)) {
	                    field.removeAttribute('readonly');
	                    if (field.tagName === 'SELECT') field.removeAttribute('disabled');
	                }
	            });

	            profileButton.innerHTML = '<i class="bi bi-save me-2"></i>Save Changes';
	            profileButton.classList.replace('btn-primary', 'btn-success');
	            isEditMode = true;
	        } else {
	            const userData = {
	                userFirstName: document.getElementById('firstName').value,
	                userLastName: document.getElementById('lastName').value,
	                userEmail: document.getElementById('email').value,
	                userMobileNumber: document.getElementById('mobile').value,
	                userStatus: document.getElementById('status').value,
	                username: document.getElementById('username').value,
	                userDob: document.getElementById('dob').value,
	                userGender: document.getElementById('gender').value,
	                userDepartment: document.getElementById('department').value,
	                userHighestQualification: document.getElementById('qualification').value
	            };

	            fetch('/Educator/updateProfile', {
	                method: 'POST',
	                headers: { 'Content-Type': 'application/json' },
	                body: JSON.stringify(userData)
	            })
	            .then(response => response.json())
	            .then(data => {
	                if (data.success) {
	                    inputFields.forEach(field => {
	                        field.setAttribute('readonly', true);
	                        if (field.tagName === 'SELECT') field.setAttribute('disabled', true);
	                    });

	                    profileButton.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Update Profile';
	                    profileButton.classList.replace('btn-success', 'btn-primary');
	                    showSaveSuccessMessage(data.message);
	                    isEditMode = false;
	                } else {
	                    showErrorMessage(data.message);
	                }
	            })
	            .catch(error => {
	                console.error('Error:', error);
	                showErrorMessage("An error occurred while updating the profile.");
	            });
	        }
    });
    
    // Function to show a success message when changes are saved
    function showSaveSuccessMessage(message) {
        // Create a toast notification
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = 1050;
        
        const toastElement = document.createElement('div');
        toastElement.className = 'toast align-items-center text-white bg-success border-0';
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle me-2"></i>${message || 'Profile updated successfully!'}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        `;
        
        toastContainer.appendChild(toastElement);
        document.body.appendChild(toastContainer);
        
        // Initialize and show the toast
        const toast = new bootstrap.Toast(toastElement, {
            delay: 3000
        });
        toast.show();
        
        // Remove the toast container after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(toastContainer);
        });
    }
    
    // Function to show an error message
    function showErrorMessage(message) {
        // Create a toast notification for errors
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = 1050;
        
        const toastElement = document.createElement('div');
        toastElement.className = 'toast align-items-center text-white bg-danger border-0';
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-exclamation-circle me-2"></i>${message || 'Failed to update profile!'}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        `;
        
        toastContainer.appendChild(toastElement);
        document.body.appendChild(toastContainer);
        
        // Initialize and show the toast
        const toast = new bootstrap.Toast(toastElement, {
            delay: 3000
        });
        toast.show();
        
        // Remove the toast container after it's hidden
        toastElement.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(toastContainer);
        });
    }
});

  // Enhanced Courses Section with Tabs, Search, Sort, and Pagination

  document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize courses tab content
    const coursesTabPane = document.getElementById('courses');
    
    // Create the enhanced HTML structure for courses section
    coursesTabPane.innerHTML = `
      <div class="content-card">
      <h3 class="h5 fw-bold mb-4">Your Courses</h3>

        <!-- Course Status Tabs -->
        <ul class="nav nav-pills mb-4" id="coursesStatusTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="active-courses-tab" data-bs-toggle="pill" data-bs-target="#active-courses" 
              type="button" role="tab" aria-controls="active-courses" aria-selected="true">
              <i class="bi bi-play-circle me-2"></i>Active Courses
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="inactive-courses-tab" data-bs-toggle="pill" data-bs-target="#inactive-courses" 
              type="button" role="tab" aria-controls="inactive-courses" aria-selected="false">
              <i class="bi bi-pause-circle me-2"></i>Inactive Courses
            </button>
          </li>
        </ul>
        
        <!-- Courses Content -->
        <div class="tab-content" id="coursesStatusTabContent">
          <!-- Active Courses -->
          <div class="tab-pane fade show active" id="active-courses" role="tabpanel" aria-labelledby="active-courses-tab">
            <div class="courses-container">
              <!-- Search and Sort Controls -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" id="active-search" placeholder="Search courses...">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <label class="input-group-text" for="active-sort"><i class="bi bi-sort-alpha-down"></i></label>
                    <select class="form-select" id="active-sort">
                      <option value="courseId-asc">Course ID (Low-High)</option>
                      <option value="courseId-desc">Course ID (High-Low)</option>
                      <option value="courseName-asc">Title (A-Z)</option>
                      <option value="courseName-desc">Title (Z-A)</option>
                      <option value="students-desc">Students (High-Low)</option>
                      <option value="students-asc">Students (Low-High)</option>
                      <option value="courseCredits-desc">Credits (High-Low)</option>
                      <option value="courseCredits-asc">Credits (Low-High)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Active Courses Table -->
              <div class="table-responsive mt-4">
                <table class="table table-hover" id="active-courses-table">
                  <thead>
                    <tr>
                      <th>Course ID</th>
                      <th>Title</th>
                      <th>Students</th>
                      <th>Credits</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="active-courses-body">
                    <!-- Active courses will be loaded here dynamically -->
                  </tbody>
                </table>
              </div>
              
              <!-- Active Courses Pagination -->
              <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="courses-info">
                  <span id="active-showing-info">Showing 0 courses</span>
                </div>
                <nav aria-label="Courses pagination">
                  <ul class="pagination" id="active-pagination">
                    <!-- Pagination will be generated here -->
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          
          <!-- Inactive Courses -->
          <div class="tab-pane fade" id="inactive-courses" role="tabpanel" aria-labelledby="inactive-courses-tab">
            <div class="courses-container">
              <!-- Search and Sort Controls -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" id="inactive-search" placeholder="Search courses...">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group">
                    <label class="input-group-text" for="inactive-sort"><i class="bi bi-sort-alpha-down"></i></label>
                    <select class="form-select" id="inactive-sort">
                      <option value="courseId-asc">Course ID (A-Z)</option>
                      <option value="courseId-desc">Course ID (Z-A)</option>
                      <option value="courseName-asc">Title (A-Z)</option>
                      <option value="courseName-desc">Title (Z-A)</option>
                      <option value="students-desc">Students (High-Low)</option>
                      <option value="students-asc">Students (Low-High)</option>
                      <option value="courseCredits-desc">Credits (High-Low)</option>
                      <option value="courseCredits-asc">Credits (Low-High)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Inactive Courses Table -->
              <div class="table-responsive mt-4">
                <table class="table table-hover" id="inactive-courses-table">
                  <thead>
                    <tr>
                      <th>Course ID</th>
                      <th>Title</th>
                      <th>Students</th>
                      <th>Credits</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="inactive-courses-body">
                    <!-- Inactive courses will be loaded here dynamically -->
                  </tbody>
                </table>
              </div>
              
              <!-- Inactive Courses Pagination -->
              <div class="d-flex justify-content-between align-items-center mt-4">
                <div class="courses-info">
                  <span id="inactive-showing-info">Showing 0 courses</span>
                </div>
                <nav aria-label="Courses pagination">
                  <ul class="pagination" id="inactive-pagination">
                    <!-- Pagination will be generated here -->
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Process ongoingCourses data into active and inactive
    function processCourseData() {
      // Make sure ongoingCourses exists
      if (typeof ongoingCourses === 'undefined' || !Array.isArray(ongoingCourses)) {
        console.error("ongoingCourses is not defined or not an array");
        return { active: [], inactive: [] };
      }

      console.log("Processing courses data:", ongoingCourses);
      
      // Separate courses by status
      const courseData = {
        active: [],
        inactive: []
      };
      
      ongoingCourses.forEach(course => {
        // Check if courseStatus exists and convert to lowercase for case-insensitive comparison
        const status = (course.courseStatus || "").toLowerCase();
        
        // Format course data for table display
        const formattedCourse = {
          courseId: course.courseId || '',
          courseName: course.courseName || '',
          students: course.students || 0,
          courseCredits: course.courseCredits || 0,
          courseStatus: course.courseStatus || 'Unknown',
          instructorName: course.instructorName || '',
          courseEndDate: course.courseEndDate || '',
          progress: course.progress || 0
        };
        
        // Add to appropriate array based on status
        if (status === 'active') {
          courseData.active.push(formattedCourse);
        } else {
          courseData.inactive.push(formattedCourse);
        }
      });
      
      return courseData;
    }

    // Courses functionality
    function initializeCoursesSection() {
      // Process course data
      const coursesData = processCourseData();
      console.log("Processed course data:", coursesData);
      
      // Element references
      const activeSearch = document.getElementById('active-search');
      const activeSort = document.getElementById('active-sort');
      const inactiveSearch = document.getElementById('inactive-search');
      const inactiveSort = document.getElementById('inactive-sort');
      
      // Initialize both tables
      initializeTable('active', coursesData.active);
      initializeTable('inactive', coursesData.inactive);
      
      // Set up event listeners
      activeSearch.addEventListener('input', () => filterAndDisplayCourses('active', coursesData.active));
      activeSort.addEventListener('change', () => filterAndDisplayCourses('active', coursesData.active));
      inactiveSearch.addEventListener('input', () => filterAndDisplayCourses('inactive', coursesData.inactive));
      inactiveSort.addEventListener('change', () => filterAndDisplayCourses('inactive', coursesData.inactive));
      
      // Handle tab switching to reinitialize tables
      const coursesStatusTabs = document.querySelectorAll('#coursesStatusTab .nav-link');
      coursesStatusTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
          const targetId = e.target.getAttribute('aria-controls');
          const status = targetId.split('-')[0]; // 'active' or 'inactive'
          filterAndDisplayCourses(status, coursesData[status]);
        });
      });
    }
    
    // Initialize table with pagination and sorting
    function initializeTable(status, data) {
      // Set initial state
      window[`${status}CurrentPage`] = 1;
      window[`${status}ItemsPerPage`] = 5;
      window[`${status}FilteredData`] = [...data];
      
      // First display
      filterAndDisplayCourses(status, data);
    }
    
    // Filter, sort and display courses with pagination
    function filterAndDisplayCourses(status, rawData) {
      const searchInput = document.getElementById(`${status}-search`);
      const sortSelect = document.getElementById(`${status}-sort`);
      const tableBody = document.getElementById(`${status}-courses-body`);
      const paginationElement = document.getElementById(`${status}-pagination`);
      const showingInfo = document.getElementById(`${status}-showing-info`);
      
      // Filter data based on search term
      const searchTerm = searchInput.value.toLowerCase().trim();
      const filteredData = rawData.filter(course => {
        return (course.courseId && course.courseId.toString().toLowerCase().includes(searchTerm)) || 
               (course.courseName && course.courseName.toLowerCase().includes(searchTerm)) ||
               (course.instructorName && course.instructorName.toLowerCase().includes(searchTerm));
      });
      
      // Store filtered data for pagination
      window[`${status}FilteredData`] = filteredData;
      
      // Sort data
      const [sortField, sortDirection] = sortSelect.value.split('-');
      filteredData.sort((a, b) => {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // String comparison
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // Numeric comparison
          return sortDirection === 'asc'
            ? (aValue - bValue)
            : (bValue - aValue);
        }
      });
      
      // Calculate pagination values
      const currentPage = window[`${status}CurrentPage`];
      const itemsPerPage = window[`${status}ItemsPerPage`];
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      
      // Adjust currentPage if necessary
      if (currentPage > totalPages) {
        window[`${status}CurrentPage`] = totalPages || 1;
      }
      
      // Get current page data
      const startIndex = (window[`${status}CurrentPage`] - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageData = filteredData.slice(startIndex, endIndex);
      
      // Render table rows
      tableBody.innerHTML = '';
      if (currentPageData.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-5">
              <i class="bi bi-emoji-frown display-4 d-block mb-3 text-muted"></i>
              <h5>No courses found</h5>
              <p class="text-muted">Try adjusting your search criteria</p>
            </td>
          </tr>
        `;
      } else {
        currentPageData.forEach(course => {
          const statusClass = course.courseStatus.toLowerCase() === 'active' ? 'bg-success' : 'bg-secondary';
          
          tableBody.innerHTML += `
            <tr>
              <td>${course.courseId}</td>
              <td>${course.courseName}</td>
              <td>${course.students || 0}</td>
			  <td>
			    ${Array(course.courseCredits).fill('<i class="fas fa-star text-warning"></i>').join('')} (${course.courseCredits})
			  </td>
              <td><span class="badge ${statusClass}">${course.courseStatus}</span></td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="gotoCourse(${course.courseId})">Manage</button>
              </td>
            </tr>
          `;
        });
      }
      
      // Update showing info
      const totalItems = filteredData.length;
      const showingStart = totalItems === 0 ? 0 : startIndex + 1;
      const showingEnd = Math.min(endIndex, totalItems);
      showingInfo.textContent = `Showing ${showingStart}-${showingEnd} of ${totalItems} courses`;
      
      // Render pagination
      renderPagination(status, window[`${status}CurrentPage`], totalPages);
    }
    
    // Create pagination elements
    function renderPagination(status, currentPage, totalPages) {
      const paginationElement = document.getElementById(`${status}-pagination`);
      paginationElement.innerHTML = '';
      
      // Previous button
      const prevDisabled = currentPage === 1 ? 'disabled' : '';
      paginationElement.innerHTML += `
        <li class="page-item ${prevDisabled}">
          <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
      `;
      
      // Page numbers
      const pageLimit = 5; // Maximum number of page links to show
      let startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
      let endPage = Math.min(totalPages, startPage + pageLimit - 1);
      
      // Adjust start page if necessary
      if (endPage - startPage + 1 < pageLimit && startPage > 1) {
        startPage = Math.max(1, endPage - pageLimit + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationElement.innerHTML += `
          <li class="page-item ${activeClass}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      }
      
      // Next button
      const nextDisabled = currentPage === totalPages || totalPages === 0 ? 'disabled' : '';
      paginationElement.innerHTML += `
        <li class="page-item ${nextDisabled}">
          <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      `;
      
      // Add event listeners to pagination links
      const pageLinks = paginationElement.querySelectorAll('.page-link');
      pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const pageNum = parseInt(link.getAttribute('data-page'));
          if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
            window[`${status}CurrentPage`] = pageNum;
            const status_data = status === 'active' ? 
              processCourseData().active : 
              processCourseData().inactive;
            filterAndDisplayCourses(status, status_data);
          }
        });
      });
    }
    
    // Navigation function
    window.gotoCourse = function(courseId) {
      window.location.href = `/Educator/ModulesManagement?courseId=${courseId}`;
    };
    
    // Initialize the courses section
    initializeCoursesSection();
  });

// Account Settings Tab Functionality

document.addEventListener('DOMContentLoaded', function() {
    // References to elements
    const saveChangesBtn = document.querySelector('.account-settings-card .btn-primary');
    const deleteAccountBtn = document.querySelector('.account-settings-card .btn-outline-danger');
    const updatePasswordBtn = document.querySelector('.account-settings-card .btn-accent');
    
    // Set initial state for the form
    const initialSettings = {
      accountEmail: document.getElementById('accountEmail').value,
      timezone: document.getElementById('timezone').value,
      language: document.getElementById('language').value
    };
    
    // Create and append the delete account modal to the body
    const modalHTML = `
      <div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="deleteAccountModalLabel">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>Delete Account
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <i class="bi bi-person-x display-1 text-danger"></i>
              </div>
              <p>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</p>
              <div class="alert alert-warning">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> Deleting your account will also remove all your courses, materials, and student data.
              </div>
              <div class="form-check mt-3">
                <input class="form-check-input" type="checkbox" id="confirmDelete">
                <label class="form-check-label" for="confirmDelete">
                  I understand that this action is permanent
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmDeleteBtn" disabled>
                <i class="bi bi-trash me-2"></i>Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal fade" id="deleteRequestModal" tabindex="-1" aria-labelledby="deleteRequestModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-secondary text-white">
              <h5 class="modal-title" id="deleteRequestModalLabel">
                <i class="bi bi-check-circle-fill me-2"></i>Delete Request Sent
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <i class="bi bi-envelope-check display-1 text-secondary mb-3"></i>
              <h4>Your request has been sent</h4>
              <p class="text-muted">A confirmation email has been sent to your registered email address. Please follow the instructions to complete the account deletion process.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Delete account button click handler
    deleteAccountBtn.addEventListener('click', function() {
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
      deleteModal.show();
    });
    
    // Checkbox for delete confirmation
    const confirmDeleteCheckbox = document.getElementById('confirmDelete');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    confirmDeleteCheckbox.addEventListener('change', function() {
      confirmDeleteBtn.disabled = !this.checked;
    });
    
    // Delete account confirmation handler
    confirmDeleteBtn.addEventListener('click', function() {
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
      deleteModal.hide();
      
      setTimeout(() => {
        const requestModal = new bootstrap.Modal(document.getElementById('deleteRequestModal'));
        requestModal.show();
      }, 500);
    });
    
    // Update password button click handler
	document.getElementById('updatePasswordBtn').addEventListener('click', async function() {
	    const currentPassword = document.getElementById('currentPassword').value;
	    const newPassword = document.getElementById('newPassword').value;
	    const confirmPassword = document.getElementById('confirmPassword').value;
	    
	    // Validation
	    if (!currentPassword || !newPassword || !confirmPassword) {
	        showToast('error', 'Please fill all password fields');
	        return;
	    }
	    
	    if (newPassword !== confirmPassword) {
	        showToast('error', 'New passwords do not match');
	        return;
	    }
	    
	    if (newPassword.length < 8) {
	        showToast('error', 'Password must be at least 8 characters');
	        return;
	    }
	    
	    try {
	        const response = await fetch('/Educator/change-password', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded',
	            },
	            body: new URLSearchParams({
	                currentPassword: currentPassword,
	                newPassword: newPassword
	            })
	        });
	        
	        const result = await response.text();
	        
	        if (!response.ok) {
	            throw new Error(result || 'Password update failed');
	        }
	        
	        showToast('success', result);
	        
	        // Clear fields
	        document.getElementById('currentPassword').value = '';
	        document.getElementById('newPassword').value = '';
	        document.getElementById('confirmPassword').value = '';
	        
	    } catch (error) {
	        showToast('error', error.message);
	    }
	});
    
    // Save changes button click handler
    saveChangesBtn.addEventListener('click', function() {
      // Get current form values
      const currentSettings = {
        accountEmail: document.getElementById('accountEmail').value,
        timezone: document.getElementById('timezone').value,
        language: document.getElementById('language').value
      };
      
      // Check if any changes were made
      const hasChanges = JSON.stringify(initialSettings) !== JSON.stringify(currentSettings);
      
      if (!hasChanges) {
        showToast('info', 'No changes to save');
        return;
      }
      
      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(currentSettings.accountEmail)) {
        showToast('error', 'Please enter a valid email address');
        return;
      }
      
      // Simulate API request with slight delay
      saveChangesBtn.disabled = true;
      saveChangesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';
      
      setTimeout(() => {
        // Update the initial settings to the new values
        Object.assign(initialSettings, currentSettings);
        
        // Re-enable the button and update text
        saveChangesBtn.disabled = false;
        saveChangesBtn.innerHTML = 'Save Changes';
        
        // Show success message
        showToast('success', 'Account settings updated successfully');
      }, 1000);
    });
    
    // Function to create and show toast messages
    function showToast(type, message) {
      // Remove any existing toasts
      const existingToasts = document.querySelectorAll('.toast-container');
      existingToasts.forEach(toast => toast.remove());
      
      // Set toast properties based on type
      let iconClass, bgClass;
      switch (type) {
        case 'success':
          iconClass = 'bi-check-circle-fill';
          bgClass = 'bg-success';
          break;
        case 'error':
          iconClass = 'bi-exclamation-circle-fill';
          bgClass = 'bg-danger';
          break;
        case 'info':
          iconClass = 'bi-info-circle-fill';
          bgClass = 'bg-info';
          break;
        case 'warning':
          iconClass = 'bi-exclamation-triangle-fill';
          bgClass = 'bg-warning';
          break;
        default:
          iconClass = 'bi-bell-fill';
          bgClass = 'bg-primary';
      }
      
      // Create toast container
      const toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.style.zIndex = '1050';
      
      // Create toast HTML
      toastContainer.innerHTML = `
        <div class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              <i class="bi ${iconClass} me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      `;
      
      // Add to DOM
      document.body.appendChild(toastContainer);
      
      // Initialize and show the toast
      const toastElement = toastContainer.querySelector('.toast');
      const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
      });
      toast.show();
      
      // Remove from DOM after hiding
      toastElement.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toastContainer);
      });
    }
    
    // Initialize password field toggles (show/hide password)
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
      // Create the field container for proper positioning
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'position-relative';
      
      // Insert the container before the field
      field.parentNode.insertBefore(fieldContainer, field);
      
      // Move the field inside the container
      fieldContainer.appendChild(field);
      
      // Create the toggle button
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'btn btn-sm position-absolute end-0 top-50 translate-middle-y text-muted bg-transparent border-0';
      toggleButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
      toggleButton.style.right = '10px';
      toggleButton.style.zIndex = '5';
      
      // Add click event to toggle password visibility
      toggleButton.addEventListener('click', function() {
        if (field.type === 'password') {
          field.type = 'text';
          this.innerHTML = '<i class="bi bi-eye"></i>';
        } else {
          field.type = 'password';
          this.innerHTML = '<i class="bi bi-eye-slash"></i>';
        }
      });
      
      // Add the toggle button to the container
      fieldContainer.appendChild(toggleButton);
    });
  });

  // Current state for ongoing courses - filter to only include active courses initially
  // Current state for ongoing courses - filter to only include active courses initially
  let currentOngoingCourses = [];
  let currentOngoingSort = 'title-asc'; // Default sort
  let currentOngoingSearchTerm = '';

  // Generate course card HTML for ongoing courses
  function generateOngoingCourseCard(course) {
      // Skip non-active courses
      if (course.courseStatus && course.courseStatus.toLowerCase() !== 'active') {
          return ''; // Return empty string for non-active courses
      }
      
      // Format date for display
      const endDate = new Date(course.courseEndDate).toLocaleDateString();
      
      // Calculate course progress
      const totalModules = course.modules ? course.modules.length : 0;
      const completedModules = course.modules ? 
          course.modules.filter(m => new Date(m.endDate) < new Date()).length : 0;
      const progressPercent = totalModules > 0 ? 
          Math.round((completedModules / totalModules) * 100) : 0;
      
      return `
      <div class="col-md-6 mb-4">
          <div class="card dashboard-card course-card">
              <div class="card-header course-card-header d-flex justify-content-between align-items-center bg-white mt-0">
                  <h5 class="card-title mb-0">
                      ${course.courseName}
                      <span class="course-badge">#${course.courseId}</span>
                  </h5>
                  <div class="btn-group btn-group-sm">
                      <a href="/Educator/ModulesManagement?courseId=${course.courseId}" 
                         class="btn btn-primary">
                          <i class="fas fa-chalkboard-teacher"></i> Manage
                      </a>
                  </div>
              </div>

              <div class="card-body">
                  <p class="course-description mb-3 text-muted">${course.courseDescription || 'No description available'}</p>
                  <div class="row mb-3">
                      <div class="col-4">
                          <small class="text-muted">Modules</small>
                          <p class="mb-0 course-stat-value">${totalModules}</p>
                      </div>
                      <div class="col-4">
                          <small class="text-muted">Assessments</small>
                          <p class="mb-0 course-stat-value">${course.assessmentCount || 0}</p>
                      </div>
                      <div class="col-4">
                          <small class="text-muted">Credits</small>
                          <p class="mb-0 course-stat-value">${course.courseCredits}</p>
                      </div>
                  </div>
                  
                  <div class="row">
                      <div class="col-12">
                          <small class="text-muted">Progress</small>
                          <div class="progress course-progress mt-1">
                              <div class="progress-bar" 
                                   style="width: ${progressPercent}%;" aria-valuenow="${progressPercent}">
                              </div>
                          </div>
                          <small class="text-muted">${progressPercent}% Complete</small>
                      </div>
                  </div>
              </div>

              <div class="card-footer text-muted d-flex justify-content-between">
                  <small>Instructor: ${course.instructorName || 'Not assigned'}</small>
                  <small>Ends: ${endDate}</small>
              </div>
          </div>
      </div>
      `;
  }

  // Filter ongoing courses - first filter for active status, then apply search term
  function filterOngoingCourses(courses, searchTerm) {
      // First filter for active courses only
      let filteredCourses = courses.filter(course => 
          course.courseStatus && course.courseStatus.toLowerCase() === 'active'
      );
      
      // Then apply search term if provided
      if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredCourses = filteredCourses.filter(course => 
              course.courseName.toLowerCase().includes(term) || 
              (course.instructorName && course.instructorName.toLowerCase().includes(term)) ||
              course.courseId.toString().includes(term)
          );
      }
      
      return filteredCourses;
  }

  // Sort ongoing courses based on sort method
  function sortOngoingCourses(courses, sortMethod) {
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

  // Update ongoing courses display
  function updateOngoingCoursesDisplay() {
      const container = document.getElementById('ongoingCoursesContainer');
      container.innerHTML = '';
      
      // First filter for active courses, then apply search term
      let filteredCourses = filterOngoingCourses(currentOngoingCourses, currentOngoingSearchTerm);
      let sortedCourses = sortOngoingCourses(filteredCourses, currentOngoingSort);
      
      if (sortedCourses.length === 0) {
          container.innerHTML = `
              <div class="col-12 text-center py-5">
                  <i class="fas fa-book fa-3x mb-3 text-muted"></i>
                  <h4>No active courses found</h4>
                  <p class="text-muted">${currentOngoingSearchTerm ? 'Try adjusting your search' : 'You currently have no active courses'}</p>
              </div>
          `;
      } else {
          sortedCourses.forEach(course => {
              container.innerHTML += generateOngoingCourseCard(course);
          });
      }
  }

  // Handle form submission - server-side search and sort
  function handleServerSideSubmit(e) {
      e.preventDefault();
      const searchTerm = document.getElementById('searchInput').value;
      const sortMethod = document.getElementById('sortDropdown').getAttribute('data-sort') || 'title';
      const direction = document.getElementById('sortDropdown').getAttribute('data-direction') || 'asc';
      
      window.location.href = `/Educator/ProfileManagement?search=${encodeURIComponent(searchTerm)}&sort=${sortMethod}&direction=${direction}`;
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
      // Get initial data
      currentOngoingCourses = ongoingCourses;
      
      // Initialize current search term from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      currentOngoingSearchTerm = urlParams.get('search') || '';
      
      // Extract sort parameters from URL
      const sortParam = urlParams.get('sort') || 'title';
      const directionParam = urlParams.get('direction') || 'asc';
      currentOngoingSort = `${sortParam}-${directionParam}`;
      
      // Set the search input value from URL parameter
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
          searchInput.value = currentOngoingSearchTerm;
      }
      
      // Initialize sortDropdown text content based on URL parameters
      updateSortDropdownText();
      
      // Set up event listeners
      const searchForm = document.getElementById('searchForm');
      if (searchForm) {
          searchForm.addEventListener('submit', handleServerSideSubmit);
      }
      
      // Optional: Add input event for real-time filtering without form submission
      if (searchInput) {
          searchInput.addEventListener('input', function() {
              currentOngoingSearchTerm = this.value;
              updateOngoingCoursesDisplay();
          });
      }
      
      // For "Reset" button
      const resetButton = document.getElementById('resetButton');
      if (resetButton) {
          resetButton.addEventListener('click', function() {
              window.location.href = '/Educator/ProfileManagement';
          });
      }
      
      // Set up sort dropdown event listeners
      document.querySelectorAll('.sort-option').forEach(option => {
          option.addEventListener('click', handleSortOptionClick);
      });
      
      // Initial display update
      updateOngoingCoursesDisplay();
  });

  // Update sort dropdown text based on current parameters
  function updateSortDropdownText() {
      const sortDropdown = document.getElementById('sortDropdown');
      if (!sortDropdown) return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const sort = urlParams.get('sort') || 'title';
      const direction = urlParams.get('direction') || 'asc';
      
      sortDropdown.setAttribute('data-sort', sort);
      sortDropdown.setAttribute('data-direction', direction);
      
      // Update text content
      let sortText = '';
      switch (sort) {
          case 'title':
              sortText = 'Title';
              break;
          case 'date':
              sortText = 'Date';
              break;
          case 'credits':
              sortText = 'Credits';
              break;
          case 'id':
              sortText = 'ID';
              break;
          default:
              sortText = 'Default';
      }
      
      let directionText = direction === 'asc' ? 'A-Z' : 'Z-A';
      if (sort === 'date') {
          directionText = direction === 'asc' ? 'Oldest first' : 'Newest first';
      } else if (sort === 'credits' || sort === 'id') {
          directionText = direction === 'asc' ? 'Low to High' : 'High to Low';
      }
      
      sortDropdown.innerHTML = `Sort by: ${sortText} (${directionText})`;
  }

  // Handle sort dropdown item click
  function handleSortOptionClick(e) {
      e.preventDefault();
      const option = e.target;
      const sortValue = option.getAttribute('data-sort');
      const directionValue = option.getAttribute('data-direction');
      
      const searchInput = document.getElementById('searchInput');
      const searchTerm = searchInput ? searchInput.value : '';
      
      window.location.href = `/Educator/ProfileManagement?search=${encodeURIComponent(searchTerm)}&sort=${sortValue}&direction=${directionValue}`;
  }

  // Add event listeners to sort dropdown items after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
      const sortOptions = document.querySelectorAll('.sort-option');
      sortOptions.forEach(option => {
          option.addEventListener('click', handleSortOptionClick);
      });
  });


// Event listeners
function gotoCourse(courseId) {
    window.location.href = `/Educator/ModulesManagement?courseId=${courseId}`;
}


// Function to populate enrolled courses
async function populateEnrolledCourses(studentId) {
    const tbody = document.getElementById('enrolledCoursesBody');
    
    // Show loading state
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                Loading enrolled courses...
            </td>
        </tr>
    `;
    
    try {
        // Validate student ID
        if (!studentId) {
            throw new Error("Student ID is required");
        }
        
        const response = await fetch(`/Educator/student/${studentId}/enrolled-courses`);
        
        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }
        
        const courses = await response.json();
        console.log("Received from server:", courses);

        tbody.innerHTML = '';

        if (!Array.isArray(courses)) {
            throw new Error("Expected array, but got: " + JSON.stringify(courses));
        }

        if (courses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        <i class="bi bi-info-circle me-2"></i>No enrolled courses found
                    </td>
                </tr>
            `;
            // Reset metrics when no courses
            document.getElementById('completedCoursesCount').textContent = "0";
            return;
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.courseId || '-'}</td>
                <td>${course.courseName || 'Unnamed Course'}</td>
                <td>${course.enrollmentDate ? new Date(course.enrollmentDate).toLocaleDateString() : '-'}</td>
                <td>${course.courseEndDate ? new Date(course.courseEndDate).toLocaleDateString() : '-'}</td>
                <td><span class="status-badge ${getStatusClass(course.status)}">${course.status || 'Unknown'}</span></td>
                <td>
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar" role="progressbar" style="width: ${course.progress || 0}%"
                            aria-valuenow="${course.progress || 0}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <small>${course.progress || 0}%</small>
                </td>
            `;
            fragment.appendChild(row);
        });
        
        tbody.appendChild(fragment);

        // Update performance metrics
        const completedCount = courses.filter(c => c.status === 'Completed').length;
        document.getElementById('completedCoursesCount').textContent = completedCount;

    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        
        // Show more specific error message
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="alert alert-danger mb-0">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Error loading enrolled courses: ${error.message || 'Unknown error'}
                        <button class="btn btn-sm btn-outline-danger ms-3" onclick="populateEnrolledCourses('${studentId}')">
                            Try Again
                        </button>
                    </div>
                </td>
            </tr>
        `;
        
        // Reset metrics on error
        document.getElementById('completedCoursesCount').textContent = "-";
    }
}

// Helper function to determine status badge class
function getStatusClass(status) {
    if (!status) return 'bg-secondary';
    
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-success';
        case 'completed':
            return 'bg-primary';
        case 'pending':
            return 'bg-warning';
        case 'cancelled':
        case 'failed':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    if (typeof Chart !== 'undefined') {
        
        // Educator Engagement (Line Chart)
        new Chart(document.getElementById('educatorEngagementChart'), {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: [{
                    label: 'Engagement Score',
                    data: [60, 75, 80, 70, 90], // static sample data
                    fill: false,
                    borderColor: '#36a2eb',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

		// Overall Performance (Speedometer Style using gauge-like chart)
		       const overallPerformanceChart = new Chart(document.getElementById('overallPerformanceChart'), {
		           type: 'doughnut',
		           data: {
		               labels: ['Performance', 'Remaining'], // 'Remaining' fills the rest of the doughnut
		               datasets: [{
		                   data: [75, 25], // 75% performance, 25% gap
		                   backgroundColor: ['#4bc0c0', '#eeeeee'], // 75% green, 25% grey
		                   borderWidth: 0
		               }]
		           },
		           options: {
		               rotation: -90, // Starts the doughnut from top
		               circumference: 180, // Only half the doughnut for the gauge look
		               cutout: '70%', // Inner cut-out to make it look like a speedometer
		               plugins: {
		                   tooltip: { enabled: false }, // Disable tooltip
		                   legend: { display: false }, // Hide legend
		               },
		               responsive: true,
		               animation: {
		                   animateRotate: true, // Rotating animation for better visualization
		                   animateScale: true // Scale up for better visual when data changes
		               }
		           }
		       });

		       // Update percentage dynamically
		       const percentage = 75; // Example: 75% performance (this would be dynamic based on data)
		       document.getElementById('performancePercentage').textContent = `${percentage}%`;
        
        // Modules Per Course - Bar Chart
        if (typeof modulesPerCourse !== 'undefined' && modulesPerCourse.length > 0) {
            new Chart(document.getElementById('modulesPerCourseChart'), {
                type: 'bar',
                data: {
                    labels: modulesPerCourse.map(c => c.name),
                    datasets: [{
                        label: 'Modules',
                        data: modulesPerCourse.map(c => c.modules),
                        backgroundColor: '#36a2eb'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            console.warn('modulesPerCourse is undefined or empty.');
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".updated-at");

    items.forEach(function (el) {
        const updatedTimeStr = el.textContent.trim();
        if (!updatedTimeStr) return;

        const updatedTime = new Date(updatedTimeStr);
        const now = new Date();
        const diffMs = now - updatedTime;

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) {
            el.textContent = "Just now";
        } else if (diffMinutes < 60) {
            el.textContent = `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
        } else if (diffHours < 24) {
            el.textContent = `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
        } else {
            el.textContent = `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
        }
    });
});