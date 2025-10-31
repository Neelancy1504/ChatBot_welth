import Chatbot from './chatbot.js';
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const chatbot = new Chatbot();

    // Function to add a welcome message when the chat loads
    function addWelcomeMessage() {
        const welcomeText = "Hello! I'm an AI assistant. Ask me about your finances.";
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

        const botResponse = await chatbot.generateResponse(message);
        addMessage(botResponse, 'bot');

        // Simulate a bot response after a short delay
        // setTimeout(() => {
        //     const botResponse = generateBotResponse(message);
        //     addMessage(botResponse, 'bot');
        // }, 1000);
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
        
        // Scroll to the bottom to see the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Function to generate a response from the bot
    function generateBotResponse(userMessage) {
        const responses = {
            'hello': 'Hello! How can I help you today?',
            'hi': 'Hi there! What would you like to know?',
            'how are you': 'I am just a bot, but I am functioning as expected! How can I assist you?',
            'notebooklm': 'NotebookLM is an experimental product from Google Labs designed to enhance how we interact with notes and documents using AI. It helps users extract, summarize, and work with content more efficiently.',
            'what is notebooklm': 'NotebookLM is an experimental product from Google Labs designed to enhance how we interact with notes and documents using AI. It helps users extract, summarize, and work with content more efficiently.',
            'features': 'Key features include AI-powered note analysis, content summarization, document interaction, and intelligent content extraction to make your workflow more efficient.',
            'help': 'You can ask me questions about NotebookLM, its features, or just say hello!',
            'bye': 'Goodbye! Feel free to come back if you have more questions.',
            'thanks': 'You\'re welcome! Let me know if there\'s anything else I can help with.',
            'thank you': 'You\'re welcome! Let me know if there\'s anything else I can help with.'
        };

        const lowerMessage = userMessage.toLowerCase();
        
        // Check for keyword matches
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        // Default responses for unmatched queries
        const defaultResponses = [
            'That\'s an interesting question! Can you provide more details?',
            'I\'d be happy to help with that. Could you elaborate?',
            'I understand you\'re asking about that topic. What specific aspect interests you most?',
            'I\'m not sure how to answer that. Can you try asking another way?'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Event listeners for sending messages
    //sendButton.addEventListener('click', sendMessage);
    sendButton.addEventListener('click', async () => {
        await sendMessage();
    });

    // messageInput.addEventListener('keypress', function(e) {
    //     if (e.key === 'Enter') {
    //         sendMessage();
    //     }
    // });

    // update to 'keydown' to capture all key presses
    messageInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // prevent form submission / default behavior
            await sendMessage();
        }
    });


    // Add the initial welcome message and focus on the input
    addWelcomeMessage();
    messageInput.focus();
});