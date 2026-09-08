const express = require("express");

const router = express.Router();

const moodController =
    require("../controllers/moodController");

router.post(
    "/add",
    moodController.addMood
);

module.exports = router;