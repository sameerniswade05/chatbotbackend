import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"; // Load environment variables
import { fetchSapData } from "./getData.mjs"; // Import the function to fetch data
dotenv.config(); // Initialize environment variables

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Fetch SAP data asynchronously
let sapData = null;

// Function to fetch SAP data before starting the server
const getSapData = async () => {
  sapData = await fetchSapData(); // Fetch data and store it in sapData
};

getSapData(); // Call the function to fetch the data before the server starts

// Log the data to ensure it's fetched
setTimeout(() => {
  console.log("sapData", sapData);
}, 1000);

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

    // Here, combine the received text with the sapData
    // You can structure this however you'd like based on the type of data in sapData
    const prompt = `Given the following SAP data:\n${JSON.stringify(sapData, null, 2)}\n\nPlease generate a response based on this data and the following query: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    console.log("Generated response:", responseText);

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server on the correct port
const PORT = 3011; // Ensure you are using the correct port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
