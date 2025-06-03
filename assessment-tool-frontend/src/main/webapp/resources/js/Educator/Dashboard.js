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

document.addEventListener('DOMContentLoaded', async function() {
    
    // Call populate stats after DOM is loaded
    await populateTopStats();
	
	await loadTopPerformingCourses();
	});

// Initialize performance chart
const studentData = {
    john: { labels: ['Quiz 1', 'Assignment 1', 'Midterm'], data: [85, 78, 92] },
    sarah: { labels: ['Quiz 1', 'Assignment 1', 'Midterm'], data: [91, 88, 75] },
    michael: { labels: ['Quiz 1', 'Assignment 1', 'Midterm'], data: [67, 73, 80] },
};


async function getEnrolledStudentCount(courseId) {
    try {
        const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/students`);
        const students = await response.json();
        return students.length;
    } catch (err) {
        console.error(err);
        return 0;
    }
}

function calculateCompletion(course) {
    const totalModules = course.modules.length;
    const completedModules = course.modules.filter(m => new Date(m.endDate) < new Date()).length;
    return totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
}


async function loadTopPerformingCourses() {
    const courseScores = [];

    for (const course of backendCourses) {
        const studentCount = await getEnrolledStudentCount(course.courseId);
        const completion = calculateCompletion(course);

        // Composite score
        const rating = 4 + Math.random(); // optional
        const score = (studentCount * 0.4) + (completion * 0.5) + (rating * 10 * 0.1);

        courseScores.push({
            ...course,
            studentCount,
            completion,
            score: score.toFixed(1)
        });
    }

    const topCourses = courseScores.sort((a, b) => b.score - a.score).slice(0, 3);
    const tbody = document.getElementById("topCoursesBody");
    tbody.innerHTML = "";

    topCourses.forEach(course => {
        const row = `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="bg-primary text-white rounded d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div>
                            <div class="fw-semibold">${course.courseName}</div>
                            <div class="text-muted small" style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${course.courseDescription || ""}
                            </div>
                        </div>
                    </div>
                </td>
                <td>${course.studentCount}</td>
                <td>
                    <div style="width: 120px;">
                        <div class="course-progress">
                            <div class="progress-bar" role="progressbar" style="width: ${parseInt(course.completion)}%;"></div>
                        </div>
                        <div class="text-muted small mt-1">${parseInt(course.completion)}%</div>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-chart-line text-warning"></i>
                        <span class="ms-1">${course.score}</span>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}


window.addEventListener("DOMContentLoaded", loadTopPerformingCourses);


// Simple Educator Performance Score Calculator
function calculateEducatorScore() {
        if (!backendResults || !backendStudents) return 50;
        const totalResults = backendResults.length;
        const passedResults = backendResults.filter(r => r.resultStatus === 'Passed').length;
        const passRate = totalResults > 0 ? (passedResults / totalResults) * 100 : 0;

        const totalStudents = backendStudents.length;
        const activeStudents = new Set(backendResults.map(r => r.studentId)).size;
        const engagementRate = totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;

        const scores = backendResults.filter(r => r.resultPercentage).map(r => r.resultPercentage);
        const avgPerformance = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        const finalScore = Math.round(
            (passRate * 0.40) +
            (engagementRate * 0.35) +
            (avgPerformance * 0.25)
        );

        console.log(`Educator Score: Pass Rate: ${passRate.toFixed(1)}%, Engagement: ${engagementRate.toFixed(1)}%, Avg Performance: ${avgPerformance.toFixed(1)}%`);
        return Math.min(100, Math.max(0, finalScore));
    }

	function updateEducatorGauge() {
	    const score = calculateEducatorScore(); // Calculate score (0-100)
	    const gaugeFill = document.getElementById('gaugeFill');
	    const scoreText = document.querySelector('svg text');

	    if (!gaugeFill || !scoreText) return;

	    const radius = 90;
	    const centerX = 100;
	    const centerY = 100;

	    // Convert score to angle (in radians, from 0 to π)
	    const angle = (score / 100) * Math.PI;

	    // Calculate arc end point (X,Y) using center and radius
	    const endX = centerX + radius * Math.cos(Math.PI - angle);  // Start at left (Math.PI)
	    const endY = centerY - radius * Math.sin(Math.PI - angle);  // Invert Y since SVG Y increases downwards

	    // Determine large-arc flag (1 if angle > π/2, i.e., score > 50)
	    const largeArc = score > 90 ? 1 : 0;

	    // Update arc path (from start point (10,100) to end point)
	    gaugeFill.setAttribute('d', `M 10 100 A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`);

	    // Update text
	    scoreText.textContent = `${score}%`;

	    // Update color based on score
	    const color = score >= 50 ? '#024CAA' : '#e74c3c';
	    gaugeFill.setAttribute('stroke', color);
	    scoreText.setAttribute('fill', color);

	    return score;
	}

    // Initialize the gauge when the page loads
    window.onload = updateEducatorGauge;


// Access global variables injected by Thymeleaf
console.log("Courses:", backendCourses);
console.log("Students:", backendStudents);
console.log("User Info:", userInfo);
console.log("Results Data:", resultsData);

// Prepare month names (Jan-Dec)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Initialize engagement scores for each month
const engagementScores = Array(12).fill(0);

// Process results to calculate engagement per month based on completedDate
resultsData.forEach(result => {
    if (!result.completedDate) return;  // safety check

    const date = new Date(result.completedDate);
    const monthIndex = date.getMonth(); // 0 (Jan) to 11 (Dec)

    // You can sum either 1 per completed assessment or use obtainedMarks or resultPercentage
    engagementScores[monthIndex] += 1;
});

// Render Chart.js line chart with months
const ctx = document.getElementById('monthlyEngagementChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: 'Monthly Engagement',
            data: engagementScores,
            backgroundColor: 'rgba(67, 97, 238, 0.2)',
            borderColor: '#4361ee',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#4361ee',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Engagement Score'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        }
    }
});


