document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('main > section');
    
    sidebarItems.forEach((item) => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active sidebar item
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => section.style.display = 'none');
            document.getElementById(sectionId).style.display = 'block';
            
            // Hide sidebar on mobile after selection
            if (window.innerWidth < 992) {
                document.getElementById('sidebar').classList.remove('show');
                if (document.getElementById('overlay')) {
                    document.getElementById('overlay').classList.remove('show');
                }
            }
        });
    });
    
    // Profile link in dropdown
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            sections.forEach(section => section.style.display = 'none');
            document.getElementById('profile').style.display = 'block';
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            const profileSidebarItem = document.querySelector('.sidebar-item[data-section="profile"]');
            if (profileSidebarItem) {
                profileSidebarItem.classList.add('active');
            }
            
            // Close main sidenav on mobile
            if (window.innerWidth < 992) {
                const mainSidenav = document.getElementById('mainSidenav');
                const backdrop = document.getElementById('sidenavBackdrop');
                if (mainSidenav) mainSidenav.classList.remove('active');
                if (backdrop) backdrop.style.display = 'none';
            }
        });
    }

    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            // Create or toggle overlay
            let overlay = document.getElementById('overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'overlay';
                overlay.className = 'overlay';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('show');
                    this.classList.remove('show');
                });
            }
            
            overlay.classList.toggle('show');
        });
    }

    // Main sidenav toggle
    const mainSidenavToggle = document.getElementById('mainSidenavToggle');
    const mainSidenav = document.getElementById('mainSidenav');
    const sidenavBackdrop = document.getElementById('sidenavBackdrop');
    
    if (mainSidenavToggle && mainSidenav) {
        mainSidenavToggle.addEventListener('click', function() {
            mainSidenav.classList.toggle('active');
            if (sidenavBackdrop) {
                sidenavBackdrop.style.display = mainSidenav.classList.contains('active') ? 'block' : 'none';
            }
        });
        
        if (sidenavBackdrop) {
            sidenavBackdrop.addEventListener('click', function() {
                mainSidenav.classList.remove('active');
                this.style.display = 'none';
            });
        }
    }

    // Profile edit toggle
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (editProfileBtn && saveProfileBtn) {
        const inputFields = document.querySelectorAll('.profile-form input:not([type="email"]), .profile-form select');
        
        editProfileBtn.addEventListener('click', function() {
            // Switch to edit mode
            inputFields.forEach(field => {
                field.removeAttribute('readonly');
                if (field.tagName === 'SELECT') {
                    field.removeAttribute('disabled');
                }
            });
            
            editProfileBtn.style.display = 'none';
            saveProfileBtn.style.display = 'block';
        });
    }

    // Handle password change form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showToast('error', 'Passwords do not match');
                return;
            }
            
            const formData = new FormData(passwordForm);
            
            fetch(passwordForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    showToast('success', 'Password updated successfully');
                    passwordForm.reset();
                    
                    const strengthBar = document.querySelector('.strength-bar');
                    const strengthText = document.querySelector('.strength-text');
                    const passwordMatch = document.getElementById('passwordMatch');
                    
                    if (strengthBar) strengthBar.style.width = '0%';
                    if (strengthText) strengthText.textContent = 'Password strength';
                    if (passwordMatch) passwordMatch.innerHTML = '';
                } else {
                    showToast('error', 'Password change failed. Please check your current password.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('error', 'Error updating password');
            });
        });
    }

    // Password strength meter
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const passwordMatch = document.getElementById('passwordMatch');
    
    if (newPasswordInput && strengthBar && strengthText) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthBar.style.width = `${strength}%`;
            
            if (strength < 25) {
                strengthBar.style.backgroundColor = '#f87171';
                strengthText.textContent = 'Weak password';
            } else if (strength < 50) {
                strengthBar.style.backgroundColor = '#fcd34d';
                strengthText.textContent = 'Fair password';
            } else if (strength < 75) {
                strengthBar.style.backgroundColor = '#4ade80';
                strengthText.textContent = 'Good password';
            } else {
                strengthBar.style.backgroundColor = '#10b981';
                strengthText.textContent = 'Strong password';
            }
            
            // Check if passwords match
            if (confirmPasswordInput && confirmPasswordInput.value) {
                checkPasswordsMatch();
            }
        });
    }
    
    if (confirmPasswordInput && passwordMatch) {
        confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
        
        function checkPasswordsMatch() {
            const newPass = newPasswordInput.value;
            const confirmPass = confirmPasswordInput.value;
            
            if (newPass === confirmPass) {
                passwordMatch.innerHTML = '<small class="text-success"><i class="bi bi-check-circle me-1"></i>Passwords match</small>';
            } else {
                passwordMatch.innerHTML = '<small class="text-danger"><i class="bi bi-x-circle me-1"></i>Passwords do not match</small>';
            }
        }
    }
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.remove('bi-eye-slash');
                    this.classList.add('bi-eye');
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('bi-eye');
                    this.classList.add('bi-eye-slash');
                }
            }
        });
    });

    // Save notification preferences
    const saveNotificationPrefs = document.getElementById('saveNotificationPrefs');
    if (saveNotificationPrefs) {
        saveNotificationPrefs.addEventListener('click', function() {
            showToast('success', 'Notification preferences saved successfully');
        });
    }

    // Calculate and display average score
    calculateAverageScore();
    
    // Initialize charts if academic progress section exists
    if (document.getElementById('academicProgress')) {
        initializeCharts();
    }
});

// Function to calculate password strength
function calculatePasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 15;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 15;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 15;
    
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    
    // Length bonus
    if (password.length >= 12) strength += 15;
    
    return Math.min(strength, 100);
}

// Calculate average score from results
function calculateAverageScore() {
    const resultsTable = document.querySelector('table.table-hover');
    if (!resultsTable) return;
    
    const scoreElements = resultsTable.querySelectorAll('tbody tr td:nth-child(2)');
    if (scoreElements.length === 0) return;
    
    const scores = Array.from(scoreElements).map(element => {
        const percentMatch = element.textContent.match(/\((\d+\.?\d*)%\)/);
        return percentMatch ? parseFloat(percentMatch[1]) : 0;
    });
    
    if (scores.length > 0) {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const averageScoreElement = document.getElementById('averageScore');
        if (averageScoreElement) {
            averageScoreElement.textContent = `${average.toFixed(1)}%`;
        }
    }
}

// Initialize charts for academic progress
function initializeCharts() {
    // Performance chart (line chart)
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Assessment Scores',
                    data: [75, 82, 78, 85, 90, 88],
                    borderColor: '#091057',
                    backgroundColor: 'rgba(9, 16, 87, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Assessment Performance Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Score (%)'
                        }
                    }
                }
            }
        });
    }
    
    // Completion rate chart (doughnut)
    const completionCtx = document.getElementById('completionChart');
    if (completionCtx) {
        new Chart(completionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [65, 35],
                    backgroundColor: ['#091057', '#e9ecef'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        
        const completionPercentage = document.getElementById('completionPercentage');
        if (completionPercentage) {
            completionPercentage.textContent = '65%';
        }
    }
}

// Toast notification system
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1050';
    container.appendChild(toast);
    document.body.appendChild(container);
    
    // Initialize Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, { 
        autohide: true, 
        delay: 3000 
    });
    bsToast.show();
    
    // Remove from DOM after hiding
    toast.addEventListener('hidden.bs.toast', function() {
        container.remove();
    });
}