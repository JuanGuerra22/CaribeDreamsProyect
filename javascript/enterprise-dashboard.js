// Enterprise Dashboard JavaScript

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated and is an enterprise
    checkEnterpriseAuth();
    
    // Initialize dashboard tabs
    initDashboardTabs();
    
    // Initialize form handlers
    initProfileForm();
    initServiceForms();
    initEventForms();
    initPhotoForms();
    initSettingsForms();
    
    // Initialize quick action buttons
    initQuickActions();
});

// Check if user is authenticated as an enterprise
function checkEnterpriseAuth() {
    // Check for the registration flag
    const justRegistered = localStorage.getItem('justRegistered');
    
    // Clear the flag immediately
    if (justRegistered) {
        localStorage.removeItem('justRegistered');
    }
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, now check if they're an enterprise
            firebase.firestore().collection('enterprises').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        // This is an enterprise user, load their data
                        loadEnterpriseData(doc.data());
                        
                        // We're coming directly from registration, show a welcome message
                        if (justRegistered) {
                            showMessage("¡Bienvenido! Tu cuenta empresarial ha sido creada exitosamente.", "success");
                        }
                    } else {
                        // Not an enterprise user, redirect to home
                        console.log("User is not an enterprise account");
                        showMessage("Esta área es solo para cuentas empresariales", "error");
                        
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 2000);
                    }
                })
                .catch((error) => {
                    console.error("Error checking enterprise status:", error);
                    showMessage("Error loading enterprise data: " + error.message, "error");
                });
        } else {
            // No user is signed in, redirect to login
            console.log("No user signed in");
            window.location.href = "login.html";
        }
    });
}

// Load enterprise data into the dashboard
function loadEnterpriseData(enterpriseData) {
    // Update business name in welcome message
    const businessNameEl = document.getElementById("business-name");
    if (businessNameEl) {
        businessNameEl.textContent = enterpriseData.businessName || "Your Business";
    }
    
    // Load profile data if in profile section
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        // Populate form fields with data
        if (enterpriseData.businessName) profileForm.querySelector("#businessName").value = enterpriseData.businessName;
        if (enterpriseData.ownerName) profileForm.querySelector("#ownerName").value = enterpriseData.ownerName;
        if (enterpriseData.businessPhone) profileForm.querySelector("#businessPhone").value = enterpriseData.businessPhone;
        if (enterpriseData.email) profileForm.querySelector("#businessEmail").value = enterpriseData.email;
        if (enterpriseData.businessAddress) profileForm.querySelector("#businessAddress").value = enterpriseData.businessAddress;
        if (enterpriseData.businessDescription) profileForm.querySelector("#businessDescription").value = enterpriseData.businessDescription;
        if (enterpriseData.businessCategory) profileForm.querySelector("#businessCategory").value = enterpriseData.businessCategory;
    }
    
    // Load settings data
    const settingsEmail = document.getElementById("settingsEmail");
    if (settingsEmail) {
        settingsEmail.value = enterpriseData.email || firebase.auth().currentUser.email;
    }
    
    // Load notification settings if any
    if (enterpriseData.notificationSettings) {
        const notificationForm = document.getElementById("notification-settings-form");
        if (notificationForm) {
            notificationForm.querySelector("#emailNotifications").checked = 
                enterpriseData.notificationSettings.emailNotifications !== false;
            notificationForm.querySelector("#bookingNotifications").checked = 
                enterpriseData.notificationSettings.bookingNotifications !== false;
            notificationForm.querySelector("#messageNotifications").checked = 
                enterpriseData.notificationSettings.messageNotifications !== false;
            notificationForm.querySelector("#marketingEmails").checked = 
                enterpriseData.notificationSettings.marketingEmails !== false;
        }
    }
    
    // Load services if any
    loadServices();
    
    // Load events if any
    loadEvents();
    
    // Load photos if any
    loadPhotos();
}

