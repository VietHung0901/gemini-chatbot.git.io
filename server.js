const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GOOGLE_API_KEY}`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    });

    const botMessage = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    res.json({ message: botMessage });
  } catch (error) {
    console.error("AI response failed:", error.response?.data || error.message);
    res.status(500).json({ error: "AI response failed" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
