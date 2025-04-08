// Script específico para la página de inicio de sesión

document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando página de inicio de sesión...");
    
    // Verificar que el formulario exista
    const loginForm = document.querySelector("#login-form");
    if (!loginForm) {
        console.error("No se encontró el formulario de inicio de sesión en esta página");
        return;
    }
    
    // Verificar que Firebase Auth esté disponible
    if (!window.firebaseAuth) {
        console.error("Firebase Auth no está disponible. Verifica que firebase-auth.js esté cargado correctamente.");
        showMessage("Error: El sistema de autenticación no está disponible", "error");
        return;
    }
    
    // Manejar envío del formulario de inicio de sesión
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Procesando formulario de inicio de sesión...");
        
        // Obtener y validar datos
        const email = document.querySelector("[name='loginEmail']").value.trim();
        const password = document.querySelector("[name='loginPassword']").value.trim();
        
        // Validaciones básicas
        if (!email || !password) {
            showMessage("Por favor, completa todos los campos", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Iniciar sesión con Firebase
        window.firebaseAuth.loginUser(email, password)
            .then(user => {
                console.log("Inicio de sesión exitoso:", user);
                showMessage("¡Inicio de sesión exitoso! Redirigiendo...", "success");
                
                // Limpiar formulario
                loginForm.reset();
                
                // Redirigir a la página principal
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch(error => {
                console.error("Error al iniciar sesión:", error);
                
                let errorMessage = "Error de inicio de sesión: ";
                
                // Manejar códigos de error específicos
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage += "No existe una cuenta con este correo electrónico";
                        break;
                    case 'auth/wrong-password':
                        errorMessage += "Contraseña incorrecta";
                        break;
                    case 'auth/invalid-email':
                        errorMessage += "El formato del correo electrónico no es válido";
                        break;
                    case 'auth/user-disabled':
                        errorMessage += "Esta cuenta ha sido deshabilitada";
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
    
    // Configurar botón de inicio de sesión con Google
    const googleButton = document.querySelector(".social-btn");
    if (googleButton) {
        googleButton.addEventListener("click", function() {
            console.log("Iniciando sesión con Google...");
            showLoading(true);
            
            window.firebaseAuth.signInWithGoogle()
                .then(user => {
                    console.log("Inicio de sesión con Google exitoso:", user);
                    showMessage("¡Inicio de sesión con Google exitoso! Redirigiendo...", "success");
                    
                    // Redirigir a la página principal
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                })
                .catch(error => {
                    console.error("Error al iniciar sesión con Google:", error);
                    showMessage("Error al iniciar sesión con Google: " + error.message, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        });
    }
    
    // Configurar enlace para olvidar contraseña
    const forgotPasswordLink = document.querySelector(".forgot-password a");
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Mostrar un prompt para que el usuario ingrese su correo
            const email = prompt("Por favor, ingresa tu correo electrónico para restablecer tu contraseña:");
            
            if (!email) {
                return; // El usuario canceló
            }
            
            showLoading(true);
            
            window.firebaseAuth.resetPassword(email)
                .then(() => {
                    showMessage("Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.", "success");
                })
                .catch(error => {
                    console.error("Error al enviar correo de restablecimiento:", error);
                    
                    let errorMessage = "Error al enviar correo de restablecimiento: ";
                    
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage += "El formato del correo electrónico no es válido";
                            break;
                        case 'auth/user-not-found':
                            errorMessage += "No existe una cuenta con este correo electrónico";
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

// Función para mostrar mensajes al usuario
function showMessage(message, type) {
    let messageContainer = document.querySelector(".message-container");
    
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.querySelector(".login-card").insertAdjacentElement("beforebegin", messageContainer);
    }
    
    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Limpiar mensajes previos
    messageContainer.innerHTML = "";
    messageContainer.appendChild(messageElement);
    
    // Eliminar mensaje después de un tiempo
    setTimeout(() => {
        messageElement.remove();
        if (messageContainer.children.length === 0) {
            messageContainer.remove();
        }
    }, 5000);
}

// Función para mostrar/ocultar indicador de carga
function showLoading(isLoading) {
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