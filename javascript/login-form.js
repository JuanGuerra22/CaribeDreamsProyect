// Manejador del formulario de inicio de sesión
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;
    
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const email = document.querySelector("[name='loginEmail']").value.trim();
        const password = document.querySelector("[name='loginPassword']").value.trim();
        
        // Validar formulario
        if (!email || !password) {
            showMessage("Por favor ingrese email y contraseña", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Iniciar sesión con Firebase
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Inicio de sesión exitoso:", user);
                
                // Actualizar UI inmediatamente
                updateAuthUI(user);
                
                showMessage("Inicio de sesión exitoso! Redirigiendo...", "success");
                
                // Esperar un momento y luego redirigir
                setTimeout(() => {
                    // Verificar si es usuario empresa o regular para redirigir
                    checkUserTypeAndRedirect(user);
                }, 1500);
            })
            .catch((error) => {
                console.error("Error de inicio de sesión:", error);
                
                let errorMessage = "Error al iniciar sesión: ";
                
                // Manejar códigos de error específicos
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage += "Formato de email inválido.";
                        break;
                    case 'auth/user-disabled':
                        errorMessage += "Esta cuenta ha sido deshabilitada.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage += "No existe cuenta con este email.";
                        break;
                    case 'auth/wrong-password':
                        errorMessage += "Contraseña incorrecta.";
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
    
    // Botón de inicio de sesión con Google
    const googleBtn = document.querySelector(".social-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", function() {
            // Mostrar indicador de carga
            showLoading(true);
            
            // Proveedor de autenticación Google
            const provider = new firebase.auth.GoogleAuthProvider();
            
            // Iniciar sesión con Google
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    const isNewUser = result.additionalUserInfo.isNewUser;
                    
                    console.log("Inicio de sesión con Google exitoso:", user);
                    
                    // Actualizar UI inmediatamente
                    updateAuthUI(user);
                    
                    // Si es un nuevo usuario, guardar datos adicionales
                    if (isNewUser) {
                        return firebase.firestore().collection('users').doc(user.uid).set({
                            name: user.displayName || '',
                            email: user.email,
                            photoURL: user.photoURL || '',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            showMessage("Cuenta creada con Google exitosamente! Redirigiendo...", "success");
                            return user;
                        });
                    } else {
                        showMessage("Inicio de sesión con Google exitoso! Redirigiendo...", "success");
                        return user;
                    }
                })
                .then((user) => {
                    // Esperar un momento y luego redirigir
                    setTimeout(() => {
                        // Verificar si es usuario empresa o regular para redirigir
                        checkUserTypeAndRedirect(user);
                    }, 1500);
                })
                .catch((error) => {
                    console.error("Error de inicio de sesión con Google:", error);
                    showMessage("Error al iniciar sesión con Google: " + error.message, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        });
    }
});

// Actualizar UI con estado de autenticación
function updateAuthUI(user) {
    if (!user) return;
    
    // Actualizar elementos del navbar
    const logoutBtn = document.querySelector(".redirectToLogOut");
    const loginBtn = document.querySelector(".redirectToLogIn");
    const registerBtn = document.querySelector(".redirectToRegister");
    
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (loginBtn) loginBtn.classList.add("hidden");
    if (registerBtn) registerBtn.classList.add("hidden");
}

// Verificar tipo de usuario y redirigir a la página correspondiente
function checkUserTypeAndRedirect(user) {
    if (!user) return;
    
    // Verificar si es un usuario empresa
    firebase.firestore().collection('enterprises').doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                // Es un usuario empresa, redirigir directamente al dashboard
                window.location.href = "enterprise-dashboard.html";
            } else {
                // Es un usuario regular, redirigir al index
                window.location.href = "index.html";
            }
        })
        .catch((error) => {
            console.error("Error al verificar tipo de usuario:", error);
            // En caso de error, redirigir al index
            window.location.href = "index.html";
        });
}

// Mostrar mensajes al usuario
function showMessage(message, type) {
    // Verificar si existe el contenedor de mensajes, crear si no
    let messageContainer = document.querySelector(".message-container");
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.querySelector("#login-form").insertAdjacentElement("beforebegin", messageContainer);
    }
    
    // Crear elemento de mensaje
    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Limpiar mensajes anteriores
    messageContainer.innerHTML = "";
    
    // Agregar nuevo mensaje
    messageContainer.appendChild(messageElement);
    
    // Eliminar mensaje después de un tiempo
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Mostrar/ocultar indicador de carga
function showLoading(isLoading) {
    // Verificar si existe el contenedor de carga, crear si no
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