// Enterprise Chatbot functionality
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in before creating the chatbot
    checkUserAuthStateForChatbot();
    
    // Add event listeners
    const enterpriseChatbotIcon = document.getElementById('enterprise-chatbot-icon');
    const enterpriseChatbotClose = document.getElementById('enterprise-chatbot-close');
    const enterpriseChatbotContainer = document.getElementById('enterprise-chatbot-container');
    const enterpriseChatbotInputForm = document.getElementById('enterprise-chatbot-input-form');
    
    // Toggle chat window when icon is clicked
    if (enterpriseChatbotIcon) {
        enterpriseChatbotIcon.addEventListener('click', function() {
            enterpriseChatbotContainer.classList.add('active');
        });
    }
    
    // Close chat window when close button is clicked
    if (enterpriseChatbotClose) {
        enterpriseChatbotClose.addEventListener('click', function() {
            enterpriseChatbotContainer.classList.remove('active');
        });
    }
    
    // Handle message submission
    if (enterpriseChatbotInputForm) {
        enterpriseChatbotInputForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputField = document.getElementById('enterprise-chatbot-input');
            const messageText = inputField.value.trim();
            
            if (messageText) {
                // Add user message to chat
                addEnterpriseMessage('user', messageText);
                
                // Clear input field
                inputField.value = '';
                
                // Show typing indicator
                showTypingIndicator();
                
                // Process the company query and respond after a delay
                setTimeout(function() {
                    // Hide typing indicator
                    hideTypingIndicator();
                    
                    // Generate response based on the company name mentioned
                    const response = generateCompanyResponse(messageText);
                    addEnterpriseMessage('bot', response);
                    
                    // Scroll to bottom of chat
                    const chatMessages = document.querySelector('.enterprise-chatbot-messages');
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 2000); // Simulating response delay
            }
        });
    }
});

// Check user authentication state and create chatbot if logged in
function checkUserAuthStateForChatbot() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in, create the enterprise chatbot
                console.log("Usuario autenticado, mostrando chatbot empresarial");
                createEnterpriseChatbot();
                
                // Set up event listeners for the chatbot once it's created
                setTimeout(() => {
                    setupEnterpriseChatbotListeners();
                }, 100);
            } else {
                // User is not signed in, remove the enterprise chatbot if it exists
                console.log("Usuario no autenticado, ocultando chatbot empresarial");
                const existingChatbot = document.querySelector('.enterprise-chatbot-wrapper');
                if (existingChatbot) {
                    existingChatbot.remove();
                }
            }
        });
    } else {
        console.warn("Firebase Auth no está disponible para el chatbot empresarial");
    }
}

// Set up event listeners specifically for the chatbot
function setupEnterpriseChatbotListeners() {
    const enterpriseChatbotIcon = document.getElementById('enterprise-chatbot-icon');
    const enterpriseChatbotClose = document.getElementById('enterprise-chatbot-close');
    const enterpriseChatbotContainer = document.getElementById('enterprise-chatbot-container');
    const enterpriseChatbotInputForm = document.getElementById('enterprise-chatbot-input-form');
    
    // Toggle chat window when icon is clicked
    if (enterpriseChatbotIcon) {
        enterpriseChatbotIcon.addEventListener('click', function() {
            enterpriseChatbotContainer.classList.add('active');
        });
    }
    
    // Close chat window when close button is clicked
    if (enterpriseChatbotClose) {
        enterpriseChatbotClose.addEventListener('click', function() {
            enterpriseChatbotContainer.classList.remove('active');
        });
    }
    
    // Handle message submission
    if (enterpriseChatbotInputForm) {
        enterpriseChatbotInputForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputField = document.getElementById('enterprise-chatbot-input');
            const messageText = inputField.value.trim();
            
            if (messageText) {
                // Add user message to chat
                addEnterpriseMessage('user', messageText);
                
                // Clear input field
                inputField.value = '';
                
                // Show typing indicator
                showTypingIndicator();
                
                // Process the company query and respond after a delay
                setTimeout(function() {
                    // Hide typing indicator
                    hideTypingIndicator();
                    
                    // Generate response based on the company name mentioned
                    const response = generateCompanyResponse(messageText);
                    addEnterpriseMessage('bot', response);
                    
                    // Scroll to bottom of chat
                    const chatMessages = document.querySelector('.enterprise-chatbot-messages');
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 2000); // Simulating response delay
            }
        });
    }
}

