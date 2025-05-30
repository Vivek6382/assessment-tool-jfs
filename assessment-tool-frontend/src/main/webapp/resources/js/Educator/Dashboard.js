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

const ctxStudent = document.getElementById('studentPerformanceChart').getContext('2d');
let studentChart = new Chart(ctxStudent, {
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
        scales: { y: { beginAtZero: true, max: 100 } }
    }
});

document.getElementById('studentSelect').addEventListener('change', function () {
    const selected = this.value;
    const student = studentData[selected];
    studentChart.data.labels = student.labels;
    studentChart.data.datasets[0].data = student.data;
    studentChart.update();
});


// Class data for different classes
const classData = {
    classA: {
        labels: ['Week 1', 'Week 2', 'Week 3'],
        assessments: [2, 3, 2],
        participation: [75, 50, 58],
        avgScore: [68, 74, 71]
    },
    classB: {
        labels: ['Week 1', 'Week 2', 'Week 3'],
        assessments: [1, 2, 2],
        participation: [60, 90, 70],
        avgScore: [58, 67, 69]
    },
    classC: {
        labels: ['Week 1', 'Week 2', 'Week 3'],
        assessments: [2, 2, 1],
        participation: [85, 68, 60],
        avgScore: [81, 83, 86]
    }
};

// Set up the chart context
const ctxClass = document.getElementById('classParticipationChart').getContext('2d');

// Initialize the chart
let classChart = new Chart(ctxClass, {
    type: 'bar', // Set default type to 'bar'
    data: {
        labels: [], // Will be filled dynamically based on selected class
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
				borderColor: '#f72585', // Change the line color to bright pink
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
        interaction: {
            mode: 'index',
            intersect: false
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


// Event listener for class selection dropdown
document.getElementById('classSelect').addEventListener('change', function () {
    const selectedClass = this.value;
    const classInfo = classData[selectedClass]; // Get the data for the selected class

    // Update chart data based on selected class
    classChart.data.labels = classInfo.labels;
    classChart.data.datasets[0].data = classInfo.assessments;
    classChart.data.datasets[1].data = classInfo.avgScore;
    classChart.data.datasets[2].data = classInfo.participation;

    // Update the chart to reflect changes
    classChart.update();
});


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
