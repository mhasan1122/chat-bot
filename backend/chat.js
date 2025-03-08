// chat.js
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq SDK with API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-70b-8192", // Use a valid Groq model (check docs)
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response";
    res.json({ reply });
  } catch (error) {
    console.error("Error calling Groq API:", error.message);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});