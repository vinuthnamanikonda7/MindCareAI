const { GoogleGenAI } = require("@google/genai");
const db = require("../config/db");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =====================================
// AI CHATBOT
// =====================================

const chatWithAI = async (req, res) => {
    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",

            contents: `
You are MindCare AI, a supportive mental wellness assistant.

Be empathetic, calm and helpful.

Do not diagnose medical conditions.

If the user appears to be in serious danger,
encourage them to seek professional help.

User message:
${message}
`
        });

        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {

        console.error("Gemini Chat Error:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to connect to Gemini AI"
        });
    }
};


// =====================================
// MOOD ANALYSIS + MYSQL
// =====================================

const analyzeMood = async (req, res) => {

    try {

        const { text, mood } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Journal text is required"
            });
        }


        // TEMPORARY USER ID
        // Later we will get this from login/session
        const userId = 1;


        // =====================================
        // SEND JOURNAL TO GEMINI
        // =====================================

        const prompt = `
You are MindCare AI.

Analyze this user's journal entry.

Selected mood:
${mood || "Not provided"}

Journal entry:
${text}

Return ONLY valid JSON in exactly this format:

{
    "sentiment": "Positive/Negative/Neutral",
    "emotion": "one main emotion",
    "risk_level": "Low/Medium/High",
    "recommendation": "short supportive recommendation"
}

Rules:

- Do not diagnose any medical condition.
- Keep the recommendation supportive.
- Use only Low, Medium, or High for risk_level.
- Do not add markdown.
- Do not add explanations outside the JSON.
`;


        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt

        });


        // =====================================
        // READ GEMINI RESPONSE
        // =====================================

        let aiText = response.text.trim();


        // Remove markdown if Gemini returns it

        aiText = aiText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();


        let analysis;


        try {

            analysis = JSON.parse(aiText);

        } catch (error) {

            console.error(
                "Gemini JSON parsing error:",
                error
            );

            analysis = {

                sentiment: "Neutral",

                emotion: "Unknown",

                risk_level: "Low",

                recommendation:
                    "Take some time to relax and talk to someone you trust if you need support."
            };
        }


        // =====================================
        // SAVE TO MYSQL
        // =====================================

        const sql = `
            INSERT INTO mood_entries
            (
                user_id,
                mood,
                journal_text,
                sentiment,
                emotion,
                risk_level
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;


        db.query(

            sql,

            [
                userId,
                mood,
                text,
                analysis.sentiment,
                analysis.emotion,
                analysis.risk_level
            ],

            (err, result) => {

                if (err) {

                    console.error(
                        "MySQL Insert Error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "AI analysis completed but could not save to database."
                    });
                }


                console.log(
                    "Mood saved to MySQL. ID:",
                    result.insertId
                );


                // =====================================
                // SEND RESULT TO FRONTEND
                // =====================================

                res.json({

                    success: true,

                    message:
                        "Mood analyzed and saved successfully.",

                    analysis: analysis,

                    entryId:
                        result.insertId
                });

            }
        );


    } catch (error) {

        console.error(
            "Mood Analysis Error:"
        );

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Unable to analyze mood."
        });
    }
};


module.exports = {

    chatWithAI,

    analyzeMood

};