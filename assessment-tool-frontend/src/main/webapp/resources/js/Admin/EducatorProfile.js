document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('main > section');
	
	// Function to show section and hide others
	    function showSection(index) {
	        sections.forEach((section, i) => {
	            if (i === index) {
	                section.style.display = 'block';
	            } else {
	                section.style.display = 'none';
	            }
	        });
	    }
    
    sidebarItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Update active sidebar item
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            showSection(index);
            
            // Hide sidebar on mobile after selection
            if (window.innerWidth < 992) {
                document.getElementById('sidebar').classList.remove('show');
                document.getElementById('overlay').classList.remove('show');
            }
        });
    });
    
	// Initialize - show only first section and set first item as active
	   showSection(0);
	   sidebarItems[0].classList.add('active');
    
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
    
    // Go Back Button functionality
    const goBackBtn = document.getElementById('goBackBtn');
    if (goBackBtn) {
        goBackBtn.addEventListener('click', function() {
            window.location.href = 'AdminPanel.html';
        });
    }
    
    // Responsive handling
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }
    });
	
	// Get the educator ID from the URL
	    const urlParams = new URLSearchParams(window.location.search);
	    const educatorId = urlParams.get('id');
	    
	    // Edit/Save functionality
	    const editProfileBtn = document.getElementById('editProfileBtn');
	    const saveChangesBtn = document.getElementById('saveChangesBtn');
	    const editableFields = ['email', 'mobile', 'status'];
	    
	    editProfileBtn.addEventListener('click', function() {
	        // Make fields editable
	        editableFields.forEach(fieldId => {
	            const field = document.getElementById(fieldId);
	            field.readOnly = false;
	            field.classList.add('editable-field');
	        });
	        
	        // Show save button, hide edit button
	        saveChangesBtn.style.display = 'block';
	        editProfileBtn.style.display = 'none';
	    });
	    
	    saveChangesBtn.addEventListener('click', function() {
	        // Collect updated data
	        const updatedData = {
	            id: educatorId,
	            email: document.getElementById('email').value,
	            mobile: document.getElementById('mobile').value,
	            status: document.getElementById('status').value
	        };
	        
	        // Send update request
	        fetch('/Admin/updateEducatorProfile', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	                
	            },
	            body: JSON.stringify(updatedData)
	        })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error('Network response was not ok');
	            }
	            return response.json();
	        })
	        .then(data => {
	            // Make fields read-only again
	            editableFields.forEach(fieldId => {
	                const field = document.getElementById(fieldId);
	                field.readOnly = true;
	                field.classList.remove('editable-field');
	            });
	            
	            // Show edit button, hide save button
	            saveChangesBtn.style.display = 'none';
	            editProfileBtn.style.display = 'block';
	            
	            // Show success message
	            alert('Profile updated successfully!');
	        })
	        .catch(error => {
	            console.error('Error:', error);
	            alert('Error updating profile. Please try again.');
	        });
	    });
});