// Initialize dashboard tab navigation
function initDashboardTabs() {
    const tabLinks = document.querySelectorAll('.dashboard-menu a');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section to show
            const sectionId = this.getAttribute('data-section');
            const sectionToShow = document.getElementById(sectionId);
            
            // Hide all sections and remove active class from all links
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.classList.remove('active');
            });
            
            document.querySelectorAll('.dashboard-menu li').forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // Show selected section and mark link as active
            sectionToShow.classList.add('active');
            this.closest('li').classList.add('active');
            
            // Update URL hash
            window.location.hash = sectionId;
        });
    });
    
    // Check if hash exists in URL and activate the corresponding tab
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const link = document.querySelector(`.dashboard-menu a[data-section="${sectionId}"]`);
        if (link) {
            link.click();
        }
    }
}

// Initialize profile form
function initProfileForm() {
    const profileForm = document.getElementById("profile-form");
    if (!profileForm) return;
    
    profileForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Get current user
        const user = firebase.auth().currentUser;
        if (!user) {
            showMessage("You must be logged in to update your profile", "error");
            return;
        }
        
        // Show loading
        showLoading(true);
        
        // Get form data
        const profileData = {
            businessName: profileForm.querySelector("#businessName").value.trim(),
            ownerName: profileForm.querySelector("#ownerName").value.trim(),
            businessPhone: profileForm.querySelector("#businessPhone").value.trim(),
            email: profileForm.querySelector("#businessEmail").value.trim(),
            businessAddress: profileForm.querySelector("#businessAddress").value.trim(),
            businessDescription: profileForm.querySelector("#businessDescription").value.trim(),
            businessCategory: profileForm.querySelector("#businessCategory").value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Update Firestore document
        firebase.firestore().collection('enterprises').doc(user.uid).update(profileData)
            .then(() => {
                showMessage("Profile updated successfully", "success");
                
                // Update display name in auth profile
                return user.updateProfile({
                    displayName: `Admin: ${profileData.businessName}`
                });
            })
            .then(() => {
                // Update business name in welcome message
                const businessNameEl = document.getElementById("business-name");
                if (businessNameEl) {
                    businessNameEl.textContent = profileData.businessName;
                }
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                showMessage("Error updating profile: " + error.message, "error");
            })
            .finally(() => {
                showLoading(false);
            });
    });
}

