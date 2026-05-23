const ai = require('../../config/geminiai');

const chatCtlr = {};

// AI Chat
chatCtlr.chat = async(req, res) => {
    const { message, latitude, longitude } = req.body;
    try {
        if(!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }
        const prompt = `
                        You are a Smart Travel & Vehicle Assistant for a vehicle rental app.
                            Your responsibilities:
                              - Suggest nearby tourist places
                              - Recommend suitable vehicles
                              - Estimate travel budget
                              - Plan trips
                              - Answer travel questions
                              - Help users with bookings
                                User Location:
                                    Latitude: ${latitude}
                                    Longitude: ${longitude}
                                      Give short, helpful and user-friendly answers.
                                      User Query: ${message} 
                      `;
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });
        res.status(200).json({
            reply: response.text
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: "Something went wrong!!!"
        });
    }
};

module.exports = chatCtlr;