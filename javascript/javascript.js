//Buttons redirection
function OnClickButtonClass(className, link) {
    const buttons = document.querySelectorAll(`.${className}`);

    if (document.querySelector("header")) {
        if (!buttons.length) {
            console.log(`No class ${className} was found`);
            return;
        }
        else {
            buttons.forEach((button) => {
                button.addEventListener("click", function () {
                    RedirectTo(link);
                });
            });
        }
    }

}

function RedirectTo(link) {
    console.log(`Redirecting to: ${link}`);
    window.location.href = link;
}

try {
    OnClickButtonClass("redirectToLogIn", "login.html");
    OnClickButtonClass("redirectToIndex", "index.html");
    OnClickButtonClass("redirectToAbout", "about.html");
    OnClickButtonClass("redirectToCreators", "creators.html")
} catch {
    console.error("Error setting up button that redirects", error);
}



        document.addEventListener("DOMContentLoaded", function() {
            const form = document.querySelector("#reset-password-form");
            
            if (form) {
                form.addEventListener("submit", function(e) {
                    e.preventDefault();
                    
                    const email = document.querySelector("[name='resetEmail']").value.trim();
                    
                    if (!email) {
                        showMessage("Please enter your email address", "error");
                        return;
                    }
                    
                    // Show loading indicator
                    showLoading(true);
                    
                    // Send password reset email
                    window.firebaseAuth.resetPassword(email)
                        .then(() => {
                            showMessage("Password reset email sent successfully! Check your inbox.", "success");
                            form.reset();
                            
                            // Add extra info for user
                            const formContainer = form.querySelector("p");
                            formContainer.innerHTML = "A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.";
                        })
                        .catch((error) => {
                            console.error("Error sending password reset email:", error);
                            let errorMessage = "Failed to send password reset email: ";
                            
                            // Handle specific Firebase error codes
                            switch (error.code) {
                                case 'auth/invalid-email':
                                    errorMessage += "Invalid email address format.";
                                    break;
                                case 'auth/user-not-found':
                                    errorMessage += "No account found with this email address.";
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
            }
        });

