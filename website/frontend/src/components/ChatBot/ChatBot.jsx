import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const sendMessage = async (userMessage) => {
    const apiKey = "AIzaSyB0s-R5bsbtlJyxnrjyTJrQdDgDmcHzgs4"; // Replace with your actual API key
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey;

    const requestBody = {
      instances: [
        {
          prompt: userMessage,
          temperature: 0.7,
          maxOutputTokens: 100,
        },
      ],
    };

    let retries = 0;
    const maxRetries = 5; // Set a limit to avoid infinite retry loop
    let delay = 1000; // Start with a 1-second delay

    while (retries < maxRetries) {
      try {
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response:', response.data);

        // Extracting the generated text from the response
        if (response.data.predictions && response.data.predictions[0] && response.data.predictions[0].content) {
          return response.data.predictions[0].content;
        } else {
          return "I'm sorry, I didn't understand that.";
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Handle rate limit (status 429)
          const retryAfter = error.response.headers['retry-after'];
          const retryDelay = retryAfter ? parseInt(retryAfter) * 1000 : delay; // Retry after specified time
          console.log(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
          await sleep(retryDelay);
          retries++;
          delay *= 2; // Double the delay for each retry
        } else {
          console.error('Error:', error);
          return 'Sorry, I encountered an error.';
        }
      }
    }

    return 'Sorry, I encountered an issue and could not process your request.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');

    const botResponse = await sendMessage(userMessage);
    setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`} style={{ color: "black" }}>
      <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)} style={{ color: "black", backgroundColor: "#f93f85", fontWeight: "900", fontSize: "20px" }}>
        AI Assistant
      </div>
      {isOpen && (
        <>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBot;
