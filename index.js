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
  console.log("Fetched SAP Data:", sapData);
};

getSapData(); // Call the function to fetch the data before the server starts

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

    // Assuming sapData has candidateData and jobProfileData
    const { candidateData, jobProfileData } = sapData || {}; // Destructure candidateData and jobProfileData

    // Log the fetched data
    console.log("Candidate Data:", candidateData);
    console.log("Job Profile Data:", jobProfileData);

    // Check if the required data exists
    if (!candidateData || !jobProfileData) {
      return res.status(400).json({ error: "Missing SAP data" });
    }

    // Here, combine the received text with the sapData
    const prompt = `
    Given the following SAP data:
    Candidate Data: ${JSON.stringify(candidateData, null, 2)}
    Job Profile Data: ${JSON.stringify(jobProfileData, null, 2)}
    
    Please generate a response based on this data and the following query: ${text}
    `;

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
const PORT = process.env.PORT || 3000; // Ensure you are using the correct port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
