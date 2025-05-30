document.addEventListener('DOMContentLoaded', function() {
    // Initialize event handlers
    initializeEventHandlers();
    
    // Format dates
    formatDates();
    
    // This is for animation purposes - add a small delay before revealing content
    setTimeout(() => {
        document.querySelector('.result-card').classList.add('loaded');
    }, 100);
});

function initializeEventHandlers() {
    // Certificate view button
    const certificateBtn = document.getElementById('printCertificateBtn');
    if (certificateBtn) {
        certificateBtn.addEventListener('click', function() {
            const certificateContainer = document.getElementById('certificateContainer');
            if (certificateContainer) {
                certificateContainer.style.display = 'block';
            }
        });
    }
    
    // Close certificate button
    const closeCertBtn = document.getElementById('closeCertificate');
    if (closeCertBtn) {
        closeCertBtn.addEventListener('click', function() {
            const certificateContainer = document.getElementById('certificateContainer');
            if (certificateContainer) {
                certificateContainer.style.display = 'none';
            }
        });
    }
    
    // Print certificate button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Download results button
    const downloadBtn = document.getElementById('downloadResultsBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadResults();
        });
    }
}

function formatDates() {
    // This function can be extended if there are more dates to format
    // For now, certificate date is handled by Thymeleaf
}

function downloadResults() {
    // Make sure we have the result data
    if (!resultData || !questionResponsesData) {
        alert('Result data is not available for download');
        return;
    }
    
    // Calculate stats
    const totalQuestions = questionResponsesData.length;
    const correctAnswers = questionResponsesData.filter(qr => qr.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    
    // Format date
    let completedDate = 'Not available';
    if (resultData.completedDate) {
        const date = new Date(resultData.completedDate);
        completedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Create text content for download
    const resultsText = `
ASSESSMENT RESULTS
==================

Assessment: ${assessmentData ? assessmentData.assessmentTitle : 'Assessment'}
Date Completed: ${completedDate}

SCORE SUMMARY
------------
Total Score: ${resultData.obtainedMarks} / ${resultData.totalMarks} (${resultData.resultPercentage}%)
Status: ${resultData.resultPercentage >= 60 ? 'PASSED' : 'FAILED'}

Questions Summary:
- Total Questions: ${totalQuestions}
- Correct Answers: ${correctAnswers}
- Incorrect Answers: ${incorrectAnswers}

QUESTION DETAILS
---------------
${questionResponsesData.map((qr, index) => {
    let answerDetails = '';
    if (qr.questionType === 'Single Choice' || qr.questionType === 'Multiple Choice' || qr.questionType === 'True/False') {
        const correctOptions = qr.options.filter(opt => opt.isCorrect).map(opt => opt.optionText).join(', ');
        const selectedOptions = qr.selectedOptions ? qr.selectedOptions.join(', ') : 'None selected';
        answerDetails = `
   Correct Answer: ${correctOptions}
   Your Answer: ${selectedOptions}`;
    } else {
        answerDetails = `
   Your Answer: ${qr.studentResponse || 'No answer provided'}`;
    }
    
    return `
Question ${index + 1}: ${qr.questionText}
   Type: ${qr.questionType}
   Marks: ${qr.marksObtained} / ${qr.questionMarks}
   Result: ${qr.isCorrect ? 'CORRECT' : 'INCORRECT'}${answerDetails}`;
}).join('\n')}

This report was generated on ${new Date().toLocaleDateString()}.
`;

    // Create download
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-results-${resultData.assessmentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add animation for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Fade in each question item sequentially 
    const questionItems = document.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 100));
    });
    
    // Add hover effect to option items
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});