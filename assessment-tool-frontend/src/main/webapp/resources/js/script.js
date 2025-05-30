document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded');
    
    // Add event listeners if needed
    const refreshButton = document.getElementById('refresh-data');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            window.location.reload();
        });
    }
});