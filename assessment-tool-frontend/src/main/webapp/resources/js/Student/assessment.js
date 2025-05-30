document.addEventListener('DOMContentLoaded', function() {
    // Get the duration from the data attribute (in minutes)
    const durationElement = document.getElementById('countdownTimer');
    const durationMinutes = durationElement ? parseInt(durationElement.getAttribute('data-duration'), 10) : 120;
    
    // Format the initial display
    formatInitialCountdown(durationMinutes);
    
    // Add visual effects when hovering over cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a subtle glow effect when hovering
            this.style.boxShadow = '0 0.5rem 2rem rgba(78, 115, 223, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove the glow effect
            this.style.boxShadow = '';
        });
    });
    
    // Add animation to the start button
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        startButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add confirmation dialog when starting assessment
        startButton.addEventListener('click', function(e) {
            const confirmed = confirm('Are you ready to start the assessment? The timer will begin immediately.');
            if (!confirmed) {
                e.preventDefault();
            }
        });
    }
    
    // Add the same animations to the result button if it exists
    const resultButton = document.querySelector('.result-button');
    if (resultButton) {
        resultButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        resultButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
});

/**
 * Format the initial countdown display
 * @param {number} minutes - Duration in minutes
 */
function formatInitialCountdown(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
    
    const countdownElement = document.getElementById('countdownTimer');
    if (countdownElement) {
        if (hours > 0) {
            countdownElement.textContent = `${formattedHours}:${formattedMinutes}:00`;
        } else {
            countdownElement.textContent = `${formattedMinutes}:00`;
        }
    }
}

/**
 * This function would be used when actually starting the assessment
 * to countdown the time remaining
 */
function startAssessmentTimer(durationMinutes) {
    // Calculate end time
    const now = new Date();
    const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000);
    
    // Update countdown
    function updateCountdown() {
        const currentTime = new Date();
        const difference = endTime - currentTime;
        
        // If the assessment time has ended
        if (difference <= 0) {
            document.getElementById('countdownTimer').textContent = "00:00:00";
            // Handle time up scenario (e.g., auto-submit)
            alert("Time's up! Your assessment will be submitted automatically.");
            // Submit the form or redirect to results
            return;
        }
        
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Format the countdown display
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        const countdownElement = document.getElementById('countdownTimer');
        if (countdownElement) {
            if (hours > 0) {
                countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            } else {
                countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
            }
            
            // Add warning class when time is running low
            if (difference < 300000) { // Less than 5 minutes
                countdownElement.classList.add('time-warning');
            }
        }
    }
    
    // Update the countdown immediately and then every second
    updateCountdown();
    return setInterval(updateCountdown, 1000);
}