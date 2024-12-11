const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Route for AI-based responses (existing functionality)
app.post("/api/ai", async (req, res) => {
  const { query } = req.body;
  try {
    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: query }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`, // Replace with your Groq API key
        },
      }
    );
    res.json({ ai: aiResponse.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to process AI query" });
  }
});

// Route for CP Contest Details
app.get("/api/contests", async (req, res) => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const contests = response.data.result.map(contest => ({
      name: contest.name,
      site: "Codeforces",
      start_time: new Date(contest.startTimeSeconds * 1000).toLocaleString()
    }));
    res.json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error.message);
    res.status(500).json({ error: "Failed to fetch contest details" });
  }
});

// Route for CP User Info (Codeforces)
app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    res.json(response.data.result[0]);
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
