//Buttons redirection
function OnClickButtonClass(className, link) {
    const buttons = document.querySelectorAll(`.${className}`);

    if (document.querySelector("header")) {
        if (!buttons.length) {
            console.log(`No se encontró la clase ${className}`);
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
    console.log(`Redirigiendo a: ${link}`);
    window.location.href = link;
}

// Función para capturar datos del formulario
function CaptureDataForm() {
    const name = document.querySelector("[name='name']")?.value.trim() || "";
    const email = document.querySelector("[name='email']")?.value.trim() || "";
    const phone = document.querySelector("[name='phoneNumber']")?.value.trim() || "";
    const password = document.querySelector("[name='password']")?.value.trim() || "";

    return { name, email, phone, password };
}

// Verificar estado de autenticación cuando la página carga
document.addEventListener("DOMContentLoaded", function() {
    try {
        OnClickButtonClass("redirectToLogIn", "login.html");
        OnClickButtonClass("redirectToIndex", "index.html");
        OnClickButtonClass("redirectToAbout", "about.html");
        OnClickButtonClass("redirectToCreators", "creators.html");
        
        // Inicializar formulario de registro si existe
        initRegisterForm();
        
        // Inicializar formulario de login si existe
        initLoginForm();
        
        // Inicializar formulario de restablecimiento de contraseña si existe
        initPasswordResetForm();
        
        // Configurar botón de cierre de sesión
        setupLogoutButton();
        
        // Verificar estado de autenticación
        checkAuthState();
    } catch (error) {
        console.error("Error al configurar la página:", error);
    }
});

// Inicializar formulario de registro
function initRegisterForm() {
    const form = document.querySelector("#registerForm");
    if (!form) {
        return;
    }

    console.log("Formulario de registro encontrado, inicializando...");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Previniendo el envío del formulario de registro");

        const userData = CaptureDataForm();
        console.log("Datos capturados:", userData);
        
        // Validar formulario
        const confirmEmail = document.querySelector("[name='checkEmail']")?.value.trim();
        const confirmPassword = document.querySelector("[name='checkPassword']")?.value.trim();
        
        // Verificar si los correos coinciden
        if (userData.email !== confirmEmail) {
            showMessage("Los correos electrónicos no coinciden", "error");
            return;
        }
        
        // Verificar si las contraseñas coinciden
        if (userData.password !== confirmPassword) {
            showMessage("Las contraseñas no coinciden", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Registrar usuario con Firebase
        if (window.firebaseAuth) {
            window.firebaseAuth.registerUser(userData.email, userData.password, userData.name, userData.phone)
                .then((user) => {
                    console.log("Registro exitoso:", user);
                    showMessage("¡Registro exitoso! Redirigiendo al inicio de sesión...", "success");
                    
                    // Resetear formulario
                    form.reset();
                    
                    // Redirigir al login después de un breve retraso
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error de registro:", error);
                    let errorMessage = "Registro fallido: ";
                    
                    // Manejar códigos de error específicos de Firebase
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage += "El correo electrónico ya está en uso.";
                            break;
                        case 'auth/invalid-email':
                            errorMessage += "Formato de correo electrónico inválido.";
                            break;
                        case 'auth/weak-password':
                            errorMessage += "La contraseña es demasiado débil.";
                            break;
                        default:
                            errorMessage += error.message;
                    }
                    
                    showMessage(errorMessage, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        } else {
            console.error("Firebase Auth no está disponible");
            showMessage("Error: El sistema de autenticación no está disponible", "error");
            showLoading(false);
        }
    });
    
    // Manejar botón de registro con Google si existe
    const googleBtn = form.querySelector(".social-register-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", function() {
            // Mostrar indicador de carga
            showLoading(true);
            
            // Iniciar sesión con Google
            if (window.firebaseAuth) {
                window.firebaseAuth.signInWithGoogle()
                    .then((user) => {
                        console.log("Inicio de sesión con Google exitoso:", user);
                        showMessage("Inicio de sesión con Google exitoso. Redirigiendo...", "success");
                        
                        // Redirigir al índice después de un breve retraso
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 2000);
                    })
                    .catch((error) => {
                        console.error("Error de inicio de sesión con Google:", error);
                        showMessage("Inicio de sesión con Google fallido: " + error.message, "error");
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            } else {
                console.error("Firebase Auth no está disponible");
                showMessage("Error: El sistema de autenticación no está disponible", "error");
                showLoading(false);
            }
        });
    }
}

// Inicializar formulario de login
function initLoginForm() {
    const form = document.querySelector("#login-form");
    if (!form) {
        return;
    }

    console.log("Formulario de login encontrado, inicializando...");

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Previniendo el envío del formulario de login");

        // Obtener datos del usuario del formulario
        const email = document.querySelector("[name='loginEmail']")?.value.trim();
        const password = document.querySelector("[name='loginPassword']")?.value.trim();
        
        // Validar formulario
        if (!email || !password) {
            showMessage("Por favor ingresa tanto el correo electrónico como la contraseña", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Iniciar sesión de usuario con Firebase
        if (window.firebaseAuth) {
            window.firebaseAuth.loginUser(email, password)
                .then((user) => {
                    console.log("Inicio de sesión exitoso:", user);
                    showMessage("¡Inicio de sesión exitoso! Redirigiendo...", "success");
                    
                    // Resetear formulario
                    form.reset();
                    
                    // Redirigir al índice después de un breve retraso
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error de inicio de sesión:", error);
                    let errorMessage = "Inicio de sesión fallido: ";
                    
                    // Manejar códigos de error específicos de Firebase
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage += "Formato de correo electrónico inválido.";
                            break;
                        case 'auth/user-disabled':
                            errorMessage += "Esta cuenta ha sido deshabilitada.";
                            break;
                        case 'auth/user-not-found':
                            errorMessage += "No se encontró una cuenta con este correo electrónico.";
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
        } else {
            console.error("Firebase Auth no está disponible");
            showMessage("Error: El sistema de autenticación no está disponible", "error");
            showLoading(false);
        }
    });
    
    // Manejar botón de inicio de sesión con Google si existe
    const googleBtn = document.querySelector(".social-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", function() {
            // Mostrar indicador de carga
            showLoading(true);
            
            // Iniciar sesión con Google
            if (window.firebaseAuth) {
                window.firebaseAuth.signInWithGoogle()
                    .then((user) => {
                        console.log("Inicio de sesión con Google exitoso:", user);
                        showMessage("Inicio de sesión con Google exitoso. Redirigiendo...", "success");
                        
                        // Redirigir al índice después de un breve retraso
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 2000);
                    })
                    .catch((error) => {
                        console.error("Error de inicio de sesión con Google:", error);
                        showMessage("Inicio de sesión con Google fallido: " + error.message, "error");
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            } else {
                console.error("Firebase Auth no está disponible");
                showMessage("Error: El sistema de autenticación no está disponible", "error");
                showLoading(false);
            }
        });
    }
    
    // Manejar enlace de restablecimiento de contraseña si existe
    const resetPasswordLink = document.querySelector("a[href='passwordForgotten.html']");
    if (resetPasswordLink) {
        resetPasswordLink.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Solicitar correo electrónico al usuario
            const email = prompt("Por favor ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña:");
            
            if (email) {
                // Mostrar indicador de carga
                showLoading(true);
                
                // Enviar correo electrónico de restablecimiento de contraseña
                if (window.firebaseAuth) {
                    window.firebaseAuth.resetPassword(email)
                        .then(() => {
                            showMessage("Correo electrónico de restablecimiento de contraseña enviado. Por favor revisa tu bandeja de entrada.", "success");
                        })
                        .catch((error) => {
                            console.error("Error de restablecimiento de contraseña:", error);
                            showMessage("Restablecimiento de contraseña fallido: " + error.message, "error");
                        })
                        .finally(() => {
                            showLoading(false);
                        });
                } else {
                    console.error("Firebase Auth no está disponible");
                    showMessage("Error: El sistema de autenticación no está disponible", "error");
                    showLoading(false);
                }
            }
        });
    }
}

// Inicializar formulario de restablecimiento de contraseña
function initPasswordResetForm() {
    const form = document.querySelector("#reset-password-form");
    if (!form) {
        return;
    }

    console.log("Formulario de restablecimiento de contraseña encontrado, inicializando...");
    
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const email = document.querySelector("[name='resetEmail']")?.value.trim();
        
        if (!email) {
            showMessage("Por favor ingresa tu dirección de correo electrónico", "error");
            return;
        }
        
        // Mostrar indicador de carga
        showLoading(true);
        
        // Enviar correo electrónico de restablecimiento de contraseña
        if (window.firebaseAuth) {
            window.firebaseAuth.resetPassword(email)
                .then(() => {
                    showMessage("Correo electrónico de restablecimiento de contraseña enviado exitosamente. Revisa tu bandeja de entrada.", "success");
                    form.reset();
                    
                    // Añadir información adicional para el usuario
                    const formContainer = form.querySelector("p");
                    if (formContainer) {
                        formContainer.innerHTML = "Se ha enviado un enlace de restablecimiento de contraseña a tu dirección de correo electrónico. Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.";
                    }
                })
                .catch((error) => {
                    console.error("Error al enviar correo electrónico de restablecimiento de contraseña:", error);
                    let errorMessage = "Error al enviar correo electrónico de restablecimiento de contraseña: ";
                    
                    // Manejar códigos de error específicos de Firebase
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage += "Formato de dirección de correo electrónico inválido.";
                            break;
                        case 'auth/user-not-found':
                            errorMessage += "No se encontró una cuenta con esta dirección de correo electrónico.";
                            break;
                        default:
                            errorMessage += error.message;
                    }
                    
                    showMessage(errorMessage, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        } else {
            console.error("Firebase Auth no está disponible");
            showMessage("Error: El sistema de autenticación no está disponible", "error");
            showLoading(false);
        }
    });
}

// Configurar botón de cierre de sesión
function setupLogoutButton() {
    const logoutBtn = document.querySelector(".redirectToLogOut");
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Mostrar indicador de carga
            showLoading(true);
            
            // Cerrar sesión de usuario
            if (window.firebaseAuth) {
                window.firebaseAuth.logoutUser()
                    .then(() => {
                        showMessage("Cierre de sesión exitoso", "success");
                        
                        // Redirigir a la página de índice después del cierre de sesión
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 1000);
                    })
                    .catch(error => {
                        console.error("Error durante el cierre de sesión:", error);
                        showMessage("Error durante el cierre de sesión: " + error.message, "error");
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            } else {
                console.error("Firebase Auth no está disponible");
                showMessage("Error: El sistema de autenticación no está disponible", "error");
                showLoading(false);
            }
        });
    }
}

// Verificar estado de autenticación inicial
function checkAuthState() {
    if (window.firebaseAuth) {
        window.firebaseAuth.getCurrentUser()
            .then(user => {
                if (user) {
                    console.log("El usuario ya ha iniciado sesión:", user);
                    handleAuthStateChange(user);
                } else {
                    console.log("Ningún usuario ha iniciado sesión");
                    handleAuthStateChange(null);
                }
            })
            .catch(error => {
                console.error("Error al verificar el estado de autenticación:", error);
            });
    } else {
        console.warn("Firebase Auth no está disponible para verificar el estado de autenticación");
    }
}

// Manejar cambios en el estado de autenticación
function handleAuthStateChange(user) {
    const logoutBtn = document.querySelector(".redirectToLogOut");
    const loginBtn = document.querySelector(".redirectToLogIn");
    const registerBtn = document.querySelector(".edirrectToLogOut");
    
    if (user) {
        // El usuario ha iniciado sesión
        console.log("El usuario ha iniciado sesión:", user);
        
        // Mostrar botón de cierre de sesión, ocultar botón de inicio de sesión y registro
        if (logoutBtn) logoutBtn.classList.remove("hidden");
        if (loginBtn) loginBtn.classList.add("hidden");
        if (registerBtn) registerBtn.classList.add("hidden");
        
        // Actualizar UI con información del usuario si es necesario
        updateUIForAuthenticatedUser(user);
    } else {
        // El usuario ha cerrado sesión
        console.log("El usuario ha cerrado sesión");
        
        // Mostrar botón de inicio de sesión y registro, ocultar botón de cierre de sesión
        if (logoutBtn) logoutBtn.classList.add("hidden");
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (registerBtn) registerBtn.classList.remove("hidden");
        
        // Actualizar UI para estado de cierre de sesión
        updateUIForUnauthenticatedUser();
    }
}

// Actualizar UI para usuario autenticado
function updateUIForAuthenticatedUser(user) {
    // Añadir información del usuario a la barra de navegación si es posible
    const navList = document.querySelector(".nav-list");
    
    if (navList) {
        // Verificar si el elemento de información del usuario ya existe
        if (!document.querySelector(".user-info")) {
            // Crear elemento de información del usuario
            const userInfoLi = document.createElement("li");
            userInfoLi.className = "user-info";
            
            // Crear nombre de visualización de usuario con icono
            userInfoLi.innerHTML = `
                <span class="user-display">
                    <span class="auth-status-indicator logged-in"></span>
                    ${user.displayName || user.email || "Usuario"}
                </span>
            `;
            
            // Insertar antes del botón de cierre de sesión si existe
            const logoutLi = document.querySelector(".redirectToLogOut").closest("li");
            if (logoutLi) {
                navList.insertBefore(userInfoLi, logoutLi);
            } else {
                navList.appendChild(userInfoLi);
            }
        }
    }
    
    // Personalizar páginas basadas en autenticación
    const currentPath = window.location.pathname;
    
    // Si en la página de inicio de sesión o registro, redirigir a índice
    if (currentPath.includes("login.html") || currentPath.includes("register.html")) {
        window.location.href = "index.html";
    }
}

// Actualizar UI para usuario no autenticado
function updateUIForUnauthenticatedUser() {
    // Eliminar información del usuario de la barra de navegación si existe
    const userInfo = document.querySelector(".user-info");
    if (userInfo) {
        userInfo.remove();
    }
    
    // Para páginas que requieren autenticación, redirigir a inicio de sesión
    const currentPath = window.location.pathname;
    
    // Añadir rutas que requieren autenticación aquí
    const protectedPaths = [
        // Ejemplo: "profile.html", "dashboard.html", etc.
    ];
    
    // Verificar si la ruta actual requiere autenticación
    const requiresAuth = protectedPaths.some(path => currentPath.includes(path));
    if (requiresAuth) {
        window.location.href = "login.html";
    }
}

// Función auxiliar para mostrar mensajes al usuario
function showMessage(message, type) {
    // Verificar si el contenedor de mensajes existe, crear si no
    let messageContainer = document.querySelector(".message-container");
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        
        // Intentar insertar antes del formulario si existe, de lo contrario añadir al cuerpo
        const form = document.querySelector("form");
        if (form) {
            form.insertAdjacentElement("beforebegin", messageContainer);
        } else {
            document.body.appendChild(messageContainer);
        }
    }
    
    // Crear elemento de mensaje
    const messageElement = document.createElement("div");
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Limpiar mensajes anteriores
    messageContainer.innerHTML = "";
    
    // Añadir nuevo mensaje
    messageContainer.appendChild(messageElement);
    
    // Eliminar mensaje después de un retraso
    setTimeout(() => {
        messageElement.remove();
        
        // Eliminar contenedor si está vacío
        if (messageContainer.children.length === 0) {
            messageContainer.remove();
        }
    }, 5000);
}

// Función auxiliar para mostrar/ocultar indicador de carga
function showLoading(isLoading) {
    // Verificar si el contenedor de carga existe, crear si no
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