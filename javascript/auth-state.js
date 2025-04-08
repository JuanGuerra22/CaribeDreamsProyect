// Script para gestionar el estado de autenticación en todas las páginas

document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando gestión de estado de autenticación...");
    
    // Verificar que Firebase esté disponible
    if (!firebase || !firebase.auth || !window.firebaseAuth) {
        console.error("Firebase o firebaseAuth no están disponibles. Verifica que los scripts estén cargados correctamente.");
        return;
    }
    
    // Configurar observador de cambios de estado de autenticación
    firebase.auth().onAuthStateChanged(handleAuthStateChange);
    
    // Verificar estado inicial de autenticación
    checkCurrentAuthState();
    
    // Configurar botón de cierre de sesión
    setupLogoutButton();
});

// Verificar estado actual de autenticación
function checkCurrentAuthState() {
    window.firebaseAuth.getCurrentUser()
        .then(user => {
            handleAuthStateChange(user);
        })
        .catch(error => {
            console.error("Error al verificar el estado de autenticación:", error);
        });
}

// Manejar cambios en el estado de autenticación
function handleAuthStateChange(user) {
    const logoutBtn = document.querySelector(".redirectToLogOut");
    const loginBtn = document.querySelector(".redirectToLogIn");
    const registerBtn = document.querySelector(".edirrectToLogOut"); // Corregir este selector si es necesario
    
    if (user) {
        // Usuario autenticado
        console.log("Usuario autenticado:", user.email);
        
        // Actualizar UI para usuario autenticado
        if (logoutBtn) logoutBtn.classList.remove("hidden");
        if (loginBtn) loginBtn.classList.add("hidden");
        if (registerBtn) registerBtn.classList.add("hidden");
        
        // Mostrar información del usuario
        updateUserInfo(user);
        
        // Redirigir si está en páginas de login o registro
        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath.includes("login.html") || currentPath.includes("register.html")) {
            window.location.href = "index.html";
        }
    } else {
        // Usuario no autenticado
        console.log("Usuario no autenticado");
        
        // Actualizar UI para usuario no autenticado
        if (logoutBtn) logoutBtn.classList.add("hidden");
        if (loginBtn) loginBtn.classList.remove("hidden");
        if (registerBtn) registerBtn.classList.remove("hidden");
        
        // Eliminar información del usuario
        removeUserInfo();
        
        // Verificar si la página actual requiere autenticación
        checkProtectedPage();
    }
}

// Actualizar información del usuario en la UI
function updateUserInfo(user) {
    // Eliminar cualquier información previa
    removeUserInfo();
    
    // Obtener la lista de navegación
    const navList = document.querySelector(".nav-list");
    if (!navList) return;
    
    // Crear elemento para mostrar información del usuario
    const userInfoItem = document.createElement("li");
    userInfoItem.className = "user-info";
    
    // Crear contenido del elemento
    userInfoItem.innerHTML = `
        <span class="user-display">
            <span class="auth-status-indicator logged-in"></span>
            ${user.displayName || user.email}
        </span>
    `;
    
    // Insertar en la barra de navegación (antes del botón de logout)
    const logoutItem = logoutBtn ? logoutBtn.closest("li") : null;
    if (logoutItem) {
        navList.insertBefore(userInfoItem, logoutItem);
    } else {
        navList.appendChild(userInfoItem);
    }
}

// Eliminar información del usuario de la UI
function removeUserInfo() {
    const userInfoItem = document.querySelector(".user-info");
    if (userInfoItem) {
        userInfoItem.remove();
    }
}

// Verificar si la página actual requiere autenticación
function checkProtectedPage() {
    // Lista de páginas que requieren autenticación
    const protectedPages = [
        // Añadir aquí páginas que requieran autenticación
        // Ejemplo: "profile.html", "account.html", etc.
    ];
    
    const currentPath = window.location.pathname.toLowerCase();
    
    // Verificar si la página actual está en la lista de protegidas
    const requiresAuth = protectedPages.some(page => currentPath.includes(page));
    
    if (requiresAuth) {
        // Redirigir a la página de inicio de sesión
        window.location.href = "login.html";
    }
}

// Configurar botón de cierre de sesión
function setupLogoutButton() {
    const logoutBtn = document.querySelector(".redirectToLogOut");
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        showLoading(true);
        
        window.firebaseAuth.logoutUser()
            .then(() => {
                showMessage("Sesión cerrada correctamente", "success");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            })
            .catch(error => {
                console.error("Error al cerrar sesión:", error);
                showMessage("Error al cerrar sesión: " + error.message, "error");
            })
            .finally(() => {
                showLoading(false);
            });
    });
}

// Función para mostrar mensajes
function showMessage(message, type) {
    let messageContainer = document.querySelector(".message-container");
    
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.className = "message-container";
        document.body.appendChild(messageContainer);
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