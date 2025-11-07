import { API_BASE_URL } from "./config.js";

class Chatbot {
    constructor(userid = "2896d2d5-915e-463b-85c5-fe1dcd141486", accountid = "ba67685c-4878-4d5c-bb0f-75bcdb4c763b") {
        this.messages = [];
        this.userid = userid;
        this.accountid = accountid;
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
                body: JSON.stringify({ 
                    query: userMessage, 
                    userid: this.userid, 
                    accountid: this.accountid 
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.answer || "Sorry, I couldn't generate an answer.";
        } catch (error) {
            console.error('Error fetching response:', error);
            // Fallback to local responses if API fails
            return generateBotResponse(userMessage);
        }
    }

    getMessages() {
        return this.messages;
    }
}

export default Chatbot;

function generateBotResponse(userMessage) {
    const responses = {
        'hello': 'Hello! How can I help you with your finances today?',
        'hi': 'Hi there! What would you like to know about your financial data?',
        'how are you': 'I\'m doing well, thank you for asking! How can I assist you with your finances?',
        'balance': 'I can help you check your account balance and recent transactions.',
        'expenses': 'I can analyze your spending patterns and help you track expenses.',
        'income': 'I can help you review your income sources and trends.',
        'budget': 'I can assist you with budgeting and financial planning.',
        'help': 'I can help you with financial analysis, budgeting, expense tracking, and answer questions about your financial data. What would you like to know?'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    const defaultResponses = [
        'That\'s an interesting financial question! Can you provide more details?',
        'I\'d be happy to help with your finances. Could you elaborate?',
        'Let me think about that financial topic... Can you be more specific?',
        'I understand you\'re asking about your finances. What specific aspect interests you most?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}