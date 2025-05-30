/* global Chart */

let charts = {
    coursePerformanceChart: null,
    questionAnalysisChart: null,
    studentProgressChart: null
};
document.addEventListener("DOMContentLoaded", () => {
initializeSidebar();
const charts = initializeCharts(); // Initialize charts once
initializeTooltips();
addLegendStyles();
handleResponsiveCharts(charts); // Pass charts to resize handler
});

function initializeSidebar() {
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const mainContent = document.getElementById("mainContent");

if (!sidebarToggle || !sidebar || !closeSidebar || !mainContent) {
    console.error("Sidebar elements not found");
    return;
}

if (window.innerWidth >= 768) {
    sidebarToggle.style.display = 'none';
} else {
    sidebarToggle.style.display = 'flex';
}

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});

closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("show");
});

document.addEventListener("click", (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);
    if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768) {
        sidebar.classList.remove("show");
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        sidebar.classList.remove("show");
        sidebarToggle.style.display = 'none';
        mainContent.style.marginLeft = '260px';
    } else {
        sidebarToggle.style.display = 'flex';
        mainContent.style.marginLeft = '0';
    }
    handleResponsiveCharts(charts);
});
}

function addLegendStyles() {
const style = document.createElement('style');
style.textContent = `
    .legend-dot {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 6px;
    }
    .legend-label {
        font-size: 13px;
        color: #6c757d;
    }
    .course-color-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
    }
`;
document.head.appendChild(style);
}

function initializeTooltips() {
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
}

