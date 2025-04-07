// Updated login form handler - add this to your javascript.js file or create a new one

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#login-form");
    if (!form) {
        console.error("Login form not found.");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Form submission prevented for Firebase login");

        // Get user data from form
        const email = document.querySelector("[name='loginEmail']").value.trim();
        const password = document.querySelector("[name='loginPassword']").value.trim();
        
        // Validate form
        if (!email || !password) {
            showMessage("Please enter both email and password", "error");
            return;
        }
        
        // Show loading indicator
        showLoading(true);
        
        // Login user with Firebase
        window.firebaseAuth.loginUser(email, password)
            .then((user) => {
                console.log("Login successful:", user);
                showMessage("Login successful! Redirecting...", "success");
                
                // Reset form
                form.reset();
                
                // Redirect to index after a brief delay
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch((error) => {
                console.error("Login error:", error);
                let errorMessage = "Login failed: ";
                
                // Handle specific Firebase error codes
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage += "Invalid email format.";
                        break;
                    case 'auth/user-disabled':
                        errorMessage += "This account has been disabled.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage += "No account found with this email.";
                        break;
                    case 'auth/wrong-password':
                        errorMessage += "Incorrect password.";
                        break;
                    default:
                        errorMessage += error.message;
                }
                
                showMessage(errorMessage, "error");
            })
            .finally(() => {
                showLoading(false);
            });
    });
    
    // Handle Google sign in button if it exists
    const googleBtn = document.querySelector(".btn-google");
    if (googleBtn) {
        googleBtn.addEventListener("click", function() {
            // Show loading indicator
            showLoading(true);
            
            // Sign in with Google
            window.firebaseAuth.signInWithGoogle()
                .then((user) => {
                    console.log("Google sign-in successful:", user);
                    showMessage("Google sign-in successful! Redirecting...", "success");
                    
                    // Redirect to index after a brief delay
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Google sign-in error:", error);
                    showMessage("Google sign-in failed: " + error.message, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        });
    }
    
    // Handle password reset link if it exists
    const resetPasswordLink = document.querySelector("a[href='passwordForgotten.html']");
    if (resetPasswordLink) {
        resetPasswordLink.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Prompt user for email
            const email = prompt("Please enter your email to receive a password reset link:");
            
            if (email) {
                // Show loading indicator
                showLoading(true);
                
                // Send password reset email
                window.firebaseAuth.resetPassword(email)
                    .then(() => {
                        showMessage("Password reset email sent. Please check your inbox.", "success");
                    })
                    .catch((error) => {
                        console.error("Password reset error:", error);
                        showMessage("Password reset failed: " + error.message, "error");
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            }
        });
    }
});

// Helper function to show messages to the user
function showMessage(message, type) {
    // Check if message container exists, create if not
    let messageContainer = document.querySelector(".message-container");
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.querySelector("#login-form").insertAdjacentElement("beforebegin", messageContainer);
    }
    
    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Clear previous messages
    messageContainer.innerHTML = "";
    
    // Add new message
    messageContainer.appendChild(messageElement);
    
    // Remove message after a delay
    setTimeout(() => {
        messageElement.remove();
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