// Initialize settings forms
function initSettingsForms() {
    // Password change form
    const changePasswordBtn = document.getElementById("changePassword");
    const passwordChangeForm = document.querySelector(".password-change-form");
    const savePasswordBtn = document.getElementById("savePasswordBtn");
    const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");
    
    if (changePasswordBtn && passwordChangeForm) {
        // Show password change form
        changePasswordBtn.addEventListener("click", function() {
            passwordChangeForm.style.display = "block";
            changePasswordBtn.style.display = "none";
        });
        
        // Hide password change form
        if (cancelPasswordBtn) {
            cancelPasswordBtn.addEventListener("click", function() {
                passwordChangeForm.style.display = "none";
                changePasswordBtn.style.display = "block";
                passwordChangeForm.querySelector("#currentPassword").value = "";
                passwordChangeForm.querySelector("#newPassword").value = "";
                passwordChangeForm.querySelector("#confirmPassword").value = "";
            });
        }
        
        // Save new password
        if (savePasswordBtn) {
            savePasswordBtn.addEventListener("click", function() {
                // Get values
                const currentPassword = passwordChangeForm.querySelector("#currentPassword").value;
                const newPassword = passwordChangeForm.querySelector("#newPassword").value;
                const confirmPassword = passwordChangeForm.querySelector("#confirmPassword").value;
                
                // Validate
                if (!currentPassword) {
                    showMessage("Please enter your current password", "error");
                    return;
                }
                
                if (!newPassword) {
                    showMessage("Please enter a new password", "error");
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    showMessage("New passwords do not match", "error");
                    return;
                }
                
                // Show loading
                showLoading(true);
                
                // Get current user
                const user = firebase.auth().currentUser;
                
                // Get credentials
                const credential = firebase.auth.EmailAuthProvider.credential(
                    user.email, 
                    currentPassword
                );
                
                // Re-authenticate
                user.reauthenticateWithCredential(credential)
                    .then(() => {
                        // Update password
                        return user.updatePassword(newPassword);
                    })
                    .then(() => {
                        showMessage("Password updated successfully", "success");
                        
                        // Reset form and hide
                        passwordChangeForm.style.display = "none";
                        changePasswordBtn.style.display = "block";
                        passwordChangeForm.querySelector("#currentPassword").value = "";
                        passwordChangeForm.querySelector("#newPassword").value = "";
                        passwordChangeForm.querySelector("#confirmPassword").value = "";
                    })
                    .catch((error) => {
                        console.error("Error updating password:", error);
                        
                        if (error.code === 'auth/wrong-password') {
                            showMessage("Current password is incorrect", "error");
                        } else {
                            showMessage("Error updating password: " + error.message, "error");
                        }
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            });
        }
    }
    
    // Notification settings form
    const notificationForm = document.getElementById("notification-settings-form");
    if (notificationForm) {
        notificationForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Get current user
            const user = firebase.auth().currentUser;
            if (!user) {
                showMessage("You must be logged in to update settings", "error");
                return;
            }
            
            // Show loading
            showLoading(true);
            
            // Get form data
            const notificationData = {
                emailNotifications: notificationForm.querySelector("#emailNotifications").checked,
                bookingNotifications: notificationForm.querySelector("#bookingNotifications").checked,
                messageNotifications: notificationForm.querySelector("#messageNotifications").checked,
                marketingEmails: notificationForm.querySelector("#marketingEmails").checked,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Update Firestore document
            firebase.firestore().collection('enterprises').doc(user.uid).update({
                notificationSettings: notificationData
            })
                .then(() => {
                    showMessage("Notification settings updated successfully", "success");
                })
                .catch((error) => {
                    console.error("Error updating notification settings:", error);
                    showMessage("Error updating settings: " + error.message, "error");
                })
                .finally(() => {
                    showLoading(false);
                });
        });
    }
}

// Initialize service forms
function initServiceForms() {
    // Add service button
    const addServiceBtn = document.getElementById("add-service-btn");
    if (addServiceBtn) {
        addServiceBtn.addEventListener("click", function() {
            document.querySelector(".add-service-form").style.display = "block";
        });
    }
    
    // Cancel add service button
    const cancelServiceBtn = document.getElementById("cancel-service-btn");
    if (cancelServiceBtn) {
        cancelServiceBtn.addEventListener("click", function() {
            document.querySelector(".add-service-form").style.display = "none";
            document.getElementById("service-form").reset();
        });
    }
    
    // Service form submission
    const serviceForm = document.getElementById("service-form");
    if (serviceForm) {
        serviceForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Get current user
            const user = firebase.auth().currentUser;
            if (!user) {
                showMessage("You must be logged in to add services", "error");
                return;
            }
            
            // Show loading
            showLoading(true);
            
            // Get form data
            const serviceData = {
                name: serviceForm.querySelector("#serviceName").value.trim(),
                description: serviceForm.querySelector("#serviceDescription").value.trim(),
                price: parseFloat(serviceForm.querySelector("#servicePrice").value) || 0,
                category: serviceForm.querySelector("#serviceCategory").value,
                enterpriseId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Check if editing or adding new
            const serviceId = serviceForm.dataset.serviceId;
            
            if (serviceId) {
                // Update existing service
                firebase.firestore().collection('services').doc(serviceId).update(serviceData)
                    .then(() => {
                        showMessage("Service updated successfully", "success");
                        serviceForm.reset();
                        document.querySelector(".add-service-form").style.display = "none";
                        serviceForm.removeAttribute('data-service-id');
                        
                        // Reload services list
                        loadServices();
                    })
                    .catch((error) => {
                        console.error("Error updating service:", error);
                        showMessage("Error updating service: " + error.message, "error");
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            } else {
                // Add new service
                firebase.firestore().collection('services').add(serviceData)
                    .then((docRef) => {
                        showMessage("Service added successfully", "success");
                        serviceForm.reset();
                        document.querySelector(".add-service-form").style.display = "none";
                        
                        // Reload services list
                        loadServices();
                    })
                    .catch((error) => {
                        console.error("Error adding service:", error);
                        showMessage("Error adding service: " + error.message, "error");
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            }
        });
    }
}

// Edit a service
function editService(serviceId) {
    // Show loading
    showLoading(true);
    
    // Get service data
    firebase.firestore().collection('services').doc(serviceId).get()
        .then((doc) => {
            if (doc.exists) {
                const serviceData = doc.data();
                
                // Get form and show it
                const serviceForm = document.getElementById("service-form");
                const addServiceForm = document.querySelector(".add-service-form");
                
                if (serviceForm && addServiceForm) {
                    // Set form values
                    serviceForm.querySelector("#serviceName").value = serviceData.name || '';
                    serviceForm.querySelector("#serviceDescription").value = serviceData.description || '';
                    serviceForm.querySelector("#servicePrice").value = serviceData.price || '';
                    serviceForm.querySelector("#serviceCategory").value = serviceData.category || '';
                    
                    // Set data attribute for service ID
                    serviceForm.dataset.serviceId = serviceId;
                    
                    // Show form
                    addServiceForm.style.display = "block";
                    
                    // Scroll to form
                    addServiceForm.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                showMessage("Service not found", "error");
            }
        })
        .catch((error) => {
            console.error("Error getting service:", error);
            showMessage("Error getting service: " + error.message, "error");
        })
        .finally(() => {
            showLoading(false);
        });
}

// Delete a service
function deleteService(serviceId) {
    // Confirm delete
    if (!confirm("Are you sure you want to delete this service?")) {
        return;
    }
    
    // Show loading
    showLoading(true);
    
    // Delete from Firestore
    firebase.firestore().collection('services').doc(serviceId).delete()
        .then(() => {
            showMessage("Service deleted successfully", "success");
            
            // Reload services list
            loadServices();
        })
        .catch((error) => {
            console.error("Error deleting service:", error);
            showMessage("Error deleting service: " + error.message, "error");
        })
        .finally(() => {
            showLoading(false);
        });
}

// Load services from Firestore
function loadServices() {
    const servicesList = document.querySelector(".services-list");
    if (!servicesList) return;
    
    // Get current user
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    // Show loading
    showLoading(true);
    
    // Clear current list except for the no-items message
    const noItemsMessage = servicesList.querySelector(".no-items-message");
    servicesList.innerHTML = '';
    servicesList.appendChild(noItemsMessage);
    
    // Query Firestore for services
    firebase.firestore().collection('services')
        .where("enterpriseId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                // No services found
                noItemsMessage.style.display = "block";
            } else {
                // Hide no items message
                noItemsMessage.style.display = "none";
                
                // Create service cards
                querySnapshot.forEach((doc) => {
                    const serviceData = doc.data();
                    const serviceCard = createServiceCard(doc.id, serviceData);
                    servicesList.appendChild(serviceCard);
                });
            }
        })
        .catch((error) => {
            console.error("Error loading services:", error);
            showMessage("Error loading services: " + error.message, "error");
        })
        .finally(() => {
            showLoading(false);
        });
}

// Create service card element
function createServiceCard(serviceId, serviceData) {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card';
    serviceCard.dataset.id = serviceId;
    
    const categoryLabel = getCategoryLabel(serviceData.category);
    const price = serviceData.price ? `${serviceData.price.toFixed(2)} USD` : 'Price not specified';
    
    serviceCard.innerHTML = `
        <div class="service-header">
            <h4>${serviceData.name}</h4>
            <span class="service-category">${categoryLabel}</span>
        </div>
        <div class="service-body">
            <p>${serviceData.description}</p>
            <div class="service-price">${price}</div>
        </div>
        <div class="service-actions">
            <button class="btn-edit" data-id="${serviceId}">
                <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-delete" data-id="${serviceId}">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    serviceCard.querySelector('.btn-edit').addEventListener('click', function() {
        editService(serviceId);
    });
    
    serviceCard.querySelector('.btn-delete').addEventListener('click', function() {
        deleteService(serviceId);
    });
    
    return serviceCard;
}

// Get readable category label
function getCategoryLabel(category) {
    const categories = {
        'accommodation': 'Accommodation',
        'transport': 'Transportation',
        'tour': 'Tours & Activities',
        'food': 'Food & Drinks',
        'wellness': 'Wellness & Spa',
        'event': 'Events',
        'other': 'Other'
    };
    
    return categories[category] || 'Uncategorized';
}