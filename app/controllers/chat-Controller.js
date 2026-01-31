// const openAI = require('../../config/openai');

// const chatCtlr = {};

// // AI Chatbot
// chatCtlr.askAI = async (req, res) => {
//     const userMessage = req.body;
//     try {
//         // Build a prompt
//         const prompt = `
//         You are a tourism assistant.
//         Rules:
//           - Answer ONLY using the nearby places data provided below.
//           - For each place, explain its information and historical significance based on the given data.
//           - Do NOT add or guess any details that are not present in the data.
//           - If no nearby places are provided, politely say that no nearby tourist places are available.
//         `;
//         // call gpt-4o-mini
//         const response = await axios.post(
//             "https://api.openai.com/v1/chat/completions",
//             {
//                 model: process.env.OPENAI_MODEL || "gpt-4o-mini",
//                 Messages: [{ role: "user", content: prompt }],
//             },
//             {
//                 headers: 
//             },
//         )
//         const aiResponse = response.output_text;
//         res.json({ reply: aiResponse });
//     } catch(err) {
//        console.log(err);
//        res.status(500).json({ error: 'AI request failed' });
//     }
// }

// module.exports = chatCtlr;