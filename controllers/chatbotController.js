const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
// Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithGemini = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: "Gemini API Key is not configured on the server." });
    }
    console.log("Using Gemini API Key (exists):", !!process.env.GEMINI_API_KEY);

    // Reverting to gemini-pro as 1.5-flash might be restricted or require specific API version
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    // For a simple stateless chat (or you can pass history from frontend if needed)
    // Here we just generate content for the single prompt for simplicity, 
    // or start a chat if we want to maintain context in this function scope (but HTTP is stateless).
    // To maintain context properly, the frontend should send the history, 
    // or we store it in DB. For this "customer service" prototype, 
    // we'll treat it as single-turn or simple chat.
    
    // Better: generic prompt context
    const context = `You are a helpful customer service assistant for ZionBazaar, an e-commerce platform. 
    You are polite, professional, and concise. 
    If you don't know an answer, advise the user to contact human support at support@zionbazaar.in.
    User asks: ${message}`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, reply: text });

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    next(error);
  }
};
