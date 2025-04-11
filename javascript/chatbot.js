// Chatbot functionality
document.addEventListener("DOMContentLoaded", function() {
    // Create chatbot elements
    createChatbot();
    
    // Add event listeners
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotInputForm = document.getElementById('chatbot-input-form');
    
    // Toggle chat window when icon is clicked
    if (chatbotIcon) {
        chatbotIcon.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
        });
    }
    
    // Close chat window when close button is clicked
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Handle message submission
    if (chatbotInputForm) {
        chatbotInputForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputField = document.getElementById('chatbot-input');
            const messageText = inputField.value.trim();
            
            if (messageText) {
                // Add user message to chat
                addMessage('user', messageText);
                
                // Clear input field
                inputField.value = '';
                
                // Simulate bot response after a short delay
                setTimeout(function() {
                    const botResponses = [
                        "¡Gracias por tu mensaje! Estoy aquí para ayudarte a conocer el Caribe colombiano.",
                        "¡Hola! Puedo ayudarte a encontrar destinos turísticos en el Caribe.",
                        "¿Quieres saber más sobre nuestros servicios turísticos en el Caribe?",
                        "Puedes encontrar información sobre hoteles, restaurantes y tours en nuestra plataforma.",
                        "¿Necesitas ayuda para navegar por nuestra página? Estoy aquí para guiarte."
                    ];
                    
                    // Select a random response
                    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                    addMessage('bot', randomResponse);
                    
                    // Scroll to bottom of chat
                    const chatMessages = document.querySelector('.chatbot-messages');
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        });
    }
});

// Create chatbot elements and append to document
function createChatbot() {
    // Create the main container
    const chatbotWrapper = document.createElement('div');
    chatbotWrapper.className = 'chatbot-wrapper';
    
    // Create the chatbot icon with thought bubble
    const chatbotIconContainer = document.createElement('div');
    chatbotIconContainer.className = 'chatbot-icon-container';
    
    const chatbotIcon = document.createElement('div');
    chatbotIcon.id = 'chatbot-icon';
    chatbotIcon.innerHTML = `<img src="assets/images/sun-bot.png" alt="Sunny Bot">`;
    
    const thoughtBubble = document.createElement('div');
    thoughtBubble.className = 'thought-bubble';
    thoughtBubble.innerHTML = 'Hola!, Soy Sunny, ¿en qué puedo ayudarte?';
    
    chatbotIconContainer.appendChild(chatbotIcon);
    chatbotIconContainer.appendChild(thoughtBubble);
    
    // Create the chat container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.className = 'chatbot-container';
    
    // Create chat header
    const chatbotHeader = document.createElement('div');
    chatbotHeader.className = 'chatbot-header';
    chatbotHeader.innerHTML = `
        <div class="chatbot-avatar">
            <img src="assets/images/sun-bot.png" alt="Sunny Bot">
        </div>
        <div class="chatbot-title">Sunny Bot</div>
        <div id="chatbot-close" class="chatbot-close">&times;</div>
    `;
    
    // Create messages container
    const chatbotMessages = document.createElement('div');
    chatbotMessages.className = 'chatbot-messages';
    
    // Add initial welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chatbot-message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">¡Hola! Soy Sunny, ¿en qué puedo ayudarte?</div>
    `;
    chatbotMessages.appendChild(welcomeMessage);
    
    // Create input area
    const chatbotInput = document.createElement('div');
    chatbotInput.className = 'chatbot-input';
    chatbotInput.innerHTML = `
        <form id="chatbot-input-form">
            <input type="text" id="chatbot-input" placeholder="Escribe un mensaje...">
            <button type="submit"><span class="material-symbols-outlined">send</span></button>
        </form>
    `;
    
    // Assemble the chat container
    chatbotContainer.appendChild(chatbotHeader);
    chatbotContainer.appendChild(chatbotMessages);
    chatbotContainer.appendChild(chatbotInput);
    
    // Append all elements to the wrapper
    chatbotWrapper.appendChild(chatbotIconContainer);
    chatbotWrapper.appendChild(chatbotContainer);
    
    // Append the wrapper to the document body
    document.body.appendChild(chatbotWrapper);
}

// Add a message to the chat
function addMessage(type, text) {
    const chatMessages = document.querySelector('.chatbot-messages');
    
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}-message`;
    
    messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}