require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            "https://api.groq.com/v1/chat/completions",
            {
                model: "groq-llama3-8b",
                messages: [{ role: "user", content: message }],
                temperature: 0.7,
                max_tokens: 200,
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Groq API Response:", response.data);  // Debugging log

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error calling Groq API:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || "Failed to fetch response from AI" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
