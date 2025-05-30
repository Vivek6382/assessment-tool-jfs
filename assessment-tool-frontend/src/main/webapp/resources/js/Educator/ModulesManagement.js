let modulesData = [];

// Then in initializeModulesData():
function initializeModulesData() {
    // Clear existing data
    modulesData = [];
    
    // If modulesFromBackend is available (from Thymeleaf), use it
    if (typeof modulesFromBackend !== 'undefined' && modulesFromBackend.length > 0) {
        modulesData = modulesFromBackend.map(m => ({
            id: `module-${m.moduleId}`,
            moduleId: m.moduleId,
            name: m.moduleName,
            status: m.moduleStatus || 'active',
            description: m.moduleDescription || '',
            assessments: m.assessments, // Placeholder
            sequenceOrder: m.moduleSequenceOrder,
            startDate: m.startDate,
            endDate: m.endDate,
            courseId: m.courseId
        }));
    }
    
    // Store courseId from Thymeleaf if available
    if (typeof courseId !== 'undefined') {
        window.courseId = courseId;
    }
}

function populateModuleStats(courseId) {
    try {
        const modules = modulesFromBackend;

        const now = new Date();

        const totalModules = modules.length;
        const activeModules = modules.filter(m => m.moduleStatus?.toLowerCase() === 'active').length;
        const completedModules = modules.filter(m => new Date(m.endDate) < now).length;

        // Update DOM
        document.getElementById('totalModules').textContent = totalModules;
        document.getElementById('activeModules').textContent = activeModules;
        document.getElementById('completedModules').textContent = completedModules;

    } catch (error) {
        console.error('Error fetching module stats:', error);
    }
}

// Example: Call on page load with courseId from URL
const urlParams = new URLSearchParams(window.location.search);
const courseID = urlParams.get('courseId');
if (courseID) {
    populateModuleStats(courseID);
}


// Toggle main navigation sidenav
function toggleMainSidenav(show) {
    const sidenav = document.querySelector('.main-sidenav');
    const mainContent = document.querySelector('.main-content-container');
    const backdrop = document.getElementById('sidenavBackdrop');
    
    if (show === undefined) {
        show = !sidenav.classList.contains('active');
    }
    
    if (show) {
        sidenav.classList.add('active');
        mainContent.classList.add('shifted');
        backdrop.style.display = 'block';
    } else {
        sidenav.classList.remove('active');
        mainContent.classList.remove('shifted');
        backdrop.style.display = 'none';
    }
}

