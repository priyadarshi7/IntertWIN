import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (userMessage) => {
    const apiKey = "AIzaSyCrK-JF78l1pN0wTR8WK-fOKG0OdRln8V8"; // Replace with your actual API key
    const apiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
      apiKey;
  
    const requestBody = {
      contents: [
        {
          parts: [{ text: userMessage }],
        },
      ],
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the full response for debugging
      console.log('API Response:', response.data);
  
      // Check if candidates and parts are defined and contain expected data
      if (response.data.candidates && response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text; // Extract the response text
      } else {
        return "I'm sorry, I didn't understand that.";
      }
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, I encountered an error.';
    }
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
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`} style={{color:"black"}}>
      <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}style={{color:"black",backgroundColor:"#f93f85",fontWeight:"900",fontSize:"20px"}}>
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
