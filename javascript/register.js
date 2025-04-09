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
        showAlert("Error: El sistema de autenticación no está disponible", "error");
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
            showAlert("Por favor, completa todos los campos", "error");
            return;
        }
        
        if (email !== confirmEmail) {
            showAlert("Los correos electrónicos no coinciden", "error");
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert("Las contraseñas no coinciden", "error");
            return;
        }
        
        if (password.length < 6) {
            showAlert("La contraseña debe tener al menos 6 caracteres", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Registrar usuario con Firebase
        window.firebaseAuth.registerUser(email, password, name, phone)
            .then(user => {
                console.log("Registro exitoso:", user);
                
                // Mostrar mensaje de éxito con estilo
                showAlert("¡Registro exitoso! Redirigiendo al inicio de sesión...", "success");
                
                // Limpiar formulario
                registerForm.reset();
                
                // Redirigir a la página de inicio de sesión después de un delay para que el usuario vea el mensaje
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
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
                
                showAlert(errorMessage, "error");
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
                    showAlert("¡Inicio de sesión con Google exitoso! Redirigiendo...", "success");
                    
                    // Redirigir a la página principal después de un delay
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 3000);
                })
                .catch(error => {
                    console.error("Error al iniciar sesión con Google:", error);
                    showAlert("Error al iniciar sesión con Google: " + error.message, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        });
    }
});

// Función para mostrar alertas estéticas
function showAlert(message, type) {
    // Crear el contenedor de alertas si no existe
    let alertContainer = document.querySelector(".alert-container");
    if (!alertContainer) {
        alertContainer = document.createElement("div");
        alertContainer.className = "alert-container";
        document.body.appendChild(alertContainer);
    }
    
    // Crear la alerta
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    
    // Definir el icono según el tipo de alerta
    let icon;
    switch (type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✗';
            break;
        case 'warning':
            icon = '⚠';
            break;
        case 'info':
            icon = 'ℹ';
            break;
        default:
            icon = 'ℹ';
    }
    
    // Crear la estructura interna de la alerta
    alert.innerHTML = `
        <span class="alert-icon">${icon}</span>
        <div class="alert-content">${message}</div>
        <button class="alert-close">&times;</button>
    `;
    
    // Añadir evento al botón de cerrar
    const closeButton = alert.querySelector(".alert-close");
    closeButton.addEventListener("click", function() {
        alert.classList.add("fade-out");
        setTimeout(() => {
            alert.remove();
            
            // Eliminar el contenedor si está vacío
            if (alertContainer.children.length === 0) {
                alertContainer.remove();
            }
        }, 500);
    });
    
    // Añadir alerta al contenedor
    alertContainer.appendChild(alert);
    
    // Eliminar automáticamente después de un tiempo (solo para tipo success)
    if (type === 'success') {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.classList.add("fade-out");
                setTimeout(() => {
                    if (alert && alert.parentNode) {
                        alert.remove();
                        
                        // Eliminar el contenedor si está vacío
                        if (alertContainer.children.length === 0) {
                            alertContainer.remove();
                        }
                    }
                }, 500);
            }
        }, 5000); // 5 segundos antes de desaparecer
    }
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