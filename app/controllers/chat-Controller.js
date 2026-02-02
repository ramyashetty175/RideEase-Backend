// const openAI = require('../../config/openai');

// const chatCtlr = {};

// // AI Chatbot
// chatCtlr.askAI = async (req, res) => {
//     const { message, nearbyPlaces } = req.body;
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




const axios = require("axios");

const openAI = require('../../config/openai');

const chatCtlr = {};

chatCtlr.getNearbyTourismSuggestions = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude required"
      });
    }

    const query = `
    [out:json];
    (
      node["tourism"="attraction"](around:8000,${lat},${lng});
      node["historic"](around:8000,${lat},${lng});
      node["amenity"="place_of_worship"](around:30000,${lat},${lng});
    );
    out 5;
    `;

    const osmRes = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const places = osmRes.data.elements
      .filter(p => p.tags?.name)
      .map(p => ({
        name: p.tags.name,
        category:
          p.tags.tourism ||
          p.tags.historic ||
          p.tags.amenity ||
          "place"
      }));

    if (places.length === 0) {
      return res.json({
        success: true,
        places: [],
        recommendation: "No nearby tourism places found."
      });
    }

    const prompt = `
You are a tourism recommendation assistant.

RULES:
- Use ONLY the places provided.
- Do NOT add new places.
- Keep it short and tourist-friendly.

PLACES:
${JSON.stringify(places)}

TASK:
Write a short recommendation paragraph.
`;
    const aiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_SECRET_KEY}`
        }
      }
    );

    res.json({
      success: true,
      places,
      recommendation: aiRes.data.choices[0].message.content
    });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby places"
    });
  }
};

module.exports = chatCtlr;