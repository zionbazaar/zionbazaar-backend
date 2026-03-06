require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // This is a workaround to "list models" by trying a known valid one or checking error details
    // The client library doesn't always expose listModels directly easily in all versions without setup.
    // Let's try to generate with 'gemini-1.5-flash' which SHOULD work.
    
    console.log("Using Key:", process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success! gemini-1.5-flash is working.");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message);
    
    // Try gemini-pro as backup
    try {
        console.log("Trying gemini-pro...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        await model2.generateContent("Hello");
        console.log("Success! gemini-pro is working.");
    } catch (e2) {
        console.error("Error with gemini-pro:", e2.message);
    }
  }
}

checkModels();