function initializeCharts() {
// Mock data for courses, assessments, and students
const courseData = {
    'All Courses': {
        performance: [
            { assessment: 'Assessment 1', avgScore: 81 },
            { assessment: 'Assessment 2', avgScore: 85 },
            { assessment: 'Assessment 3', avgScore: 91 }
        ]
    },
    'Mathematics': {
        assessments: ['Assessment 1', 'Assessment 2', 'Assessment 3'],
        students: ['Student A', 'Student B', 'Student C'],
        performance: [
            { assessment: 'Assessment 1', avgScore: 70 },
            { assessment: 'Assessment 2', avgScore: 60 },
            { assessment: 'Assessment 3', avgScore: 65 }
        ]
    },
    'Physics': {
        assessments: ['Assessment 1', 'Assessment 2'],
        students: ['Student A', 'Student D'],
        performance: [
            { assessment: 'Assessment 1', avgScore: 80 },
            { assessment: 'Assessment 2', avgScore: 90 }
        ]
    },
    'Chemistry': {
        assessments: ['Assessment 1', 'Assessment 2', 'Assessment 3'],
        students: ['Student B', 'Student C', 'Student E'],
        performance: [
            { assessment: 'Assessment 1', avgScore: 40 },
            { assessment: 'Assessment 2', avgScore: 55 },
            { assessment: 'Assessment 3', avgScore: 45 }
        ]
    }
};

const questionData = {
    'Mathematics': {
        'Assessment 1': [
            { question: 'Question 1', accuracy: 90 },
            { question: 'Question 2', accuracy: 85 },
            { question: 'Question 3', accuracy: 70 }
        ],
        'Assessment 2': [
            { question: 'Question 1', accuracy: 95 },
            { question: 'Question 2', accuracy: 80 },
            { question: 'Question 3', accuracy: 75 }
        ],
        'Assessment 3': [
            { question: 'Question 1', accuracy: 88 },
            { question: 'Question 2', accuracy: 92 },
            { question: 'Question 3', accuracy: 85 }
        ]
    },
    'Physics': {
        'Assessment 1': [
            { question: 'Question 1', accuracy: 80 },
            { question: 'Question 2', accuracy: 75 },
            { question: 'Question 3', accuracy: 70 }
        ],
        'Assessment 2': [
            { question: 'Question 1', accuracy: 85 },
            { question: 'Question 2', accuracy: 90 },
            { question: 'Question 3', accuracy: 78 }
        ]
    },
    'Chemistry': {
        'Assessment 1': [
            { question: 'Question 1', accuracy: 90 },
            { question: 'Question 2', accuracy: 85 },
            { question: 'Question 3', accuracy: 80 }
        ],
        'Assessment 2': [
            { question: 'Question 1', accuracy: 95 },
            { question: 'Question 2', accuracy: 90 },
            { question: 'Question 3', accuracy: 85 }
        ],
        'Assessment 3': [
            { question: 'Question 1', accuracy: 88 },
            { question: 'Question 2', accuracy: 92 },
            { question: 'Question 3', accuracy: 90 }
        ]
    }
};

const studentProgressData = {
    'Mathematics': {
        'Student A': [
            { assessment: 'Assessment 1', score: 80 },
            { assessment: 'Assessment 2', score: 85 },
            { assessment: 'Assessment 3', score: 90 }
        ],
        'Student B': [
            { assessment: 'Assessment 1', score: 78 },
            { assessment: 'Assessment 2', score: 82 },
            { assessment: 'Assessment 3', score: 88 }
        ],
        'Student C': [
            { assessment: 'Assessment 1', score: 85 },
            { assessment: 'Assessment 2', score: 90 },
            { assessment: 'Assessment 3', score: 92 }
        ]
    },
    'Physics': {
        'Student A': [
            { assessment: 'Assessment 1', score: 75 },
            { assessment: 'Assessment 2', score: 80 }
        ],
        'Student D': [
            { assessment: 'Assessment 1', score: 78 },
            { assessment: 'Assessment 2', score: 82 }
        ]
    },
    'Chemistry': {
        'Student B': [
            { assessment: 'Assessment 1', score: 80 },
            { assessment: 'Assessment 2', score: 85 },
            { assessment: 'Assessment 3', score: 90 }
        ],
        'Student C': [
            { assessment: 'Assessment 1', score: 82 },
            { assessment: 'Assessment 2', score: 88 },
            { assessment: 'Assessment 3', score: 92 }
        ],
        'Student E': [
            { assessment: 'Assessment 1', score: 78 },
            { assessment: 'Assessment 2', score: 85 },
            { assessment: 'Assessment 3', score: 90 }
        ]
    }
};

Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
Chart.defaults.color = "#6c757d";
Chart.defaults.plugins.tooltip.backgroundColor = "rgba(0, 0, 0, 0.7)";
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.titleFont = {
    size: 14,
    weight: '600'
};
Chart.defaults.plugins.tooltip.bodyFont = {
    size: 12
};


function createCoursePerformanceChart() {
    const coursePerformanceCtx = document.getElementById('coursePerformanceChart') && document.getElementById('coursePerformanceChart').getContext('2d');
    if (!coursePerformanceCtx) {
        console.error("Course Performance Chart canvas not found");
        return null;
    }

    if (charts.coursePerformanceChart) {
        charts.coursePerformanceChart.destroy();
    }

    charts.coursePerformanceChart = new Chart(coursePerformanceCtx, {
        type: 'line',
        data: {
            labels: courseData['All Courses'].performance.map(item => item.assessment),
            datasets: [{
                label: 'Average Score',
                data: courseData['All Courses'].performance.map(item => item.avgScore),
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4361ee',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4361ee'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    },
                    grid: {
                        color: '#eaecef'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    return charts.coursePerformanceChart;
}

function createQuestionAnalysisChart() {
    const questionAnalysisCtx = document.getElementById('questionAnalysisChart').getContext('2d');
    if (!questionAnalysisCtx) {
        console.error("Question Analysis Chart canvas not found");
        return null;
    }

    if (charts.questionAnalysisChart) {
        charts.questionAnalysisChart.destroy();
    }

    charts.questionAnalysisChart = new Chart(questionAnalysisCtx, {
        type: 'bar',
        data: {
            labels: questionData['Mathematics']['Assessment 1'].map(item => item.question),
            datasets: [{
                label: 'Accuracy (%)',
                data: questionData['Mathematics']['Assessment 1'].map(item => item.accuracy),
                backgroundColor: 'rgba(6, 214, 160, 0.7)',
                borderColor: '#06d6a0',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    },
                    grid: {
                        color: '#eaecef'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Accuracy:' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });

    return charts.questionAnalysisChart;
}

function createStudentProgressChart() {
    const studentProgressCtx = document.getElementById('studentProgressChart').getContext('2d');
    if (!studentProgressCtx) {
        console.error("Student Progress Chart canvas not found");
        return null;
    }

    if (charts.studentProgressChart) {
        charts.studentProgressChart.destroy();
    }

    charts.studentProgressChart = new Chart(studentProgressCtx, {
        type: 'line',
        data: {
            labels: studentProgressData['Mathematics']['Student A'].map(item => item.assessment),
            datasets: [{
                label: 'Score',
                data: studentProgressData['Mathematics']['Student A'].map(item => item.score),
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffc107',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#ffc107'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    },
                    grid: {
                        color: '#eaecef'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Score:' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });

    return charts.studentProgressChart;
}

// Initialize charts
createCoursePerformanceChart();
createQuestionAnalysisChart();
createStudentProgressChart();

// Course Performance Filter
const courseFilter = document.getElementById('courseFilter');
if (courseFilter) {
    courseFilter.addEventListener('change', (e) => {
        const selectedCourse = e.target.value;
        if (charts.coursePerformanceChart && courseData[selectedCourse]) {
            charts.coursePerformanceChart.data.labels = courseData[selectedCourse].performance.map(item => item.assessment);
            charts.coursePerformanceChart.data.datasets[0].data = courseData[selectedCourse].performance.map(item => item.avgScore);
            charts.coursePerformanceChart.update();
        }
    });
}

// Question Analysis Filters
const questionCourseFilter = document.getElementById('questionCourseFilter');
const assessmentFilter = document.getElementById('assessmentFilter');

function updateAssessmentDropdown(course) {
    if (!assessmentFilter || !courseData[course]) return;
       assessmentFilter.innerHTML = courseData[course].assessments.map(function(assessment) {
           return '<option value="' + assessment + '">' + assessment + '</option>';
       }).join('');
}

if (questionCourseFilter) {
    questionCourseFilter.addEventListener('change', function(e) {
        const selectedCourse = e.target.value;
        updateAssessmentDropdown(selectedCourse);
        const selectedAssessment = (assessmentFilter && assessmentFilter.value) || 'Assessment 1';
        if (charts.questionAnalysisChart && questionData[selectedCourse] && questionData[selectedCourse][selectedAssessment]) {
            charts.questionAnalysisChart.data.labels = questionData[selectedCourse][selectedAssessment].map(function(item) {
                return item.question;
            });
            charts.questionAnalysisChart.data.datasets[0].data = questionData[selectedCourse][selectedAssessment].map(function(item) {
                return item.accuracy;
            });
            charts.questionAnalysisChart.update();
        }
    });
}

if (assessmentFilter) {
    assessmentFilter.addEventListener('change', function(e) {
        const selectedCourse = (questionCourseFilter && questionCourseFilter.value) || 'Mathematics';
        const selectedAssessment = e.target.value;
        if (charts.questionAnalysisChart && questionData[selectedCourse] && questionData[selectedCourse][selectedAssessment]) {
            charts.questionAnalysisChart.data.labels = questionData[selectedCourse][selectedAssessment].map(function(item) {
                return item.question;
            });
            charts.questionAnalysisChart.data.datasets[0].data = questionData[selectedCourse][selectedAssessment].map(function(item) {
                return item.accuracy;
            });
            charts.questionAnalysisChart.update();
        }
    });
}

// Student Progress Filters
const studentCourseFilter = document.getElementById('studentCourseFilter');
const studentFilter = document.getElementById('studentFilter');

function updateStudentDropdown(course) {
    if (!studentFilter || !courseData[course]) return;
        studentFilter.innerHTML = courseData[course].students.map(function(student) {
            return '<option value="' + student + '">' + student + '</option>';
        }).join('');
}

if (studentCourseFilter) {
    studentCourseFilter.addEventListener('change', function(e) {
        const selectedCourse = e.target.value;
        updateStudentDropdown(selectedCourse);
        const selectedStudent = (studentFilter && studentFilter.value) || 'Student A';
        if (charts.studentProgressChart && studentProgressData[selectedCourse] && studentProgressData[selectedCourse][selectedStudent]) {
            charts.studentProgressChart.data.labels = studentProgressData[selectedCourse][selectedStudent].map(function(item) {
                return item.assessment;
            });
            charts.studentProgressChart.data.datasets[0].data = studentProgressData[selectedCourse][selectedStudent].map(function(item) {
                return item.score;
            });
            charts.studentProgressChart.update();
        }
    });
}

if (studentFilter) {
    studentFilter.addEventListener('change', function(e) {
        const selectedCourse = (studentCourseFilter && studentCourseFilter.value) || 'Mathematics';
        const selectedStudent = e.target.value;
        if (charts.studentProgressChart && studentProgressData[selectedCourse] && studentProgressData[selectedCourse][selectedStudent]) {
            charts.studentProgressChart.data.labels = studentProgressData[selectedCourse][selectedStudent].map(function(item) {
                return item.assessment;
            });
            charts.studentProgressChart.data.datasets[0].data = studentProgressData[selectedCourse][selectedStudent].map(function(item) {
                return item.score;
            });
            charts.studentProgressChart.update();
        }
    });
}

// Initialize dropdowns
if (courseData['Mathematics']) {
    updateAssessmentDropdown('Mathematics');
    updateStudentDropdown('Mathematics');
}

return charts;
}

function handleResponsiveCharts(charts) {
const updateChartSizes = () => {
    const width = window.innerWidth;
    let chartHeight;

    if (width <= 576) {
        chartHeight = 180;
    } else if (width <= 767.98) {
        chartHeight = 200;
    } else if (width <= 991.98) {
        chartHeight = 250;
    } else {
        chartHeight = 300;
    }

    document.querySelectorAll('.chart-canvas').forEach(canvas => {
        canvas.style.height = chartHeight + 'px';
    });

    if (charts.coursePerformanceChart) charts.coursePerformanceChart.resize();
    if (charts.questionAnalysisChart) charts.questionAnalysisChart.resize();
    if (charts.studentProgressChart) charts.studentProgressChart.resize();
};

updateChartSizes();
window.removeEventListener('resize', updateChartSizes);
window.addEventListener('resize', updateChartSizes);
}