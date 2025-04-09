// Enterprise registration form handler
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registerForm");
    if (!form) {
        console.error("Enterprise registration form not found.");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Processing enterprise registration");

        // Get form data
        const userData = captureEnterpriseData();
        
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
        
        // Register enterprise with Firebase
        window.firebaseAuth.registerEnterprise(userData.email, userData.password, userData)
            .then((user) => {
                console.log("Enterprise registration successful:", user);
                showMessage("Registration successful! Redirecting to dashboard...", "success");
                
                // Reset form
                form.reset();
                
                // Redirect directly to enterprise dashboard after a brief delay
                setTimeout(() => {
                    window.location.href = "enterprise-dashboard.html";
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
});

// Capture enterprise data from form
function captureEnterpriseData() {
    const ownerName = document.querySelector("[name='name']").value.trim();
    const businessName = document.querySelector("[name='businessName']").value.trim();
    const email = document.querySelector("[name='email']").value.trim();
    const ownerPhone = document.querySelector("[name='phoneNumber']").value.trim();
    const businessPhone = document.querySelector("[name='businessPhone']").value.trim();
    const nit = document.querySelector("[name='nit']").value.trim();
    const password = document.querySelector("[name='password']").value.trim();

    // Log the captured data to verify
    console.log("Enterprise registration data:", {
        ownerName, businessName, email, ownerPhone, businessPhone, nit
    });

    return { 
        ownerName, 
        businessName, 
        email, 
        ownerPhone, 
        businessPhone, 
        nit, 
        password 
    };
}

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