function toggleModuleSidebar() {
    const moduleSidebar = document.getElementById('moduleSidebar');
    const backdrop = document.getElementById('moduleSidebarBackdrop');
    
    moduleSidebar.classList.toggle('active');
    backdrop.classList.toggle('active');
    
    if (moduleSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close sidebar when clicking backdrop
document.getElementById('moduleSidebarBackdrop').addEventListener('click', function() {
    toggleModuleSidebar();
});

// Initialize both sidebars based on screen size
function initSidebars() {
    const windowWidth = window.innerWidth;
    const moduleSidebar = document.getElementById('moduleSidebar');
    const backdrop = document.getElementById('moduleSidebarBackdrop');
    
    if (windowWidth > 992) {
        moduleSidebar.classList.remove('active');
        backdrop.classList.remove('active');
    }
}

// Window resize handler
window.addEventListener('resize', initSidebars);

// Create and populate module sidebar
function renderModuleSidebar() {
    const moduleList = document.querySelector('.module-list');
    moduleList.innerHTML = '';
    modulesData.forEach(module => {
        const moduleItem = document.createElement('div');
		
		const statusLower = module.status.toLowerCase();

        moduleItem.className = 'module-item';
        moduleItem.setAttribute('onclick', `showModuleContent('${module.id}')`);
		//console.log(module.status);
        moduleItem.innerHTML = `
            <div class="flex items-center gap-2">
				<span class="status-dot ${statusLower}"></span>
                <span class="module-item-name">${module.name}</span>
            </div>
            <div class="module-actions">
                <button class="btn btn-sm btn-light text-primary edit-module-btn" title="Edit module" data-module-id="${module.moduleId}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-light text-danger delete-module-btn" title="Delete module" data-module-id="${module.moduleId}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        moduleList.appendChild(moduleItem);
    });
}

// Render assessment content for a module with tab support
function renderModuleContent(moduleId, activeTab = 'performance') {
	if (!modulesData) {
	    console.error('modulesData is not initialized');
	    return;
	}

	const module = modulesData.find(m => m.id === moduleId);
	if (!module) return;

	// Get or create content section
	let contentSection = document.getElementById(`${moduleId}-content`);
	const moduleContentContainer = document.querySelector('.module-content-container');

	if (!contentSection) {
	    contentSection = document.createElement('div');
	    contentSection.id = `${moduleId}-content`;
	    contentSection.className = 'module-content-section';
	    contentSection.style.display = 'none';
	    moduleContentContainer.appendChild(contentSection);
	}
    
    const targetContentSection = document.getElementById(`${moduleId}-content`);
    
    let assessmentsHTML = '';
	
	console.log(module.assessments);
    
    // If module has assessments, render them
    if (module.assessments && module.assessments.length > 0) {
        module.assessments.forEach(assessment => {
            // Common card header
            let cardHTML = `
                <div class="assessment-card">
                    <div class="assessment-header">
                        <div>
                            <h3 class="assessment-title">${assessment.assessmentTitle}</h3>
                            <div class="flex items-center gap-2">
                                <span class="assessment-date">Duration: ${assessment.assessmentDurationMinutes} Minutes</span>
                                ${assessment.assessmentStatus ? `
                                <span class="assessment-status">
                                    <i class="fas ${assessment.assessmentStatus.includes('inactive') ? 'fa-pen' : 'fa-check'} mr-2"></i>
                                    ${assessment.assessmentStatus}
                                </span>` : ''}
                            </div>
                        </div>
						<div class="assessment-actions">
						    <button class="assessment-action-btn btn btn-primary view-details-btn" 
						            title="View Details"
						            data-assessment-id="${assessment.assessmentId}">
						        <i class="fas fa-eye"></i>
						    </button>
						    <button class="assessment-action-btn btn btn-success" title="Edit Assessment">
						        <i class="fas fa-edit"></i>
						    </button>
						    ${activeTab === 'performance' ? `
						    <a href="/test-progress-results" class="assessment-action-btn btn btn-purple" title="Test Progress & Results">
						        <i class="fas fa-chart-bar"></i>
						    </a>` : ''}
						</div>                         
                    </div>
            `;

            // Add different content based on active tab
            if (activeTab === 'performance') {
                const metricsHTML = Object.entries(assessment.metrics || {})
                    .map(([title, value]) => `
                        <div class="metric-card">
                            <div class="metric-card-title">${title.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                            <div class="metric-card-value ${getMetricValueClass(value)}">${value}</div>
                        </div>
                    `).join('');
                
                cardHTML += `
                    <div class="assessment-metrics">
                        ${metricsHTML}
                    </div>
                `;
            } else {
                cardHTML += `
                    <div class="assessment-overview-content p-3 border rounded bg-white shadow-sm">
                   <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-3 fw-bold text-primary">Assessment Details</h5>
                    <span class="badge">${assessment.assessmentType}</span>
                </div>
                
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <div class="border-start border-3 border-primary ps-3">
                            <p class="mb-2"><i class="fas fa-clock text-muted me-2"></i><strong>Duration:</strong> ${assessment.assessmentDurationMinutes} Minutes</p>
                            <p class="mb-2"><i class="fas fa-star text-muted me-2"></i><strong>Passing Score:</strong> ${assessment.assessmentPassingScore}</p>
							<p class="mb-0"><i class="fas fa-star text-muted me-2"></i><strong>Total Score:</strong> ${assessment.assessmentTotalMarks}</p>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <h6><i class="fas fa-list-ul text-muted me-2"></i>Questions</h6>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item py-1 px-0 border-0">• 5 Multiple Choice Questions</li>
                            <li class="list-group-item py-1 px-0 border-0">• 3 Short Answers</li>
                            <li class="list-group-item py-1 px-0 border-0">• 1 Explanatory Section</li>
                        </ul>
                    </div>
                </div>
            </div>
                `;
            }

            cardHTML += `</div>`; // Close assessment-card
            assessmentsHTML += cardHTML;
        });
    } else {
        // No assessments message
        assessmentsHTML = `
            <div class="empty-state p-4 text-center">
                <div class="empty-state-icon mb-3">
                    <i class="fas fa-clipboard-list fa-3x text-muted"></i>
                </div>
                <h5>No Assessments Available</h5>
                <p class="text-muted">No assessments have been created for this module yet.</p>
            </div>
        `;
    }
    
    targetContentSection.innerHTML = `
        <div class="module-header mb-4 mt-4 bg-white">
            <h3>${module.name}</h3>
            <div class="module-meta text-muted small">
                <span>Status: ${module.status.charAt(0).toUpperCase() + module.status.slice(1)}</span>
                ${module.startDate ? `<span class="ms-3">Start: ${new Date(module.startDate).toLocaleDateString()}</span>` : ''}
                ${module.endDate ? `<span class="ms-3">End: ${new Date(module.endDate).toLocaleDateString()}</span>` : ''}
            </div>
        </div>
        <div class="module-tabs">
            <div class="module-tab ${activeTab === 'design' ? 'active' : ''}" onclick="switchModuleTab('${moduleId}', 'design')">
                <span class="module-tab-badge">A</span>
                <span>Assessment Overview</span>
            </div>
            <div class="module-tab ${activeTab === 'performance' ? 'active' : ''}" onclick="switchModuleTab('${moduleId}', 'performance')">
                <span class="module-tab-badge">P</span>
                <span>Performance</span>
            </div>
			<div class="ml-auto">
			    <button class="btn btn-primary" onclick="gotoAssessment()">
			        <i class="fas fa-plus mr-2"></i> Add Assessment
			    </button>
			</div>
        </div>
        <div class="assessment-list">
            ${assessmentsHTML}
        </div>
    `;
}

function gotoAssessment(){
	window.location.href=`/EducatorConfig/TestDashboard?moduleId=${currentModuleId}`;
}

// Add this to your page's JavaScript or a separate JS file
document.addEventListener('DOMContentLoaded', function() {
    // Handle view details button clicks
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const assessmentId = this.getAttribute('data-assessment-id');
            if (assessmentId) {
                window.location.href = `/EducatorConfig/TestConfiguration/BasicSettings?assessmentId=${assessmentId}`;
            }
        });
    });
});

function getMetricValueClass(value) {
    if (typeof value === 'string') {
        if (value.includes('%')) {
            return 'text-success';
        }
        if(value.includes('/')){
            return 'text-blue-500';
        }
        if (value.includes('Warning') || value.includes('Need') || value.includes('Gaps')) {
            return 'text-warning';
        }
    }
    return 'text-blue-500';
}

// Function to switch between tabs
function switchModuleTab(moduleId, tab) {
    renderModuleContent(moduleId, tab);
}

// Track current module ID for context
let currentModuleId = null;

// Show the selected module content and update active state
function showModuleContent(moduleId) {
    // Add null check
    if (!modulesData) {
        console.error('modulesData is not initialized');
        return;
    }
    
    document.querySelectorAll('.module-content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelectorAll('.module-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const clickedItem = event.currentTarget;
    clickedItem.classList.add('active');
    
    const module = modulesData.find(m => m.id === moduleId);
    if (module) {
        currentModuleId = module.moduleId;
    }
    
	// ✅ HIDE EMPTY STATE
	const emptyState = document.getElementById('defaultEmptyState');
	if (emptyState) {
	    emptyState.remove(); // 💥 Removes it entirely from the DOM
	}

		
    renderModuleContent(moduleId);
    
    const contentSection = document.getElementById(`${moduleId}-content`);
    if (contentSection) {
        contentSection.style.display = 'block';
    }
}


// Initialize Bootstrap modals
let addModuleModal, editModuleModal, deleteModuleModal, successToast, errorToast;

// Function to show success toast
function showSuccessToast(message) {
    document.getElementById('toastMessage').textContent = message;
    successToast.show();
}

// Function to show error toast
function showErrorToast(message) {
    document.getElementById('errorToastMessage').textContent = message;
    errorToast.show();
}

// Add Module functionality - POST request to API
document.getElementById('confirmAddModule').addEventListener('click', async function () {
    const moduleName = document.getElementById('moduleName').value.trim();
    const status = document.getElementById('moduleStatus').value || 'active';
    const startDate = document.getElementById('moduleStartDate').value;
    const endDate = document.getElementById('moduleEndDate').value;

    if (!moduleName) {
        alert('Module name is required');
        return;
    }
	
	// Hide previous errors
	document.getElementById('startDateError').style.display = 'none';
	document.getElementById('endDateError').style.display = 'none';

	const moduleStart = new Date(startDate);
	const moduleEnd = new Date(endDate);
	const courseStart = new Date(courseStartDate);
	const courseEnd = new Date(courseEndDate);

	let hasError = false;

	if (moduleStart < courseStart || moduleStart > courseEnd) {
		console.log(moduleStart + " " + courseStart);
	    document.getElementById('startDateError').style.display = 'block';
	    hasError = true;
	}

	if (moduleEnd <= moduleStart || moduleEnd > courseEnd) {
	    document.getElementById('endDateError').style.display = 'block';
	    hasError = true;
	}

	if (hasError) return;

    const confirmBtn = this;
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

    try {
        const moduleData = {
            course: { courseId: courseId },
            moduleName: moduleName,
            moduleStatus: status,
			startDate: startDate ? `${startDate}T00:00:00` : null, // Convert to LocalDateTime format
			endDate: endDate ? `${endDate}T23:59:59` : null,  
            moduleSequenceOrder: modulesData.length + 1
        };

        const response = await fetch('http://localhost:8082/api/modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(moduleData)
        });

        if (!response.ok) throw new Error(await response.text());


        renderModuleSidebar();
        showSuccessToast(`Module "${moduleName}" added successfully!`);

        document.getElementById('addModuleForm').reset();
        addModuleModal.hide();
    } catch (error) {
        console.error('Add Error:', error);
        showErrorToast(`Error: ${error.message}`);
    } finally {
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
	
	// Refresh the page after a short delay
	        setTimeout(() => window.location.reload(), 1500);
});


// Function to refresh modules data from server
async function refreshModulesData() {
    try {

        
        const allModules = modulesData;
        
        // Filter modules by current course
        const courseModules = allModules.filter(module => 
            module.courseId === courseId
        );
        
        // Update the global modulesData
        modulesData = courseModules.map(m => ({
            id: `module-${m.moduleId}`,
            moduleId: m.moduleId,
            name: m.moduleName,
            status: m.moduleStatus || 'active',
            description: m.moduleDescription || '',
            assessments: [], // Placeholder - would need another API call to get assessments
            sequenceOrder: m.moduleSequenceOrder,
            startDate: m.startDate,
            endDate: m.endDate,
            courseId: m.courseId
        }));
        
        return true;
    } catch (error) {
        console.error('Error refreshing modules data:', error);
        return false;
    }
}

function openEditModuleModal(moduleId) {
    const module = modulesData.find(m => m.moduleId === moduleId);
    if (!module) {
        console.error('Module not found for editing:', moduleId);
        return;
    }

    // Populate hidden ID
    document.getElementById('editModuleId').value = module.moduleId;

    // Populate module name
    document.getElementById('editModuleName').value = module.name || '';

    // Populate start and end dates in YYYY-MM-DD format (for <input type="date">)
    document.getElementById('editModuleStartDate').value = module.startDate
        ? new Date(module.startDate).toISOString().split('T')[0]
        : '';

    document.getElementById('editModuleEndDate').value = module.endDate
        ? new Date(module.endDate).toISOString().split('T')[0]
        : '';

    // Set status
    const statusSelect = document.getElementById('editModuleStatus');
    if (statusSelect) {
        [...statusSelect.options].forEach(option => {
            option.selected = (option.value === module.status);
        });
    }

    // Show modal
    editModuleModal.show();
}


document.getElementById('confirmEditModule').addEventListener('click', async function () {
    const moduleId = document.getElementById('editModuleId').value;
    const moduleName = document.getElementById('editModuleName').value.trim();
    const status = document.getElementById('editModuleStatus').value;
    const startDate = document.getElementById('editModuleStartDate').value;
    const endDate = document.getElementById('editModuleEndDate').value;

    if (!moduleName) {
        alert('Module name is required');
        return;
    }
	
	// Custom date validation before sending the request
	document.getElementById('editStartDateError').style.display = 'none';
	document.getElementById('editEndDateError').style.display = 'none';

	const moduleStart = new Date(startDate);
	const moduleEnd = new Date(endDate);
	const courseStart = new Date(courseStartDate); // Assumes globally available
	const courseEnd = new Date(courseEndDate);     // Assumes globally available

	let hasError = false;

	if (startDate && (moduleStart < courseStart || moduleStart > courseEnd)) {
	    document.getElementById('editStartDateError').style.display = 'block';
	    hasError = true;
	}

	if (endDate && (moduleEnd <= moduleStart || moduleEnd > courseEnd)) {
	    document.getElementById('editEndDateError').style.display = 'block';
	    hasError = true;
	}
	
    const confirmBtn = this;
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;

	if (hasError) {
	    confirmBtn.innerHTML = originalText;
	    confirmBtn.disabled = false;
	    return; // Stop update
	}

    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    try {
        const currentModule = modulesData.find(m => m.moduleId == moduleId);
        if (!currentModule) throw new Error("Module not found");

        const moduleData = {
            moduleId: parseInt(moduleId),
            course: { courseId: currentModule.courseId },
            moduleName: moduleName,
            moduleStatus: status,
			startDate: startDate ? `${startDate}T00:00:00` : null, // Convert to LocalDateTime format
			endDate: endDate ? `${endDate}T23:59:59` : null,   
            moduleSequenceOrder: currentModule.sequenceOrder
        };

        const response = await fetch(`http://localhost:8082/api/modules/${moduleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(moduleData)
        });

        if (!response.ok) throw new Error(await response.text());


        renderModuleSidebar();

        if (currentModuleId == moduleId) {
            const updated = modulesData.find(m => m.moduleId == moduleId);
            if (updated) renderModuleContent(updated.id);
        }

        showSuccessToast(`Module "${moduleName}" updated successfully!`);
        editModuleModal.hide();
    } catch (error) {
        console.error('Edit Error:', error);
        showErrorToast(`Error: ${error.message}`);
    } finally {
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
	
	// Refresh the page after a short delay
	        setTimeout(() => window.location.reload(), 1500);
});


// Function to open delete confirmation modal
function prepareDeleteModule(moduleId) {
    const module = modulesData.find(m => m.moduleId === moduleId);
    if (!module) return;
    
    const idField = document.getElementById('moduleToDeleteId');
    const nameField = document.getElementById('moduleToDeleteName');
    
    if (idField) idField.value = moduleId;
    if (nameField) nameField.textContent = module.name;
    
    // Make sure deleteModuleModal is defined
    if (typeof deleteModuleModal !== 'undefined' && deleteModuleModal) {
        deleteModuleModal.show();
    } else {
        console.error('deleteModuleModal is not defined or not initialized');
    }
}

// Delete Module confirmation - DELETE request to API
document.getElementById('confirmDeleteModule').addEventListener('click', async function() {
    const moduleId = document.getElementById('moduleToDeleteId').value;
    const moduleName = document.getElementById('moduleToDeleteName').textContent;
    
    // Loading state
    const confirmBtn = document.getElementById('confirmDeleteModule');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    
    try {
        // Call API to delete module
        const response = await fetch(`http://localhost:8082/api/modules/${moduleId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to delete module');
        }
        
        
        // Re-render sidebar
        renderModuleSidebar();
        
        // If currently viewing the deleted module, hide content
        if (currentModuleId == moduleId) {
            document.querySelectorAll('.module-content-section').forEach(section => {
                section.style.display = 'none';
            });
            currentModuleId = null;
        }
        
        showSuccessToast(`Module "${moduleName}" deleted successfully!`);
        deleteModuleModal.hide();
    } catch (error) {
        console.error('Error deleting module:', error);
        showErrorToast(`Error: ${error.message}`);
    } finally {
        // Reset button state
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
});

// Attach event listeners to dynamically loaded modules using event delegation
document.addEventListener('click', function(e) {
    // Handle Edit button click
    if (e.target.closest('.edit-module-btn')) {
        const btn = e.target.closest('.edit-module-btn');
        const moduleId = btn.getAttribute('data-module-id');
        e.stopPropagation(); // Prevent triggering module selection
        openEditModuleModal(parseInt(moduleId));
    }

    // Handle Delete button click
    if (e.target.closest('.delete-module-btn')) {
        const btn = e.target.closest('.delete-module-btn');
        const moduleId = btn.getAttribute('data-module-id');
        e.stopPropagation(); // Prevent triggering module selection
        prepareDeleteModule(parseInt(moduleId));
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules data from backend
    initializeModulesData();
	
	// Create backdrops if they don't exist
	    createBackdropsIfNeeded();
	    
	    // Initialize Bootstrap components
	    initBootstrapComponents();
	    
	    // Initialize sidebars
	    initSidebars();
	    
	    // Render the module sidebar
	    renderModuleSidebar();
    
	    
	    // Initialize module content area
	    const moduleContentContainer = document.querySelector('.module-content-container');
	    if (!moduleContentContainer) {
	        const mainContent = document.querySelector('.main-content');
	        if (mainContent) {  // Check if mainContent exists
	            const container = document.createElement('div');
	            container.className = 'module-content-container';
	            mainContent.appendChild(container);
	        }
	    }
    
	// Show first module content if available, otherwise show empty state
	    if (modulesData && modulesData.length > 0) {
	        const defaultModule = modulesData[0];
	        renderModuleContent(defaultModule.id, 'performance');
	        document.getElementById(`${defaultModule.id}-content`).style.display = 'block';
	        currentModuleId = defaultModule.moduleId;
	        
	        // Mark as active in sidebar
	        const defaultModuleItem = document.querySelector(`[onclick*="${defaultModule.id}"]`);
	        if (defaultModuleItem) {
	            defaultModuleItem.classList.add('active');
	        }
	    } else {
	        showEmptyState();
	    }
});

function showEmptyState() {
    const moduleContentContainer = document.querySelector('.module-content-container');
    if (!moduleContentContainer) {
        console.error('Module content container not found');
        return;
    }
    
    moduleContentContainer.innerHTML = `
        <div class="empty-state p-5 text-center">
            <div class="empty-state-icon mb-4">
                <i class="fas fa-book fa-4x text-muted"></i>
            </div>
            <h4>No Modules Available</h4>
            <p class="text-muted mb-4">This course doesn't have any modules yet. Create your first module to get started.</p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModuleModal">
                <i class="fas fa-plus mr-2"></i> Create First Module
            </button>
        </div>
    `;
}

function initBootstrapComponents() {
    addModuleModal = new bootstrap.Modal(document.getElementById('addModuleModal'));
    editModuleModal = new bootstrap.Modal(document.getElementById('editModuleModal'));
    deleteModuleModal = new bootstrap.Modal(document.getElementById('deleteModuleModal'));
    successToast = new bootstrap.Toast(document.getElementById('successToast'));
    errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
}

function createBackdropsIfNeeded() {
    if (!document.getElementById('sidenavBackdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'sidenavBackdrop';
        backdrop.className = 'sidenav-backdrop';
        backdrop.onclick = function() { toggleMainSidenav(false); };
        document.body.appendChild(backdrop);
    }
    
    if (!document.getElementById('moduleSidebarBackdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'moduleSidebarBackdrop';
        backdrop.className = 'module-sidebar-backdrop';
        backdrop.onclick = function() { toggleModuleSidebar(); };
        document.body.appendChild(backdrop);
    }
}

// Handle window resizing
window.addEventListener('resize', function() {
    const windowWidth = window.innerWidth;
    const moduleSidebar = document.getElementById('moduleSidebar');
    const backdrop = document.getElementById('moduleSidebarBackdrop');
    
    if (windowWidth > 992) {
        moduleSidebar.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
});