// Create enterprise chatbot elements and append to document
function createEnterpriseChatbot() {
    // Check if chatbot already exists
    const existingChatbot = document.querySelector('.enterprise-chatbot-wrapper');
    if (existingChatbot) {
        return; // Don't create another one if it already exists
    }
    
    // Create the main container
    const enterpriseChatbotWrapper = document.createElement('div');
    enterpriseChatbotWrapper.className = 'enterprise-chatbot-wrapper';
    
    // Create the chatbot icon with hover message
    const enterpriseChatbotIconContainer = document.createElement('div');
    enterpriseChatbotIconContainer.className = 'enterprise-chatbot-icon-container';
    
    const enterpriseChatbotIcon = document.createElement('div');
    enterpriseChatbotIcon.id = 'enterprise-chatbot-icon';
    enterpriseChatbotIcon.innerHTML = `<img src="assets/images/sun-bot.png" alt="Enterprise Bot">`;
    
    const hoverBubble = document.createElement('div');
    hoverBubble.className = 'hover-bubble';
    hoverBubble.innerHTML = '¿Hablar con una empresa?';
    
    enterpriseChatbotIconContainer.appendChild(enterpriseChatbotIcon);
    enterpriseChatbotIconContainer.appendChild(hoverBubble);
    
    // Create the chat container
    const enterpriseChatbotContainer = document.createElement('div');
    enterpriseChatbotContainer.id = 'enterprise-chatbot-container';
    enterpriseChatbotContainer.className = 'enterprise-chatbot-container';
    
    // Create chat header
    const enterpriseChatbotHeader = document.createElement('div');
    enterpriseChatbotHeader.className = 'enterprise-chatbot-header';
    enterpriseChatbotHeader.innerHTML = `
        <div class="enterprise-chatbot-avatar">
            <img src="assets/images/sun-bot.png" alt="Enterprise Bot">
        </div>
        <div class="enterprise-chatbot-title">Contacto Empresarial</div>
        <div id="enterprise-chatbot-close" class="enterprise-chatbot-close">&times;</div>
    `;
    
    // Create messages container
    const enterpriseChatbotMessages = document.createElement('div');
    enterpriseChatbotMessages.className = 'enterprise-chatbot-messages';
    
    // Add initial welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'enterprise-chatbot-message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">¡Hola! Escribe el nombre de la empresa para contactarte directamente con ella.</div>
    `;
    enterpriseChatbotMessages.appendChild(welcomeMessage);
    
    // Create typing indicator (initially hidden)
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator bot-message';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    typingIndicator.style.display = 'none';
    enterpriseChatbotMessages.appendChild(typingIndicator);
    
    // Create input area
    const enterpriseChatbotInput = document.createElement('div');
    enterpriseChatbotInput.className = 'enterprise-chatbot-input';
    enterpriseChatbotInput.innerHTML = `
        <form id="enterprise-chatbot-input-form">
            <input type="text" id="enterprise-chatbot-input" placeholder="Escribe nombre de empresa...">
            <button type="submit"><span class="material-symbols-outlined">send</span></button>
        </form>
    `;
    
    // Assemble the chat container
    enterpriseChatbotContainer.appendChild(enterpriseChatbotHeader);
    enterpriseChatbotContainer.appendChild(enterpriseChatbotMessages);
    enterpriseChatbotContainer.appendChild(enterpriseChatbotInput);
    
    // Append all elements to the wrapper
    enterpriseChatbotWrapper.appendChild(enterpriseChatbotIconContainer);
    enterpriseChatbotWrapper.appendChild(enterpriseChatbotContainer);
    
    // Append the wrapper to the document body
    document.body.appendChild(enterpriseChatbotWrapper);
}

// Add a message to the enterprise chat
function addEnterpriseMessage(type, text) {
    const chatMessages = document.querySelector('.enterprise-chatbot-messages');
    
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `enterprise-chatbot-message ${type}-message`;
    
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'block';
        
        // Scroll to the bottom to show the typing indicator
        const chatMessages = document.querySelector('.enterprise-chatbot-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Generate a response based on the company name provided
function generateCompanyResponse(message) {
    // Convert message to lowercase for easy comparison
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('gracias')) {
        return "Con todo gusto para ayudarte.";
    }
    
    // Define company contact information
    const companies = {
        'avianca': {
            name: 'Avianca',
            email: 'servicioalcliente@avianca.com',
            phone: '+57 601 4010123'
        },
        'hotel las américas': {
            name: 'Hotel Las Américas Casa de Playa',
            email: 'reservas@hotellasamericas.com.co',
            phone: '+57 605 6723344'
        },
        'hotel isla múcura': {
            name: 'Hotel Isla Múcura',
            email: 'reservas@islamucura.com',
            phone: '+57 320 8640234'
        },
        'hyatt regency': {
            name: 'Hyatt Regency Cartagena',
            email: 'cartagena.regency@hyatt.com',
            phone: '+57 605 6951234'
        },
        'arcoiris casahostal': {
            name: 'Arcoiris Casahostal',
            email: 'arcoiriscasahostal@gmail.com',
            phone: '+57 310 7654321'
        },
        'alana casa de playa': {
            name: 'Älana casa de playa',
            email: 'reservas@alanacasadeplaya.com',
            phone: '+57 315 9876543'
        },
        'baalbeck': {
            name: 'Restaurante Baalbeck',
            email: 'baalbeck@gmail.com',
            phone: '+57 605 6601234'
        },
        'occa': {
            name: 'Restaurante Occa',
            email: 'reservas@occa.com.co',
            phone: '+57 605 6543210'
        },
        'la regatta': {
            name: 'Restaurante La Regatta',
            email: 'info@laregatta.com',
            phone: '+57 605 6650361'
        },
        'hotel isla palma': {
            name: 'Hotel Isla Palma',
            email: 'reservas@hotelislapalma.com',
            phone: '+57 312 3456789'
        },
        'hotel portoalegre': {
            name: 'Hotel Portoalegre',
            email: 'reservas@hotelportoalegre.com',
            phone: '+57 312 3456789'
        },
        'caribe dreams': {
            name: 'Caribe Dreams',
            email: 'contacto@caribedreams.com',
            phone: '+57 300 1234567'
        },
        'hotel cinco monteria': {
            name: 'Hotel Cinco Monteria',
            email: 'reservas@hotelcinco.com.co',
            phone: '+57 604 7850505'
        },
        'capitan mandy': {
            name: 'Restaurante Capitan Mandy',
            email: 'capitanmandy@gmail.com',
            phone: '+57 8 5121312'
        },
        'grand sirenis': {
            name: 'Grand Sirenis San Andrés',
            email: 'reservas@sirenishotels.com',
            phone: '+57 8 5130000'
        },
        'sea avenue': {
            name: 'Sea Avenue Hotel',
            email: 'info@seaavenuehotel.com',
            phone: '+57 8 5125678'
        }
    };
    
    // Check if the message contains any of the company names
    for (const companyKey in companies) {
        if (lowerMessage.includes(companyKey)) {
            const company = companies[companyKey];
            return `El contacto de ${company.name} es:\nTeléfono: ${company.phone}\nEmail: ${company.email}`;
        }
    }
    
    // If no specific company is found, return a generic response
    return "Lo siento, no tengo información de contacto para esta empresa. Puedes buscar empresas como: Avianca, Hotel Las Américas, Hyatt Regency, Baalbeck, entre otras.";
}