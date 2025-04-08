// Firebase configuration and authentication implementation
// Configuración de Firebase - reemplaza estos valores con la configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAAUzyCe6Wnh17Sfw-chrpzR5iG1RrYiII",
  authDomain: "caribedreams-6662a.firebaseapp.com",
  projectId: "caribedreams-6662a",
  storageBucket: "caribedreams-6662a.firebasestorage.app",
  messagingSenderId: "180975396780",
  appId: "1:180975396780:web:277e0c8536e53279e27c09"
};

// Inicializar Firebase (solo si no está ya inicializado)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Función para manejar el registro de usuarios
function registerUser(email, password, name, phone) {
  return auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
          // Usuario registrado exitosamente
          const user = userCredential.user;
          
          // Añadir detalles del usuario a Firestore
          return db.collection('users').doc(user.uid).set({
              name: name,
              email: email,
              phone: phone,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
              // Actualizar nombre de visualización en Firebase Auth
              return user.updateProfile({
                  displayName: name
              });
          })
          .then(() => {
              console.log("Usuario registrado exitosamente:", user);
              return user;
          });
      })
      .catch((error) => {
          console.error("Error al registrar usuario:", error);
          throw error;
      });
}

// Función para manejar el inicio de sesión de usuarios
function loginUser(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          // Usuario ha iniciado sesión exitosamente
          const user = userCredential.user;
          console.log("Usuario ha iniciado sesión exitosamente:", user);
          return user;
      })
      .catch((error) => {
          console.error("Error al iniciar sesión:", error);
          throw error;
      });
}

// Función para manejar el cierre de sesión
function logoutUser() {
  return auth.signOut()
      .then(() => {
          console.log("Usuario ha cerrado sesión exitosamente");
      })
      .catch((error) => {
          console.error("Error al cerrar sesión:", error);
          throw error;
      });
}

// Función para verificar si un usuario ha iniciado sesión
function getCurrentUser() {
  return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
      }, reject);
  });
}

// Función para manejar el restablecimiento de contraseña
function resetPassword(email) {
  return auth.sendPasswordResetEmail(email)
      .then(() => {
          console.log("Correo de restablecimiento de contraseña enviado");
      })
      .catch((error) => {
          console.error("Error al enviar correo de restablecimiento de contraseña:", error);
          throw error;
      });
}

// Función para iniciar sesión con Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider)
      .then((result) => {
          const user = result.user;
          
          // Verificar si es un usuario nuevo
          const isNewUser = result.additionalUserInfo.isNewUser;
          
          if (isNewUser) {
              // Añadir usuario a Firestore si es nuevo
              return db.collection('users').doc(user.uid).set({
                  name: user.displayName,
                  email: user.email,
                  phone: user.phoneNumber || '',
                  createdAt: firebase.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                  console.log("Nuevo usuario de Google añadido a la base de datos");
                  return user;
              });
          }
          
          console.log("Usuario ha iniciado sesión con Google:", user);
          return user;
      })
      .catch((error) => {
          console.error("Error al iniciar sesión con Google:", error);
          throw error;
      });
}

// Exportar funciones
window.firebaseAuth = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  resetPassword,
  signInWithGoogle
};