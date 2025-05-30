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

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Submit form programmatically to maintain Spring MVC flow
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Educator/Login';
        
        const usernameInput = document.createElement('input');
        usernameInput.type = 'hidden';
        usernameInput.name = 'username';
        usernameInput.value = username;
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'hidden';
        passwordInput.name = 'password';
        passwordInput.value = password;
        
        form.appendChild(usernameInput);
        form.appendChild(passwordInput);
        document.body.appendChild(form);
        form.submit();
        
        // Store username in sessionStorage if remember me is checked
        if (rememberMe) {
            sessionStorage.setItem('username', username);
        }
		
		sessionStorage.setItem('user',username);
    });
    
    // Load remembered username if exists
    const rememberedUser = sessionStorage.getItem('username');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});