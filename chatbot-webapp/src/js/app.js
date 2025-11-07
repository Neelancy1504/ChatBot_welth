import Chatbot from './chatbot.js';

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    
    // Extract userid and accountid from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userid = urlParams.get('userid') || "2896d2d5-915e-463b-85c5-fe1dcd141486";
    const accountid = urlParams.get('accountid') || "ba67685c-4878-4d5c-bb0f-75bcdb4c763b";
    
    console.log('Chatbot initialized with:', { userid, accountid });
    
    // Initialize chatbot with extracted parameters
    const chatbot = new Chatbot(userid, accountid);

    // Function to add a welcome message when the chat loads
    function addWelcomeMessage() {
        const welcomeText = userid !== "2896d2d5-915e-463b-85c5-fe1dcd141486" 
            ? "Hello! I'm your personal financial AI assistant. I have access to your financial data and can help you with budgeting, expense tracking, and financial insights. How can I help you today?"
            : "Hello! I'm a financial AI assistant. Please connect from your Welth dashboard for personalized financial insights.";
        addMessage(welcomeText, 'bot');
    }

    // Send message function
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        // Add user message to the chat window
        addMessage(message, 'user');
        
        // Clear the input field
        messageInput.value = '';
        messageInput.focus();

        try {
            const botResponse = await chatbot.generateResponse(message);
            addMessage(botResponse, 'bot');
        } catch (error) {
            console.error('Error getting bot response:', error);
            addMessage("Sorry, I'm having trouble responding right now. Please try again.", 'bot');
        }
    }

    // Function to add a message to the chat interface
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-bubble user-bubble">${escapeHtml(text)}</div>
                <div class="message-time">${currentTime}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bot-avatar">
                    <img src="https://www.shutterstock.com/image-vector/chat-bot-icon-virtual-smart-600nw-2478937553.jpg" alt="Bot">
                </div>
                <div class="message-content">
                    <div class="message-bubble bot-bubble">${escapeHtml(text)}</div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Event listeners for sending messages
    sendButton.addEventListener('click', async () => {
        await sendMessage();
    });

    messageInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            await sendMessage();
        }
    });

    // Add the initial welcome message and focus on the input
    addWelcomeMessage();
    messageInput.focus();
});