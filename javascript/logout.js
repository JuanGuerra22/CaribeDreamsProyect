// Authentication State Management - Add to a new file auth-state.js or add to your existing javascript.js file

document.addEventListener("DOMContentLoaded", function() {
    // Check authentication state on page load
    checkAuthState();
    
    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(handleAuthStateChange);
    
    // Set up logout button listener
    setupLogoutButton();
});

// Handle authentication state changes
function handleAuthStateChange(user) {
    const logoutBtn = document.querySelector(".redirectToLogOut");
    const loginBtn = document.querySelector(".redirectToLogIn");
    
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        
        // Show logout button, hide login button
        if (logoutBtn) logoutBtn.style.display = "block";
        if (loginBtn) loginBtn.style.display = "none";
        
        // Update UI with user info if needed
        updateUIForAuthenticatedUser(user);
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // Show login button, hide logout button
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "block";
        
        // Update UI for signed out state
        updateUIForUnauthenticatedUser();
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser(user) {
    // Add user info to navbar if possible
    const navList = document.querySelector(".nav-list");
    
    if (navList) {
        // Check if user info element already exists
        if (!document.querySelector(".user-info")) {
            // Create user info element
            const userInfoLi = document.createElement("li");
            userInfoLi.className = "user-info";
            
            // Create user display name with icon
            userInfoLi.innerHTML = `
                <span class="user-display">
                    <span class="auth-status-indicator logged-in"></span>
                    ${user.displayName || user.email || "User"}
                </span>
            `;
            
            // Insert before logout button if it exists
            const logoutLi = document.querySelector(".redirectToLogOut").closest("li");
            if (logoutLi) {
                navList.insertBefore(userInfoLi, logoutLi);
            } else {
                navList.appendChild(userInfoLi);
            }
        }
    }
    
    // Customize pages based on authentication
    const currentPath = window.location.pathname;
    
    // If on login or register page, redirect to index
    if (currentPath.includes("login.html") || currentPath.includes("register.html")) {
        window.location.href = "index.html";
    }
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    // Remove user info from navbar if it exists
    const userInfo = document.querySelector(".user-info");
    if (userInfo) {
        userInfo.remove();
    }
    
    // For pages that require authentication, redirect to login
    const currentPath = window.location.pathname;
    
    // Add paths that require authentication here
    const protectedPaths = [
        // Example: "profile.html", "dashboard.html", etc.
    ];
    
    // Check if current path requires authentication
    const requiresAuth = protectedPaths.some(path => currentPath.includes(path));
    if (requiresAuth) {
        window.location.href = "login.html";
    }
}

// Check initial authentication state
function checkAuthState() {
    window.firebaseAuth.getCurrentUser()
        .then(user => {
            if (user) {
                console.log("User is already signed in:", user);
                handleAuthStateChange(user);
            } else {
                console.log("No user is signed in");
                handleAuthStateChange(null);
            }
        })
        .catch(error => {
            console.error("Error checking auth state:", error);
        });
}

// Set up logout button functionality
function setupLogoutButton() {
    const logoutBtn = document.querySelector(".redirectToLogOut");
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Show loading indicator
            showLoading(true);
            
            // Logout user
            window.firebaseAuth.logoutUser()
                .then(() => {
                    showMessage("Logged out successfully", "success");
                    
                    // Redirect to index page after logout
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000);
                })
                .catch(error => {
                    console.error("Error during logout:", error);
                    showMessage("Error during logout: " + error.message, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        });
    }
}

// Helper function to show messages to the user (if not already defined)
function showMessage(message, type) {
    // Check if message container exists, create if not
    let messageContainer = document.querySelector(".message-container");
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.body.appendChild(messageContainer);
    }
    
    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add new message
    messageContainer.appendChild(messageElement);
    
    // Remove message after a delay
    setTimeout(() => {
        messageElement.remove();
        
        // Remove container if empty
        if (messageContainer.children.length === 0) {
            messageContainer.remove();
        }
    }, 5000);
}

// Helper function to show/hide loading indicator (if not already defined)
function showLoading(isLoading) {
    // Check if loading container exists, create if not
    let loadingContainer = document.querySelector(".loading-container");
    if (!loadingContainer && isLoading) {
        loadingContainer = document.createElement("div");
        loadingContainer.className = "loading-container";
        loadingContainer.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingContainer);
    } else if (loadingContainer && !isLoading) {
        loadingContainer.remove();
    }
}