import { API_BASE_URL } from "./config.js";
class Chatbot {
    constructor() {
        this.messages = [];
    }

    sendMessage(userMessage) {
        this.messages.push({ sender: 'user', text: userMessage });
        this.receiveMessage(this.generateResponse(userMessage));
    }

    receiveMessage(botMessage) {
        this.messages.push({ sender: 'bot', text: botMessage });
        // Here you would typically trigger a UI update to display the new message
    }

    // generateResponse(userMessage) {
    //     // Simple response logic for demonstration purposes
    //     return `You said: ${userMessage}`;
    // }
    async generateResponse(userMessage, userid = "2896d2d5-915e-463b-85c5-fe1dcd141486", accountid = "ba67685c-4878-4d5c-bb0f-75bcdb4c763b") {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage, userid: userid, accountid: accountid })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.answer || "Sorry, I couldn’t generate an answer.";
        } catch (error) {
            console.error('Error fetching response:', error);
            return "Oops, something went wrong while getting the answer.";
        }
    }
    getMessages() {
        return this.messages;
    }
}

export default Chatbot;

function generateBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! How can I help you today?',
        'hi': 'Hi there! What would you like to know?',
        'how are you': 'I\'m doing well, thank you for asking! How can I assist you?',
        'what is notebooklm': 'NotebookLM is an experimental product from Google Labs designed to enhance how we interact with notes and documents using AI. It helps users extract, summarize, and work with content more efficiently.',
        'features': 'Key features include AI-powered note analysis, content summarization, document interaction, and intelligent content extraction to make your workflow more efficient.',
        'help': 'I can help you with information about NotebookLM, answer questions, and provide assistance with various topics. What would you like to know?'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    // Default responses for unmatched queries
    const defaultResponses = [
        'That\'s an interesting question! Can you provide more details?',
        'I\'d be happy to help with that. Could you elaborate?',
        'Let me think about that... Can you be more specific?',
        'I understand you\'re asking about that topic. What specific aspect interests you most?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}