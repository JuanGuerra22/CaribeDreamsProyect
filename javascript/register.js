// Script específico para la página de registro

document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando página de registro...");
    
    // Verificar que el formulario exista
    const registerForm = document.querySelector("#registerForm");
    if (!registerForm) {
        console.error("No se encontró el formulario de registro en esta página");
        return;
    }
    
    // Verificar que Firebase Auth esté disponible
    if (!window.firebaseAuth) {
        console.error("Firebase Auth no está disponible. Verifica que firebase-auth.js esté cargado correctamente.");
        showMessage("Error: El sistema de autenticación no está disponible", "error");
        return;
    }
    
    // Manejar envío del formulario de registro
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Procesando formulario de registro...");
        
        // Obtener y validar datos
        const name = document.querySelector("[name='name']").value.trim();
        const email = document.querySelector("[name='email']").value.trim();
        const confirmEmail = document.querySelector("[name='checkEmail']").value.trim();
        const phone = document.querySelector("[name='phoneNumber']").value.trim();
        const password = document.querySelector("[name='password']").value.trim();
        const confirmPassword = document.querySelector("[name='checkPassword']").value.trim();
        
        // Validaciones básicas
        if (!name || !email || !phone || !password || !confirmEmail || !confirmPassword) {
            showMessage("Por favor, completa todos los campos", "error");
            return;
        }
        
        if (email !== confirmEmail) {
            showMessage("Los correos electrónicos no coinciden", "error");
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage("Las contraseñas no coinciden", "error");
            return;
        }
        
        if (password.length < 6) {
            showMessage("La contraseña debe tener al menos 6 caracteres", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Registrar usuario con Firebase
        window.firebaseAuth.registerUser(email, password, name, phone)
            .then(user => {
                console.log("Registro exitoso:", user);
                showMessage("¡Registro exitoso! Redirigiendo al inicio de sesión...", "success");
                
                // Limpiar formulario
                registerForm.reset();
                
                // Redirigir a la página de inicio de sesión
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            })
            .catch(error => {
                console.error("Error al registrar usuario:", error);
                
                let errorMessage = "Error de registro: ";
                
                // Manejar códigos de error específicos
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += "Este correo electrónico ya está registrado";
                        break;
                    case 'auth/invalid-email':
                        errorMessage += "El formato del correo electrónico no es válido";
                        break;
                    case 'auth/weak-password':
                        errorMessage += "La contraseña es demasiado débil";
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
    
    // Configurar botón de registro con Google
    const googleButton = document.querySelector(".social-register-btn");
    if (googleButton) {
        googleButton.addEventListener("click", function() {
            console.log("Iniciando registro con Google...");
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
});

// Función para mostrar mensajes al usuario
function showMessage(message, type) {
    let messageContainer = document.querySelector(".message-container");
    
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.getElementById("register-card").insertAdjacentElement("beforebegin", messageContainer);
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