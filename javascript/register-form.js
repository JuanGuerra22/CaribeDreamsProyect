// Updated register form handler - add this to your javascript.js file or create a new one

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registerForm");
    if (!form) {
        console.error("Registration form not found.");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Form submission prevented for Firebase registration");

        // Get user data from form
        const userData = CaptureDataForm();
        
        // Validate form
        const confirmEmail = document.querySelector("[name='checkEmail']").value.trim();
        const confirmPassword = document.querySelector("[name='checkPassword']").value.trim();
        
        // Check if emails match
        if (userData.email !== confirmEmail) {
            showMessage("Emails do not match", "error");
            return;
        }
        
        // Check if passwords match
        if (userData.password !== confirmPassword) {
            showMessage("Passwords do not match", "error");
            return;
        }
        
        // Show loading indicator
        showLoading(true);
        
        // Register user with Firebase
        window.firebaseAuth.registerUser(userData.email, userData.password, userData.name, userData.phone)
            .then((user) => {
                console.log("Registration successful:", user);
                showMessage("Registration successful! Redirecting to login...", "success");
                
                // Reset form
                form.reset();
                
                // Redirect to login after a brief delay
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            })
            .catch((error) => {
                console.error("Registration error:", error);
                let errorMessage = "Registration failed: ";
                
                // Handle specific Firebase error codes
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += "Email already in use.";
                        break;
                    case 'auth/invalid-email':
                        errorMessage += "Invalid email format.";
                        break;
                    case 'auth/weak-password':
                        errorMessage += "Password is too weak.";
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
});

// Helper function to show messages to the user
function showMessage(message, type) {
    // Check if message container exists, create if not
    let messageContainer = document.querySelector(".message-container");
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.querySelector("#registerForm").insertAdjacentElement("beforebegin", messageContainer);
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