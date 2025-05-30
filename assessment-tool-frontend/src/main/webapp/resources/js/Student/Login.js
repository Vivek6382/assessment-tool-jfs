/**
 * Creates floating shapes in the login banner background
 */
function createFloatingShapes() {
    const container = document.getElementById("shapes-container");
    for (let i = 0; i < 15; i++) {
        let shape = document.createElement("div");
        shape.classList.add("shape");
        let size = Math.random() * 10 + 5;
        shape.style.width = size + "px";
        shape.style.height = size + "px";
        shape.style.left = Math.random() * 100 + "%";
        shape.style.animationDuration = Math.random() * 3 + 3 + "s";
        shape.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(shape);
    }
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    createFloatingShapes();
    
    // Additional login functionality can be added here
    console.log("Login page loaded successfully");
});