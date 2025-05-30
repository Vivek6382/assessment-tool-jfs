document.addEventListener("DOMContentLoaded", () => {
    // Mobile sidebar toggle functionality
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const closeSidebar = document.getElementById("closeSidebar");

    // Hide sidebar toggle on large screens
    if (window.innerWidth >= 768) {
        sidebarToggle.style.display = 'none';
        if (document.getElementById("closeSidebar")) {
            document.getElementById("closeSidebar").style.display = 'none';
        }
    }

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });

    if (closeSidebar) {
        closeSidebar.addEventListener("click", () => {
            sidebar.classList.remove("show");
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (event) => {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768) {
            sidebar.classList.remove("show");
        }
    });

    // Adjust for window resize
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove("show");
            sidebarToggle.style.display = 'none';
            if (document.getElementById("closeSidebar")) {
                document.getElementById("closeSidebar").style.display = 'none';
            }
        } else {
            sidebarToggle.style.display = 'flex';
            if (document.getElementById("closeSidebar")) {
                document.getElementById("closeSidebar").style.display = 'block';
            }
        }
    });

    // Profile Edit Modal Functionality
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileModal = document.getElementById("editProfileModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const cancelEdit = document.getElementById("cancelEdit");
    const profileForm = document.getElementById("profileForm");

    // Open modal
    editProfileBtn.addEventListener("click", () => {
        editProfileModal.classList.add("active");
    });

    // Close modal
    function closeEditProfileModal() {
        editProfileModal.classList.remove("active");
    }

    closeEditModal.addEventListener("click", closeEditProfileModal);
    cancelEdit.addEventListener("click", closeEditProfileModal);

    // Close modal when clicking outside
    editProfileModal.addEventListener("click", (e) => {
        if (e.target === editProfileModal) {
            closeEditProfileModal();
        }
    });

    // Form submission
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Get form values
        const userId = document.getElementById("userId").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
		/*if (!userId || !email || !password || !confirmPassword) {
		        console.error("One or more input elements not found.");
		        return;
		    }*/
		
        
        // Simple validation
        if (password && password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        // Prepare data for API
        const updateData = {
            userId: parseInt(userId),
            userEmail: email,
            newPassword: password || null
        };
        
        // Call API to update profile
        fetch('/Admin/updateAdminProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the UI with new values
                document.querySelector(".detail-value[data-field='email']").textContent = email;
                
                // Show success message
                alert("Profile updated successfully!");
                
                // Close modal
                closeEditProfileModal();
                
                // Reload page to reflect changes
                window.location.reload();
            } else {
                // Show error message
                alert("Error updating profile: " + (data.error || "Unknown error"));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error updating profile. Please try again.");
        });
        
        // Clear password fields
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
    });
  });