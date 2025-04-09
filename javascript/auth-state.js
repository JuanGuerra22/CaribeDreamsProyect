// Authentication State Management for both regular users and enterprise accounts

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
    const registerBtn = document.querySelector(".redirectToRegister");
    
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        
        // Show logout button, hide login button and register button
        if (logoutBtn) logoutBtn.classList.remove("hidden");
        if (loginBtn) loginBtn.classList.add("hidden");
        if (registerBtn) registerBtn.classList.add("hidden");
        
        // Check if user is enterprise or regular user and update UI accordingly
        checkUserType(user);
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // Show login button and register button, hide logout button
        if (logoutBtn) logoutBtn.classList.add("hidden");
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (registerBtn) registerBtn.classList.remove("hidden");
        
        // Remove user info from navbar if it exists
        const userInfo = document.querySelector(".user-info");
        if (userInfo) {
            userInfo.remove();
        }
    }
}

// Check if user is enterprise or regular user
function checkUserType(user) {
    // First check if user is in enterprises collection
    firebase.firestore().collection('enterprises').doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                // This is an enterprise user
                updateUIForEnterpriseUser(user, doc.data());
            } else {
                // Not an enterprise user, check regular users collection
                firebase.firestore().collection('users').doc(user.uid).get()
                    .then((userDoc) => {
                        if (userDoc.exists) {
                            // This is a regular user
                            updateUIForRegularUser(user, userDoc.data());
                        } else {
                            // User exists in auth but not in collections
                            // Just use basic auth info
                            updateUIForRegularUser(user, { name: user.displayName || user.email });
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking user document:", error);
                    });
            }
        })
        .catch((error) => {
            console.error("Error checking enterprise document:", error);
        });
}

// Update UI for enterprise user
function updateUIForEnterpriseUser(user, enterpriseData) {
    const navList = document.querySelector(".nav-list");
    
    if (navList) {
        // Remove existing user info if any
        const existingUserInfo = document.querySelector(".user-info");
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        
        // Create user info element for enterprise
        const userInfoLi = document.createElement("li");
        userInfoLi.className = "user-info enterprise-user";
        
        // Create user display with admin label
        userInfoLi.innerHTML = `
            <span class="user-display">
                <span class="auth-status-indicator admin-status"></span>
                Admin: ${enterpriseData.businessName || "Enterprise"}
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
    
    // Update UI for enterprise-specific features
    const enterpriseElements = document.querySelectorAll(".enterprise-only");
    enterpriseElements.forEach(el => {
        el.classList.remove("hidden");
    });
}

// Update UI for regular user
function updateUIForRegularUser(user, userData) {
    const navList = document.querySelector(".nav-list");
    
    if (navList) {
        // Remove existing user info if any
        const existingUserInfo = document.querySelector(".user-info");
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        
        // Create user info element for regular user
        const userInfoLi = document.createElement("li");
        userInfoLi.className = "user-info regular-user";
        
        // Create user display name with icon
        userInfoLi.innerHTML = `
            <span class="user-display">
                <span class="auth-status-indicator logged-in"></span>
                ${userData.name || user.displayName || user.email || "User"}
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
    
    // Hide enterprise-specific features
    const enterpriseElements = document.querySelectorAll(".enterprise-only");
    enterpriseElements.forEach(el => {
        el.classList.add("hidden");
    });
}

// Check initial authentication state
function checkAuthState() {
    // Check immediately if the current user is already known
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        handleAuthStateChange(currentUser);
    }
    
    // Also set up listener for auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        handleAuthStateChange(user);
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
            firebase.auth().signOut()
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

// Helper function to show messages to the user
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

// Helper function to show/hide loading indicator
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