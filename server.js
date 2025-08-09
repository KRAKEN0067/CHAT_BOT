// server.js

const express = require("express");
const path = require("path");
require("dotenv").config();

// Use 'require' to import the class
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get the API key from the .env file
const api_key = process.env.API_KEY;
if (!api_key) {
  throw new Error("API_KEY not found in .env file");
}

// FIX 1: Use the 'new' keyword to instantiate the class
const genAI = new GoogleGenerativeAI(api_key);

async function getAiResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error in getAiResponse:", error);
    return "Sorry, I couldn't process that request.";
  }
}

const app = express();
const port = process.env.PORT || 3000; // Added a fallback port

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/generate', async (req, res) => {
  const userPrompt = req.query.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    // FIX 2: Corrected the variable name from 'usePrompt' to 'userPrompt'
    const aiResponse = await getAiResponse(userPrompt);

    res.json({ message: aiResponse });
  } catch (error) {
    console.error("Server error on /api/generate:", error);
    res.status(500).json({ error: 'failed to generate response from AI' });
  }
});

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
