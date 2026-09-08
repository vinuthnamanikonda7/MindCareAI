const axios = require("axios");

async function testAI() {

    try {

        const response = await axios.post(
            "http://localhost:5000/api/ai/chat",
            {
                message:
                    "Hello MindCare AI. Give me a short positive message for a student."
            }
        );

        console.log("\nAI RESPONSE:");
        console.log(response.data);

    } catch (error) {

        console.log("\nERROR:");

        console.log(
            error.response?.data || error.message
        );
    }
}

testAI();