async function renderStudentPerformancePieChart(mode) {
    const ctx = document.getElementById('studentPerformancePieChart');
    if (!ctx) {
        console.error('Canvas element not found');
        return;
    }

    const canvasContext = ctx.getContext('2d');
    if (!canvasContext) {
        console.error('Unable to get canvas context');
        return;
    }

    if (!backendStudents || backendStudents.length === 0 || !backendResults || backendResults.length === 0) {
        console.warn('No data available for the pie chart.');
        canvasContext.clearRect(0, 0, ctx.width, ctx.height);
        canvasContext.font = "16px Arial";
        canvasContext.fillText("No data available", 50, 50);
        return;
    }

    if (window.studentPieChart) {
        window.studentPieChart.destroy();
    }

    const categories = ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'];
    const categoryCounts = new Array(categories.length).fill(0);

    for (const student of backendStudents) {
        const studentResults = backendResults.filter(r => Number(r.studentId) === Number(student.userId));
        if (studentResults.length === 0) continue;

        console.log("Student: ", student.userId + student.userFirstName);

        let value = 0;
        if (mode === 'passRate') {
            const total = studentResults.length;
            const passed = studentResults.filter(r => (r.resultStatus || '').toLowerCase() === 'passed').length;
            value = total > 0 ? Math.round((passed / total) * 100) : 0;
        } else if (mode === 'attendance') {
            const assignedAssessments = await getTotalAssignedAssessmentsForStudent(student.userId);
            const completedAssessments = new Set(studentResults.map(r => r.assessmentId)).size;
            console.log("Completed: ", completedAssessments);
            console.log("Assigned: ", assignedAssessments);
            value = assignedAssessments > 0
                ? Math.round((completedAssessments / assignedAssessments) * 100)
                : 0;
        }

        if (value <= 20) categoryCounts[0]++;
        else if (value <= 40) categoryCounts[1]++;
        else if (value <= 60) categoryCounts[2]++;
        else if (value <= 80) categoryCounts[3]++;
        else categoryCounts[4]++;
    }

    const colors = ['#f72585', '#7209b7', '#4361ee', '#4cc9f0', '#1cc88a'];

    window.studentPieChart = new Chart(canvasContext, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryCounts,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: `Student Distribution by ${mode === 'passRate' ? 'Pass Rate' : 'Attendance %'}` },
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: ${context.raw} students`
                    }
                }
            }
        }
    });
}


let lastViewedStudentCourses = [];

async function getTotalAssignedAssessmentsForStudent(studentId) {
    let totalAssigned = 0;

    try {
        const response = await fetch(`/Educator/student/${studentId}/enrolled-courses`);
        const courses = await response.json();
        console.log("Courses: ", courses);
        lastViewedStudentCourses = courses || [];  // Store for future use

        lastViewedStudentCourses.forEach(course => {
            course.modules?.forEach(module => {
                module.assessments?.forEach(assessment => {
                    totalAssigned++;
                });
            });
        });

        console.log("Total Assigned: ", totalAssigned);
        return totalAssigned;

    } catch (error) {
        console.error('Error fetching courses:', error);
        return 0;  // On error, treat as 0 assigned
    }
}


window.renderStudentPerformancePieChart = renderStudentPerformancePieChart;


// Auto-render pie chart
document.addEventListener('DOMContentLoaded', () => renderStudentPerformancePieChart('passRate'));

console.log("BackendStudents outsides: ", backendStudents);



// Chart management object
const chartManager = {
    instance: null,
    isInitialized: false,
    
    init: function() {
        try {
            const canvas = document.getElementById('studentPerformanceChart');
            if (!canvas) {
                throw new Error("Canvas element not found");
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error("Canvas context not available");
            }
            
            this.instance = new Chart(ctx, {
                type: 'bar',
                data: { 
                    labels: [], 
                    datasets: [{
                        label: 'Score (%)',
                        data: [],
                        backgroundColor: '#4361ee'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            max: 100 
                        } 
                    }
                }
            });
            this.isInitialized = true;
            console.log("Chart successfully initialized");
        } catch (error) {
            console.error("Chart initialization failed:", error);
            this.isInitialized = false;
        }
    },
    
    update: function(labels, data) {
        if (!this.isInitialized || !this.instance) {
            console.warn("Chart not initialized, attempting initialization");
            this.init();
            if (!this.isInitialized) return;
        }
        
        try {
            this.instance.data.labels = labels || [];
            this.instance.data.datasets[0].data = data || [];
            this.instance.update();
            console.log("Chart updated successfully");
        } catch (error) {
            console.error("Chart update failed:", error);
        }
    },
    
    destroy: function() {
        if (this.instance) {
            this.instance.destroy();
            this.instance = null;
            this.isInitialized = false;
        }
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing dashboard");
    
    // Initialize dropdown with proper error checking
    const studentSelect = document.getElementById('studentSelect');
    if (!studentSelect) {
        console.error("Student select element not found");
        return;
    }
    
    // Clear and populate dropdown
    studentSelect.innerHTML = '<option value="" selected disabled>Select Student</option>';
    
    // Check if backendStudents exists and is an array
    if (Array.isArray(backendStudents) && backendStudents.length > 0) {
        backendStudents.forEach(student => {
            if (student && student.userId) {
                const option = document.createElement('option');
                option.value = student.userId;
                option.textContent = `${student.userFirstName || ''} ${student.userLastName || ''}`.trim() || `Student ${student.userId}`;
                studentSelect.appendChild(option);
            }
        });
    } else {
        console.warn("No student data available");
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No students available";
        option.disabled = true;
        studentSelect.appendChild(option);
    }
    
    // Initialize chart
    chartManager.init();
    
    // Set up event handler with proper error checking
    studentSelect.addEventListener('change', function(event) {
        // Use event.target instead of this for better reliability
        const selectElement = event.target;
        if (!selectElement || !selectElement.value) {
            console.log("No student selected or invalid selection");
            return;
        }
        
        const studentId = selectElement.value;
        console.log(`Selected student ID: ${studentId}`);
        updateStudentChart(studentId);
    });
    
    // Load initial data if available
    if (Array.isArray(backendStudents) && backendStudents.length > 0) {
        // Don't auto-select, let user choose
        console.log("Students loaded, ready for selection");
    }
});

function updateStudentChart(studentId) {
    if (!studentId) {
        console.error("No student ID provided");
        return;
    }

    console.log(`Updating chart for student ${studentId}`);
    
    // Show loading state
    chartManager.update(['Loading...'], [0]);

    fetch(`/Educator/student/${studentId}/enrolled-courses`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(courses => {
            console.log("Fetched courses for student:", courses);
            
            // Build assessment map
            const assessmentMap = new Map();
            
            if (Array.isArray(courses)) {
                courses.forEach(course => {
                    if (course && Array.isArray(course.modules)) {
                        course.modules.forEach(module => {
                            if (module && Array.isArray(module.assessments)) {
                                module.assessments.forEach(assessment => {
                                    if (assessment && assessment.assessmentId) {
                                        assessmentMap.set(
                                            assessment.assessmentId,
                                            assessment.assessmentName || `Assessment ${assessment.assessmentId}`
                                        );
                                    }
                                });
                            }
                        });
                    }
                });
            }
            
            console.log("Assessment map built:", Array.from(assessmentMap.entries()));

            // DEBUG: Inspect the structure of results for student 3
            console.log("\n=== INSPECTING RESULT PROPERTIES ===");
            
            if (Array.isArray(backendResults)) {
                backendResults.forEach((result, index) => {
                    if (result && Number(result.studentId) === Number(studentId)) {
                        console.log(`\nResult ${index} for student ${studentId}:`);
                        console.log("All properties:", Object.keys(result));
                        console.log("Full object:", result);
                        
                        // Check for different possible score property names
                        const possibleScoreProps = ['score', 'Score', 'resultPercentage'];
                        
                        possibleScoreProps.forEach(prop => {
                            if (result.hasOwnProperty(prop)) {
                                console.log(`  ✅ Found: ${prop} = ${result[prop]}`);
                            } else {
                                console.log(`  ❌ Missing: ${prop}`);
                            }
                        });
                    }
                });
            }
            
            console.log("=== END INSPECTION ===\n");

            // Process results with flexible score property detection
            let studentResults = [];
            if (Array.isArray(backendResults)) {
                studentResults = backendResults.filter(result => {
                    if (!result || !result.studentId || Number(result.studentId) !== Number(studentId)) {
                        return false;
                    }
                    
                    if (result.assessmentId === undefined) {
                        return false;
                    }
                    
                    // Check for any possible score property
                    const hasScore = result.score !== undefined ||
                                   result.resultPercentage !== undefined;
                    
                    return hasScore;
                });
            }
            

            // Prepare chart data with flexible score extraction
            const labels = studentResults.map(result => 
                assessmentMap.get(result.assessmentId) || `Assessment ${result.assessmentId || 'Unknown'}`
            );

            const data = studentResults.map(result => {
                // Try different score property names
                let scoreValue = result.score ?? 
                               result.resultPercentage ??
                               0;
                
                const score = Number(scoreValue);
                return isNaN(score) ? 0 : score;
            });

            console.log("Chart data prepared:", { labels, data });

            // Update chart
            if (labels.length === 0) {
                console.log("No data found for selected student");
                chartManager.update(['No Data Available'], [0]);
            } else {
                chartManager.update(labels, data);
            }
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            chartManager.update(['Error Loading Data'], [0]);
        });
}

// Add error handling for global errors
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    chartManager.destroy();
});


// Class Participation Module (self-contained with no global conflicts)
const ClassParticipationAnalysis = (function() {
    // Private variables
    let chartInstance = null;
    let classData = {};
    
    // Initialize the chart
    function initChart() {
        try {
            const ctx = document.getElementById('classParticipationChart');
            if (!ctx) throw new Error("Canvas element not found");
            
            chartInstance = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Assessments Assigned',
                            borderColor: '#091057',
                            backgroundColor: '#024CAA',
                            data: [],
                            yAxisID: 'y',
                            barThickness: 12,
                            borderRadius: 3
                        },
                        {
                            type: 'line',
                            label: 'Average Score (%)',
                            borderColor: '#3a0ca3',
                            backgroundColor: '#3a0ca355',
                            data: [],
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y1'
                        },
                        {
                            type: 'line',
                            label: 'Participation %',
                            borderColor: '#f72585',
                            backgroundColor: '#f72585',
                            data: [],
                            yAxisID: 'y1',
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.datasetIndex === 0) {
                                        label += context.raw + ' assessments';
                                    } else {
                                        label += context.raw + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Assessments Count' }
                        },
                        y1: {
                            beginAtZero: true,
                            min: 0,
                            max: 100,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            title: { display: true, text: 'Score / Participation %' }
                        }
                    }
                }
            });
            
            console.log("Class Participation Chart initialized");
            return true;
        } catch (error) {
            console.error("Chart initialization failed:", error);
            return false;
        }
    }
    
    // Process backend data to prepare for visualization
    async function processClassData() {
        const processedData = {};
        
        if (!Array.isArray(backendCourses)) {
            console.warn("No course data available");
            return processedData;
        }
		
		console.log("Courses: ", backendCourses);
        
        for (const course of backendCourses) {
            try {
                if (!course.courseId) continue;
                
                // Get student enrollments
                const studentCount = await getEnrolledStudentCountCourse(course.courseId);
                if (studentCount === 0) continue;
				
				console.log("StudentCount: ", studentCount);
                
                // Calculate completion percentage
                const completionPercentage = calculateCompletionCourse(course);
				
				console.log("Completion: ", completionPercentage);
                
                // Get all assessments for this course
                const assessments = [];
                if (course.modules) {
                    course.modules.forEach(module => {
                        if (module.assessments) {
                            assessments.push(...module.assessments);
                        }
                    });
                }
                
                // Filter results for this course's assessments
                const courseResults = (backendResults || []).filter(result => 
                    assessments.some(a => a.assessmentId === result.assessmentId)
                );
				console.log("Course Results: ", courseResults);
                
                // Calculate average score
                const avgScore = courseResults.length > 0 
                    ? Math.round(courseResults.reduce((sum, r) => sum + (r.resultPercentage || 0), 0) / courseResults.length)
                    : 0;
					
					console.log("AvgScore: ", avgScore);
                
                // Calculate participation rate
                const participationRate = assessments.length > 0
                    ? Math.round((courseResults.length / (assessments.length * studentCount)) * 100)
                    : 0;
                
					console.log("Participation: ", participationRate);
                // Store processed data
				// Generate dynamic labels (e.g., weeks between course start and end)
				const start = new Date(course.courseStartDate);
				const end = new Date(course.courseEndDate);
				const numWeeks = Math.ceil((end - start) / (7 * 24 * 60 * 60 * 1000));

				const labels = [];
				for (let i = 0; i < numWeeks; i++) {
				    labels.push(`Week ${i + 1}`);
				}

				// Initialize weekly data arrays
				const weeklyAssessments = new Array(numWeeks).fill(0);
				const weeklyScores = new Array(numWeeks).fill(0);
				const weeklyParticipation = new Array(numWeeks).fill(0);
				const weeklyCounts = new Array(numWeeks).fill(0);  // for averaging scores

				// Map assessments and results into weekly buckets
				const results = (backendResults || []).filter(r => 
				    assessments.some(a => a.assessmentId === r.assessmentId)
				);

				results.forEach(r => {
				    const resultDate = new Date(r.completedDate);  // Assuming createdAt is result timestamp
				    const weekIndex = Math.floor((resultDate - start) / (7 * 24 * 60 * 60 * 1000));
				    if (weekIndex >= 0 && weekIndex < numWeeks) {
				        weeklyScores[weekIndex] += r.resultPercentage || 0;
				        weeklyParticipation[weekIndex] += 1;
				        weeklyCounts[weekIndex] += 1;
				    }
				});

				// Calculate average scores and participation %
				for (let i = 0; i < numWeeks; i++) {
				    weeklyScores[i] = weeklyCounts[i] ? Math.round(weeklyScores[i] / weeklyCounts[i]) : 0;
				    weeklyParticipation[i] = assessments.length * studentCount
				        ? Math.round((weeklyParticipation[i] / (assessments.length * studentCount)) * 100)
				        : 0;
				}

				// Modify the assessment distribution logic:
				assessments.forEach(a => {
				    // Use assessment date or module start date as fallback
				    const assessmentDate = a.startDate 
				        ? new Date(a.startDate)
				        : new Date(a.module?.startDate || course.courseStartDate);
				    
				    const weekIndex = Math.floor((assessmentDate - start) / (7 * 24 * 60 * 60 * 1000));
				    if (weekIndex >= 0 && weekIndex < numWeeks) {
				        weeklyAssessments[weekIndex]++;
				    } else {
				        // Default to first week if date is invalid
				        weeklyAssessments[0]++;
				    }
				});

				// Store dynamic data
				processedData[course.courseId] = {
				    name: course.courseName,
				    data: {
				        labels,
				        assessments: weeklyAssessments,
				        avgScore: weeklyScores,
				        participation: weeklyParticipation
				    }
				};
				
				console.log("Processed weekly data:", {
				    weeks: numWeeks,
				    assessments: weeklyAssessments,
				    scores: weeklyScores,
				    participation: weeklyParticipation
				});

            } catch (error) {
                console.error(`Error processing course ${course.courseId}:`, error);
            }
        }
        
        return processedData;
    }
    
    // Update the chart with new data
    
	function updateChart(courseId) {
	    // Validate chart instance
	    if (!chartInstance) {
	        console.error("Chart instance not initialized");
	        return;
	    }

	    // Validate courseId and data existence
	    if (!courseId) {
	        console.warn("No course ID provided");
	        return;
	    }

	    // Safely access course data
	    const courseInfo = classData[courseId];
	    if (!courseInfo) {
	        console.warn(`No data found for course ID: ${courseId}`);
	        showNoDataMessage();
	        return;
	    }

	    const data = courseInfo.data;
	    if (!data) {
	        console.warn(`Data object missing for course ID: ${courseId}`);
	        showNoDataMessage();
	        return;
	    }

	    // Validate required data fields
	    const requiredFields = ['labels', 'assessments', 'avgScore', 'participation'];
	    const missingFields = requiredFields.filter(field => !data[field]);

	    if (missingFields.length > 0) {
	        console.warn(`Missing required data fields: ${missingFields.join(', ')}`);
	        showNoDataMessage();
	        return;
	    }

	    // Update chart data
	    try {
	        chartInstance.data.labels = data.labels || [];
	        chartInstance.data.datasets[0].data = data.assessments || [];
	        chartInstance.data.datasets[1].data = data.avgScore || [];
	        chartInstance.data.datasets[2].data = data.participation || [];
	        
	        // Ensure all arrays have the same length
	        const lengths = [
	            chartInstance.data.labels.length,
	            chartInstance.data.datasets[0].data.length,
	            chartInstance.data.datasets[1].data.length,
	            chartInstance.data.datasets[2].data.length
	        ];
	        
	        if (new Set(lengths).size > 1) {
	            console.warn("Data arrays have inconsistent lengths");
	            showNoDataMessage();
	            return;
	        }

	        chartInstance.update();
	        console.log(`Chart updated successfully for course ${courseId}`);
	    } catch (error) {
	        console.error("Error updating chart:", error);
	        showNoDataMessage();
	    }
	}

	// Helper function to display "No Data" state
	function showNoDataMessage() {
	    if (!chartInstance) return;
	    
	    try {
	        chartInstance.data.labels = ['No Data Available'];
	        chartInstance.data.datasets.forEach(dataset => {
	            dataset.data = [0];
	        });
	        chartInstance.update();
	    } catch (error) {
	        console.error("Error showing no data message:", error);
	    }
	}
    
    // Initialize dropdown with course options
    function initDropdown() {
        const select = document.getElementById('classSelect');
        if (!select) {
            console.error("Class select element not found");
            return false;
        }
        
        // Clear existing options
        select.innerHTML = '<option selected disabled>Select Class</option>';
        
		if (!Array.isArray(backendCourses)) {  // Added missing parenthesis
		    console.warn("No course data available");
		    return processedData;
		}
        
        // Add course options
        backendCourses.forEach(course => {
            if (course.courseId && course.courseName) {
                const option = document.createElement('option');
                option.value = course.courseId;
                option.textContent = course.courseName;
                select.appendChild(option);
            }
        });
        
        return true;
    }
    
    // Public initialization method
    async function init() {
        // Initialize chart first
        if (!initChart()) return false;
        
        // Process data
        classData = await processClassData();
        
        // Initialize dropdown
        if (!initDropdown()) return false;
        
        // Set up event listener
        document.getElementById('classSelect').addEventListener('change', function() {
            updateChart(this.value);
        });
        
        // Select first course if available
        if (backendCourses?.length > 0) {
            const select = document.getElementById('classSelect');
            select.selectedIndex = 1;
            updateChart(select.value);
        }
        
        return true;
    }
    
    // Expose public methods
    return {
        init
    };
})();

// Helper functions (reused from your existing code)
async function getEnrolledStudentCountCourse(courseId) {
    try {
        const response = await fetch(`http://localhost:8082/api/enrollments/course/${courseId}/students`);
        const students = await response.json();
        return students.length;
    } catch (err) {
        console.error("Error fetching enrolled students:", err);
        return 0;
    }
}

function calculateCompletionCourse(course) {
    if (!course.modules || course.modules.length === 0) return 0;
    
    const now = new Date();
    const completedModules = course.modules.filter(m => 
        m.endDate && new Date(m.endDate) < now
    ).length;
    
    return Math.round((completedModules / course.modules.length) * 100);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Class Participation Analysis");
    ClassParticipationAnalysis.init();
});