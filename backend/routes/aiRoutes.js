const express = require("express");

const router = express.Router();

const {
    chatWithAI,
    analyzeMood
} = require("../controllers/aiController");


// Chatbot
router.post("/chat", chatWithAI);


// Mood / journal analysis
router.post("/analyze", analyzeMood);


module.exports = router;