// Firebase configuration and authentication implementation
// Save this as firebase-auth.js in your javascript folder

// Firebase configuration - you need to replace these values with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAAUzyCe6Wnh17Sfw-chrpzR5iG1RrYiII",
    authDomain: "caribedreams-6662a.firebaseapp.com",
    projectId: "caribedreams-6662a",
    storageBucket: "caribedreams-6662a.firebasestorage.app",
    messagingSenderId: "180975396780",
    appId: "1:180975396780:web:277e0c8536e53279e27c09"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Function to handle user registration
  function registerUser(email, password, name, phone) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User registered successfully
        const user = userCredential.user;
        
        // Add user details to Firestore
        return db.collection('users').doc(user.uid).set({
          name: name,
          email: email,
          phone: phone,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          // Update display name in Firebase Auth
          return user.updateProfile({
            displayName: name
          });
        })
        .then(() => {
          console.log("User registered successfully:", user);
          return user;
        });
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        throw error;
      });
  }
  
  // Function to handle user login
  function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User logged in successfully
        const user = userCredential.user;
        console.log("User logged in successfully:", user);
        return user;
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        throw error;
      });
  }
  
  // Function to handle logout
  function logoutUser() {
    return auth.signOut()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        throw error;
      });
  }
  
  // Function to check if a user is logged in
  function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }
  
  // Function to handle password reset
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
      .then(() => {
        console.log("Password reset email sent");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        throw error;
      });
  }
  
  // Function to sign in with Google
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        
        // Check if this is a new user
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
          // Add user to Firestore if new
          return db.collection('users').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            console.log("New Google user added to database");
            return user;
          });
        }
        
        console.log("User signed in with Google:", user);
        return user;
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
        throw error;
      });
  }
  
  // Export functions
  window.firebaseAuth = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    resetPassword,
    signInWithGoogle
  };