const db = require("../config/db");

exports.addMood = (req, res) => {

    const {
        user_id,
        mood,
        journal_text
    } = req.body;

    const sql = `
        INSERT INTO mood_entries
        (user_id, mood, journal_text)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, mood, journal_text],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Unable to save mood"
                });
            }

            res.json({
                message: "Mood saved successfully"
            });
        }
    );
};