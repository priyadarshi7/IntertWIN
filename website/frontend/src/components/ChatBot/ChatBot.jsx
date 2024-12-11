import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initializeChat = () => {
      const starterMessage = {
        role: "assistant",
        content: "Hello! How can I assist you today? You can ask about upcoming contests or your Codeforces profile details.",
      };
      setMessages([starterMessage]);
    };

    initializeChat();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Determine if it's a CP-related query or general AI query
    if (input.toLowerCase().includes("contests")) {
      fetchContests();
    } else if (input.toLowerCase().includes("rating")) {
      const username = input.split(" ").pop();
      fetchUserInfo(username);
    } else {
      fetchAIResponse(input);
    }

    setInput("");
  };

  const fetchContests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contests");
      const contests = response.data.map(
        (contest) => `${contest.name} - ${contest.site} on ${contest.start_time}`
      );
      const aiMessage = {
        role: "assistant",
        content: contests.join("\n"),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching contests:", error.message);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't fetch the contest details.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const fetchUserInfo = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/${username}`
      );
      const user = response.data;
      const aiMessage = {
        role: "assistant",
        content: `Codeforces user ${user.handle} has a rating of ${user.rating} and is ranked ${user.rank}.`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't fetch the user details.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const fetchAIResponse = async (query) => {
    try {
      const response = await axios.post("http://localhost:5000/api/ai", {
        query,
      });
      const aiMessage = { role: "assistant", content: response.data.ai };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error.message);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process your query.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          zIndex: "10000"
        }}
      >
        💬
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: "10000"
          }}
        >
          <div
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "15px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            IntertWIN Chatbot
          </div>
          <div style={{ flex: 1, padding: "15px", overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  margin: "10px 0",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    borderRadius: "15px",
                    background: msg.role === "user" ? "#007bff" : "#f1f1f1",
                    color: msg.role === "user" ? "#fff" : "#000",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", padding: "10px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "10px", borderRadius: "5px" }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "10px",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
