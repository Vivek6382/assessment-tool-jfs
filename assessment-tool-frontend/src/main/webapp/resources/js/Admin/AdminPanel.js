console.log("AdminPanel.js loaded successfully"); // Should appear in browser console
document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle functionality
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("mainContent")
  const closeSidebar = document.getElementById("closeSidebar")

  // Hide sidebar toggle on large screens
  if (window.innerWidth >= 768) {
    sidebarToggle.style.display = 'none';
  }

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show")
  })

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("show")
  })
  
  	// Initialize modal
      const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
      
      // Handle edit button clicks for both active and inactive students
      document.querySelectorAll('.edit-student-btn').forEach(button => {
          button.addEventListener('click', function(e) {
              e.preventDefault();
              
              // Get student data from data attributes
              const userId = this.dataset.userId;
              const firstName = this.dataset.firstName;
              const lastName = this.dataset.lastName;
              const mobileNumber = this.dataset.mobile;
              const status = this.dataset.status;
              const dob = this.dataset.dob;
              const gender = this.dataset.gender;
              const department = this.dataset.department;
              
              // Populate the modal fields
              document.getElementById('editUserId').value = userId;
              document.getElementById('firstName').value = firstName;
              document.getElementById('lastName').value = lastName;
              document.getElementById('mobileNumber').value = mobileNumber;
              document.getElementById('status').value = status;
              document.getElementById('dateOfBirth').value = dob;
              document.getElementById('gender').value = gender;
              document.getElementById('department').value = department;
              
              // Show the modal
              editStudentModal.show();
          });
      });
      
      // Handle save changes button
      document.getElementById('saveStudentChanges').addEventListener('click', function() {
		const formData = {
		        userId: document.getElementById('editUserId').value,
		        mobile: document.getElementById('mobileNumber').value,
		        status: document.getElementById('status').value,
		        department: document.getElementById('department').value
		    };

		    // Make AJAX call
		    fetch('/Admin/updateStudentProfile', {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json'
		        },
		        body: JSON.stringify(formData)
		    })
		    .then(response => response.json())
		    .then(data => {
		        if (data.success) {
		            // Show success message
		            alert('Student updated successfully');
		            // Close the modal
		            editStudentModal.hide();
		            // Reload the page to see changes
		            window.location.reload();
		        } else {
		            alert('Error: ' + data.error);
		        }
		    })
		    .catch(error => {
		        console.error('Error:', error);
		        alert('Error updating student');
		    });
      });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target)
    const isClickOnToggle = sidebarToggle.contains(event.target)

    if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768) {
      sidebar.classList.remove("show")
    }
  })

  // Check if screen width is 412px to apply specific optimizations
  function checkForMobileView() {
    if (window.innerWidth <= 412) {
      document.body.classList.add("mobile-view-412")
    } else {
      document.body.classList.remove("mobile-view-412")
    }
  }

  // Call on load and resize
  checkForMobileView()
  window.addEventListener("resize", checkForMobileView)

  // Adjust for window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      sidebar.classList.remove("show")
      sidebarToggle.style.display = 'none';
    } else {
      sidebarToggle.style.display = 'flex';
    }
  })
  
  const paginationState = {}; // Keeps current page per table

  function paginateTable(tableId, pageSize = 5) {
      const table = document.getElementById(tableId);
      const rows = Array.from(table.querySelectorAll("tbody tr")).filter(row => row.style.display !== "none");
      const totalPages = Math.ceil(rows.length / pageSize);

      if (!paginationState[tableId]) paginationState[tableId] = 1;
      let currentPage = paginationState[tableId];
	  
	  console.log(`Table ${tableId}: ${rows.length} visible rows, ${totalPages} total pages, current page ${currentPage}`);

      function showPage(page) {
          // Limit page to valid range
          page = Math.max(1, Math.min(page, totalPages));
          
          paginationState[tableId] = page;
          currentPage = page;

          rows.forEach((row, index) => {
              row.style.display = index >= (page - 1) * pageSize && index < page * pageSize ? "" : "none";
          });

          updatePaginationControls();
      }

      function updatePaginationControls() {
          const container = table.closest('.card-body').querySelector(".pagination-container");
          if (!container) return;

          // Handle case where there are no results
          if (rows.length === 0) {
              container.innerHTML = `
                  <div class="pagination-prev"><i class="fas fa-chevron-left"></i></div>
                  <div class="pagination-page">1</div>
                  <div>0 of 0</div>
                  <div class="pagination-next"><i class="fas fa-chevron-right"></i></div>
              `;
              return;
          }

          // Create or update pagination controls
          if (container.children.length === 0 || !container.querySelector('.pagination-prev')) {
              // Create the structure if it doesn't exist
              container.innerHTML = `
                  <div class="pagination-prev"><i class="fas fa-chevron-left"></i></div>
                  <div class="pagination-page">${currentPage}</div>
                  <div>${currentPage} of ${rows.length}</div>
                  <div class="pagination-next"><i class="fas fa-chevron-right"></i></div>
              `;
          } else {
              // Update existing elements
              const pageIndicator = container.querySelector('.pagination-page');
              const rangeIndicator = container.querySelector('div:nth-child(3)');
              
              if (pageIndicator) pageIndicator.textContent = currentPage;
              if (rangeIndicator) {
                  /*const endItem = Math.min(rows.length, currentPage * pageSize);*/
                  rangeIndicator.textContent = ` of ${totalPages}`;
              }
          }

          // Add event listeners
          const prevBtn = container.querySelector('.pagination-prev');
          const nextBtn = container.querySelector('.pagination-next');
          
          if (prevBtn) {
              prevBtn.onclick = () => {
                  if (currentPage > 1) showPage(currentPage - 1);
              };
              prevBtn.style.opacity = currentPage <= 1 ? "0.5" : "1";
              prevBtn.style.cursor = currentPage <= 1 ? "not-allowed" : "pointer";
          }
          
          if (nextBtn) {
              nextBtn.onclick = () => {
                  if (currentPage < totalPages) showPage(currentPage + 1);
              };
              nextBtn.style.opacity = currentPage >= totalPages ? "0.5" : "1";
              nextBtn.style.cursor = currentPage >= totalPages ? "not-allowed" : "pointer";
          }
      }

      showPage(currentPage); // Initial call
  }
  
  function sortTable(tableId, keyIndex) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
	
	const searchInputMap = {
	        "activeEducatorsTable": "activeEducatorsSearch",
	        "inactiveEducatorsTable": "inactiveEducatorsSearch",
	        "activeStudentsTable": "activeStudentsSearch",
	        "inactiveStudentsTable": "inactiveStudentsSearch"
	    };
		const searchInputId = searchInputMap[tableId];
		const searchInput = document.getElementById(searchInputId);
	searchInput.value = "";
	rows.forEach(row => row.style.display = "");

    rows.sort((a, b) => {
      const textA = a.children[keyIndex].textContent.trim().toLowerCase();
      const textB = b.children[keyIndex].textContent.trim().toLowerCase();
      return textA.localeCompare(textB);
    });

	// Remove all rows and reinsert in sorted order
	    rows.forEach(row => tbody.removeChild(row));
	    rows.forEach(row => tbody.appendChild(row));

	    // Reset pagination to page 1
	    if (paginationState[tableId]) {
	        paginationState[tableId] = 1;
	    }
	
    paginateTable(tableId); // Refresh pagination
  }
  
  document.querySelectorAll(".sort-option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const tableId = option.dataset.table;
      const sortBy = option.dataset.sortBy;
      const keyIndex = sortBy === "firstName" ? 1 : 2;
      sortTable(tableId, keyIndex);
    });
  });



  // SEARCH FUNCTIONALITY
  
  // Search for active educators
  const activeEducatorsSearch = document.getElementById("activeEducatorsSearch")
  if (activeEducatorsSearch) {
    activeEducatorsSearch.addEventListener("input", function () {
      filterTable("activeEducatorsTable", this.value.toLowerCase())
    })
  }

  // Search for inactive educators
  const inactiveEducatorsSearch = document.getElementById("inactiveEducatorsSearch")
  if (inactiveEducatorsSearch) {
    inactiveEducatorsSearch.addEventListener("input", function () {
      filterTable("inactiveEducatorsTable", this.value.toLowerCase())
    })
  }
  
  // Search for active students
  const activeStudentsSearch = document.getElementById("activeStudentsSearch")
  if (activeStudentsSearch) {
    activeStudentsSearch.addEventListener("input", function () {
      filterTable("activeStudentsTable", this.value.toLowerCase())
    })
  }
  
  // Search for inactive students
  const inactiveStudentsSearch = document.getElementById("inactiveStudentsSearch")
  if (inactiveStudentsSearch) {
    inactiveStudentsSearch.addEventListener("input", function () {
      filterTable("inactiveStudentsTable", this.value.toLowerCase())
    })
  }
  
  // Generic filter function for tables
  function filterTable(tableId, searchTerm) {
      const table = document.getElementById(tableId);
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? "" : "none";
      });

      paginateTable(tableId); // Refresh pagination
    }
  
  // CHECKBOX SELECTION
  
  // Select all active educators
  const selectAllActiveEducators = document.getElementById("selectAllActiveEducators")
  if (selectAllActiveEducators) {
    selectAllActiveEducators.addEventListener("change", function () {
      toggleCheckboxes(".active-educator-checkbox", this.checked)
    })
  }
  
  // Select all inactive educators
  const selectAllInactiveEducators = document.getElementById("selectAllInactiveEducators")
  if (selectAllInactiveEducators) {
    selectAllInactiveEducators.addEventListener("change", function () {
      toggleCheckboxes(".inactive-educator-checkbox", this.checked)
    })
  }
  
  // Select all active students
  const selectAllActiveStudents = document.getElementById("selectAllActiveStudents")
  if (selectAllActiveStudents) {
    selectAllActiveStudents.addEventListener("change", function () {
      toggleCheckboxes(".active-student-checkbox", this.checked)
    })
  }
  
  // Select all inactive students
  const selectAllInactiveStudents = document.getElementById("selectAllInactiveStudents")
  if (selectAllInactiveStudents) {
    selectAllInactiveStudents.addEventListener("change", function () {
      toggleCheckboxes(".inactive-student-checkbox", this.checked)
    })
  }
  
  // Generic function to toggle checkboxes
  function toggleCheckboxes(selector, checked) {
    const checkboxes = document.querySelectorAll(selector)
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked
    })
  }

  // ACTIVATE/DEACTIVATE FUNCTIONALITY
  
  // Activate educators
  const activateEducatorBtn = document.getElementById("activateEducatorBtn")
  if (activateEducatorBtn) {
    activateEducatorBtn.addEventListener("click", function () {
      const selectedIds = getSelectedIds(".inactive-educator-checkbox")
      
      if (selectedIds.length > 0) {
        document.getElementById("activateEducatorIds").value = selectedIds.join(",")
        document.getElementById("activateEducatorForm").submit()
      } else {
        alert("Please select at least one educator to activate")
      }
    })
  }

  // Deactivate educators
  const deactivateEducatorBtn = document.getElementById("deactivateEducatorBtn")
  if (deactivateEducatorBtn) {
    deactivateEducatorBtn.addEventListener("click", function () {
      const selectedIds = getSelectedIds(".active-educator-checkbox")
      
      if (selectedIds.length > 0) {
        document.getElementById("deactivateEducatorIds").value = selectedIds.join(",")
        document.getElementById("deactivateEducatorForm").submit()
      } else {
        alert("Please select at least one educator to deactivate")
      }
    })
  }
  
  // Activate students
  const activateStudentBtn = document.getElementById("activateStudentBtn")
  if (activateStudentBtn) {
    activateStudentBtn.addEventListener("click", function () {
      const selectedIds = getSelectedIds(".inactive-student-checkbox")
      
      if (selectedIds.length > 0) {
        document.getElementById("activateStudentIds").value = selectedIds.join(",")
        document.getElementById("activateStudentForm").submit()
      } else {
        alert("Please select at least one student to activate")
      }
    })
  }

  // Deactivate students
  const deactivateStudentBtn = document.getElementById("deactivateStudentBtn")
  if (deactivateStudentBtn) {
    deactivateStudentBtn.addEventListener("click", function () {
      const selectedIds = getSelectedIds(".active-student-checkbox")
	  console.log("Selected IDs:", selectedIds);

      
      if (selectedIds.length > 0) {
        document.getElementById("deactivateStudentIds").value = selectedIds.join(",")
        document.getElementById("deactivateStudentForm").submit()
      } else {
        alert("Please select at least one student to deactivate")
      }
    })
  }
  
  // Generic function to get selected IDs
  function getSelectedIds(selector) {
    const selectedIds = []
    document.querySelectorAll(selector + ":checked").forEach(checkbox => {
      selectedIds.push(checkbox.dataset.userId || checkbox.getAttribute("data-user-id"))
    })
    return selectedIds
  }

  // Sort button functionality
  /*const sortButtons = document.querySelectorAll(".sort-button")
  sortButtons.forEach(button => {
    button.addEventListener("click", () => {
      alert("Sort functionality will be implemented here")
    })
  })*/

  // Download report functionality
  const downloadButtons = document.querySelectorAll(".download-button-light")
  downloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Downloading report...")
    })
  })

  // Add user button functionality
  const addUserBtn = document.getElementById("addUserBtn")
  if (addUserBtn) {
    addUserBtn.addEventListener("click", function () {
      window.location.href = "/Admin/AddUsers"
    })
  }
  
  // Sign out button functionality
  const signOutBtn = document.getElementById("signOutBtn")
  if (signOutBtn) {
    signOutBtn.addEventListener("click", function() {
      // You can add logout functionality here
      alert("Signing out...")
      // window.location.href = "/logout"
    })
  }
  
  paginateTable("activeEducatorsTable");
  paginateTable("inactiveEducatorsTable");
  paginateTable("activeStudentsTable");
  paginateTable("inactiveStudentsTable");

})