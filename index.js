const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/process", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    console.log("Received text:", text);

    const result = await model.generateContent(text);
    const response = await result.response;
    const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    console.log("Generated response:", responseText);

    res.setHeader("Access-Control-Allow-Origin", FRONTEND_ORIGIN); // Ensure response headers allow CORS
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server on the correct port
const PORT = process.env.PORT || 3010; // Ensure you are using the correct port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    
