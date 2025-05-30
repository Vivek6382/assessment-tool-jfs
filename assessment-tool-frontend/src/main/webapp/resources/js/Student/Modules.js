// Current active module ID
let currentModuleId = null;

// DOM ready handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the first module if available
    const firstModuleItem = document.querySelector('.module-item');
    if (firstModuleItem) {
        loadModule(firstModuleItem);
    }
});

/**
 * Load a module's content when clicked in the sidebar
 * @param {HTMLElement} moduleElement - The module element that was clicked
 */
function loadModule(moduleElement) {
    // Clear active state from all modules
    document.querySelectorAll('.module-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active state to clicked module
    moduleElement.classList.add('active');
    
    // Get module ID from data attribute
    currentModuleId = moduleElement.getAttribute('data-module-id');
    
    // Find the module object
    const moduleObj = findModuleById(currentModuleId);
    if (!moduleObj) {
        console.error("Module not found with ID:", currentModuleId);
        return;
    }
    
    // Set module title
    document.getElementById('moduleTitle').textContent = moduleObj.moduleName;
    
    // Update overview stats
    updateModuleStats();
    
    // Reset active tab to overview
    switchTab('overview');
    
    // Load assessments
    loadAssessments();
}

/**
 * Find a module by its ID in the modules array
 */
function findModuleById(moduleId) {
    if (!modules || !Array.isArray(modules)) {
        console.error("Modules data is not available or not an array");
        return null;
    }
    return modules.find(m => m.moduleId == moduleId);
}

/**
 * Update module statistics in the overview tab
 */
function updateModuleStats() {
    if (!currentModuleId) return;
    
    const allAssessments = assessmentsByModule[currentModuleId] || [];
    const completedAssessments = completedAssessmentsByModule[currentModuleId] || [];
    
    // Calculate progress percentage
    const total = allAssessments.length;
    const completed = completedAssessments.length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update progress bar
    const progressBar = document.getElementById('moduleProgress');
    progressBar.style.width = `${progressPercent}%`;
    
    // Update progress text
    document.getElementById('moduleProgressText').textContent = 
        `${completed} of ${total} assessments completed (${progressPercent}%)`;
    
    // Update statistics
    document.getElementById('availableCount').textContent = total - completed;
    document.getElementById('completedCount').textContent = completed;
    
    // Calculate average score if there are completed assessments
    if (completed > 0) {
        const totalScore = completedAssessments.reduce((sum, result) => {
            return sum + (result.resultPercentage || 0);
        }, 0);
        const avgScore = Math.round(totalScore / completed);
        document.getElementById('avgScore').textContent = `${avgScore}%`;
    } else {
        document.getElementById('avgScore').textContent = 'N/A';
    }
}

/**
 * Load assessments into the respective tabs
 */
/**
 * Load assessments into the respective tabs
 */
function loadAssessments() {
    if (!currentModuleId) return;
    
    // Get pending and completed assessments for the current module
    const pendingAssessments = pendingAssessmentsByModule[currentModuleId] || [];
    const completedAssessments = completedAssessmentsByModule[currentModuleId] || [];
    
    // Render pending assessments
    const pendingList = document.getElementById('pendingAssessmentsList');
    pendingList.innerHTML = '';
    
    if (!pendingAssessments || pendingAssessments.length === 0) {
        pendingList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No available assessments found for this module.
            </div>
        `;
    } else {
        pendingAssessments.forEach(assessment => {
            const card = document.createElement('div');
            card.className = 'assessment-card';
            
            try {
                // Format date to be more readable (with error handling)
                let formattedEndDate = 'No due date';
                if (assessment.endDate) {
                    const endDate = new Date(assessment.endDate);
                    formattedEndDate = endDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
                
                card.innerHTML = `
                    <div class="assessment-header">
                        <div>
                            <h3 class="assessment-title">${assessment.assessmentTitle || 'Untitled Assessment'}</h3>
                            <div class="d-flex align-items-center">
                                <span class="assessment-date">Due: ${formattedEndDate}</span>
                                <span class="badge bg-primary ms-2">${assessment.assessmentTotalMarks || 0} points</span>
                                <span class="badge bg-info ms-2">${assessment.assessmentDurationMinutes || 0} min</span>
                            </div>
                        </div>
                        <div class="assessment-actions">
                            <a href="${contextPath}/Student/assessment?assessmentId=${assessment.assessmentId}" class="btn btn-primary">
                                <i class="fas fa-play me-2"></i>Start Assessment
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>${assessment.assessmentDescription || 'No description available.'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <small class="text-muted">Type: ${assessment.assessmentType || 'Unknown'}</small>
                            </div>
                            <div>
                                <small class="text-muted">Passing Score: ${assessment.assessmentPassingScore || 0}/${assessment.assessmentTotalMarks || 0}</small>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error("Error rendering assessment card:", error);
                card.innerHTML = `
                    <div class="alert alert-danger">
                        Error displaying assessment details
                    </div>
                `;
            }
            
            pendingList.appendChild(card);
        });
    }
    
    // Render completed assessments
    const completedList = document.getElementById('completedAssessmentsList');
    completedList.innerHTML = '';
    
    if (!completedAssessments || completedAssessments.length === 0) {
        completedList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                You haven't completed any assessments in this module yet.
            </div>
        `;
    } else {
        completedAssessments.forEach(result => {
            const card = document.createElement('div');
            card.className = 'assessment-card';
            
            try {
                // Format date
                let formattedCompletedDate = 'Unknown date';
                if (result.completedDate) {
                    const completedDate = new Date(result.completedDate);
                    formattedCompletedDate = completedDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                
                // Calculate percentage
                const obtainedMarks = result.obtainedMarks || 0;
                const totalMarks = result.totalMarks || 1;
                const percentage = result.resultPercentage ? result.resultPercentage : 
                    (totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0);
                
                // Determine status color
                const resultStatus = result.resultStatus || 'Unknown';
                const statusClass = resultStatus?.toLowerCase() === 'pass' ? 'bg-success' : 'bg-danger';
                
                card.innerHTML = `
                    <div class="assessment-header">
                        <div>
                            <h3 class="assessment-title">${result.assessmentTitle || 'Untitled Assessment'}</h3>
                            <div class="d-flex align-items-center">
                                <span class="assessment-date">Completed: ${formattedCompletedDate}</span>
                                <span class="badge ${statusClass} ms-2">${resultStatus}</span>
                            </div>
                        </div>
                        <div class="assessment-actions">
                            <a href="${contextPath}/Student/result?assessmentId=${result.assessmentId}" class="btn btn-success">
                                <i class="fas fa-eye me-2"></i>View Results
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4 text-center">
                                <h4 class="mb-1">${obtainedMarks}/${totalMarks}</h4>
                                <p class="text-muted mb-0">Score</p>
                            </div>
                            <div class="col-md-4 text-center">
                                <h4 class="mb-1">${percentage}%</h4>
                                <p class="text-muted mb-0">Percentage</p>
                            </div>
                            <div class="col-md-4 text-center">
                                <h4 class="mb-1">${resultStatus}</h4>
                                <p class="text-muted mb-0">Status</p>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error("Error rendering result card:", error);
                card.innerHTML = `
                    <div class="alert alert-danger">
                        Error displaying result details
                    </div>
                `;
            }
            
            completedList.appendChild(card);
        });
    }
}
/**
 * Switch between tabs in the module content area
 * @param {string} tabName - The name of the tab to switch to
 */
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update tab buttons
    document.querySelectorAll('.module-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const selectedTabButton = Array.from(document.querySelectorAll('.module-tab')).find(
        tab => tab.textContent.toLowerCase().includes(tabName)
    );
    
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
}

// Console log data for debugging
console.log("Modules:", modules);
console.log("Assessments by Module:", assessmentsByModule);
console.log("Pending Assessments by Module:", pendingAssessmentsByModule);
console.log("Completed Assessments by Module:", completedAssessmentsByModule);