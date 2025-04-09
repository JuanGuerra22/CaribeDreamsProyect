// Enterprise Firebase authentication and registration
// This file handles business account registration with Firebase

// Firebase configuration is already loaded from firebase-auth.js
// We're adding enterprise-specific functionality

// Function to handle business registration
function registerEnterprise(email, password, userData) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User registered successfully
            const user = userCredential.user;
            
            // Add custom claims for enterprise role (this requires backend functions)
            // For now, we'll mark the user as enterprise in Firestore
            
            // Add user details to Firestore with enterprise data
            return firebase.firestore().collection('enterprises').doc(user.uid).set({
                businessName: userData.businessName,
                ownerName: userData.ownerName,
                email: email,
                businessPhone: userData.businessPhone,
                ownerPhone: userData.ownerPhone,
                nit: userData.nit,
                accountType: 'enterprise',
                isAdmin: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                // Update display name in Firebase Auth (using business name)
                return user.updateProfile({
                    displayName: `Admin: ${userData.businessName}`
                });
            })
            .then(() => {
                console.log("Enterprise registered successfully:", user);
                
                // Set a flag in localStorage to indicate we're coming from registration
                // This helps dashboard recognize we're already authenticated
                localStorage.setItem('justRegistered', 'true');
                
                return user;
            });
        })
        .catch((error) => {
            console.error("Error registering enterprise:", error);
            throw error;
        });
}

// Function to get enterprise profile data
function getEnterpriseData(userId) {
    return firebase.firestore().collection('enterprises').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No enterprise data found");
                return null;
            }
        })
        .catch((error) => {
            console.error("Error getting enterprise data:", error);
            throw error;
        });
}

// Function to update enterprise profile
function updateEnterpriseProfile(userId, profileData) {
    return firebase.firestore().collection('enterprises').doc(userId).update(profileData)
        .then(() => {
            console.log("Enterprise profile updated successfully");
            return true;
        })
        .catch((error) => {
            console.error("Error updating enterprise profile:", error);
            throw error;
        });
}

// Add these functions to the global firebaseAuth object
// This extends the existing auth functions without replacing them
window.firebaseAuth = {
    ...window.firebaseAuth,
    registerEnterprise,
    getEnterpriseData,
    updateEnterpriseProfile
};