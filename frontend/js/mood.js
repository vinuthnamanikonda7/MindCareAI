// ============================================
// MindCare AI - Mood Journal
// Complete Replacement mood.js
// ============================================

console.log("MOOD.JS LOADED");


// ============================================
// CONFIGURATION
// ============================================

const MOOD_ANALYZE_URL =
    "http://localhost:5000/api/ai/analyze";

const MOOD_STORAGE_KEY =
    "mindcare_mood_history";


// ============================================
// MOODS
// ============================================

const MOODS = [
    {
        name: "Happy",
        emoji: "😊",
        category: "positive"
    },
    {
        name: "Excited",
        emoji: "🤩",
        category: "positive"
    },
    {
        name: "Calm",
        emoji: "😌",
        category: "positive"
    },
    {
        name: "Grateful",
        emoji: "🙏",
        category: "positive"
    },
    {
        name: "Loved",
        emoji: "🥰",
        category: "positive"
    },
    {
        name: "Confident",
        emoji: "😎",
        category: "positive"
    },
    {
        name: "Hopeful",
        emoji: "🌈",
        category: "positive"
    },
    {
        name: "Motivated",
        emoji: "💪",
        category: "positive"
    },
    {
        name: "Peaceful",
        emoji: "🕊️",
        category: "positive"
    },
    {
        name: "Sad",
        emoji: "😢",
        category: "negative"
    },
    {
        name: "Lonely",
        emoji: "🥺",
        category: "negative"
    },
    {
        name: "Angry",
        emoji: "😠",
        category: "negative"
    },
    {
        name: "Stressed",
        emoji: "😣",
        category: "negative"
    },
    {
        name: "Frustrated",
        emoji: "😤",
        category: "negative"
    },
    {
        name: "Overwhelmed",
        emoji: "🥴",
        category: "negative"
    },
    {
        name: "Scared",
        emoji: "😨",
        category: "negative"
    },
    {
        name: "Anxious",
        emoji: "😰",
        category: "negative"
    },
    {
        name: "Worried",
        emoji: "😟",
        category: "negative"
    },
    {
        name: "Confused",
        emoji: "😕",
        category: "neutral"
    },
    {
        name: "Bored",
        emoji: "😐",
        category: "neutral"
    },
    {
        name: "Tired",
        emoji: "😴",
        category: "negative"
    },
    {
        name: "Nervous",
        emoji: "😬",
        category: "negative"
    },
    {
        name: "Disappointed",
        emoji: "😞",
        category: "negative"
    },
    {
        name: "Hopeful",
        emoji: "🌱",
        category: "positive"
    }
];


// ============================================
// SELECTED MOOD
// ============================================

let selectedMood = "";


// ============================================
// GET TOKEN
// ============================================

function getToken() {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken") ||
        ""
    );

}


// ============================================
// LOCAL STORAGE
// ============================================

function getMoodHistory() {

    try {

        const history =
            JSON.parse(
                localStorage.getItem(
                    MOOD_STORAGE_KEY
                ) || "[]"
            );

        return Array.isArray(history)
            ? history
            : [];

    } catch (error) {

        console.error(
            "MOOD HISTORY READ ERROR:",
            error
        );

        return [];

    }

}


function saveMoodHistory(history) {

    try {

        localStorage.setItem(
            MOOD_STORAGE_KEY,
            JSON.stringify(history)
        );

        return true;

    } catch (error) {

        console.error(
            "MOOD HISTORY SAVE ERROR:",
            error
        );

        return false;

    }

}


// ============================================
// SAVE ONE MOOD ENTRY
// ============================================

function saveMoodEntry(entry) {

    const history =
        getMoodHistory();


    history.push(entry);


    // Keep latest 100 entries
    const limitedHistory =
        history.slice(-100);


    saveMoodHistory(
        limitedHistory
    );


    console.log(
        "MOOD SAVED LOCALLY:",
        entry
    );

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;

}


// ============================================
// FIND JOURNAL TEXTAREA
// ============================================

function getJournalElement() {

    const possibleIds = [

        "journalText",

        "journalEntry",

        "moodText",

        "journal",

        "entry",

        "moodEntry",

        "journalTextarea"

    ];


    for (
        const id of possibleIds
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            return element;

        }

    }


    // Fallback: first textarea
    return document.querySelector(
        "textarea"
    );

}


// ============================================
// FIND ANALYZE BUTTON
// ============================================

function getAnalyzeButton() {

    const possibleIds = [

        "analyzeMoodBtn",

        "analyzeBtn",

        "saveMoodBtn",

        "analyzeSaveBtn"

    ];


    for (
        const id of possibleIds
    ) {

        const button =
            document.getElementById(id);


        if (button) {

            return button;

        }

    }


    // Find button by text
    const buttons =
        document.querySelectorAll(
            "button"
        );


    for (
        const button of buttons
    ) {

        const text =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            text.includes("analyze") &&
            text.includes("mood")
        ) {

            return button;

        }

    }


    return null;

}


// ============================================
// FIND RESULT ELEMENT
// ============================================

function getResultElement() {

    const possibleIds = [

        "analysisResult",

        "moodAnalysis",

        "analysis",

        "result",

        "aiResult",

        "moodResult"

    ];


    for (
        const id of possibleIds
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            return element;

        }

    }


    return null;

}


// ============================================
// SHOW STATUS
// ============================================

function showStatus(
    message,
    type = "info"
) {

    let status =
        document.getElementById(
            "moodStatus"
        );


    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.id =
            "moodStatus";

        status.style.marginTop =
            "15px";

        status.style.padding =
            "12px";

        status.style.borderRadius =
            "10px";

        status.style.textAlign =
            "center";

        const button =
            getAnalyzeButton();


        if (button) {

            button.parentNode
                .insertBefore(
                    status,
                    button.nextSibling
                );

        } else {

            document.body.appendChild(
                status
            );

        }

    }


    status.textContent =
        message;


    if (type === "success") {

        status.style.color =
            "#16803c";

        status.style.background =
            "#eaf8ef";

    } else if (type === "error") {

        status.style.color =
            "#c62828";

        status.style.background =
            "#fdecec";

    } else {

        status.style.color =
            "#555";

        status.style.background =
            "#f3f3f3";

    }

}


// ============================================
// SHOW ANALYSIS
// ============================================

function showAnalysis(
    analysis
) {

    const result =
        getResultElement();


    if (!result) {

        console.log(
            "AI ANALYSIS:",
            analysis
        );

        return;

    }


    result.style.display =
        "block";


    result.innerHTML = `
        <div class="mood-analysis-box">

            <h3>
                🧠 AI Mood Analysis
            </h3>

            <p>
                ${escapeHTML(analysis)}
            </p>

        </div>
    `;

}


// ============================================
// GET SELECTED MOOD
// ============================================

function getSelectedMood() {

    if (selectedMood) {

        return selectedMood;

    }


    const selected =
        document.querySelector(
            ".mood-card.selected, " +
            ".mood-option.selected, " +
            ".mood.selected, " +
            "[data-mood].selected"
        );


    if (selected) {

        return (
            selected.dataset.mood ||
            selected.getAttribute(
                "data-mood"
            ) ||
            selected.textContent.trim()
        );

    }


    return "";

}


// ============================================
// SELECT MOOD
// ============================================

function selectMood(
    element
) {

    const allMoodCards =
        document.querySelectorAll(
            "[data-mood]"
        );


    allMoodCards.forEach(
        card => {

            card.classList.remove(
                "selected"
            );

        }
    );


    element.classList.add(
        "selected"
    );


    selectedMood =
        element.dataset.mood ||
        element.getAttribute(
            "data-mood"
        ) ||
        element.textContent.trim();


    console.log(
        "SELECTED MOOD:",
        selectedMood
    );

}


// ============================================
// SET UP MOOD CARDS
// ============================================

function setupMoodCards() {

    const cards =
        document.querySelectorAll(
            "[data-mood]"
        );


    console.log(
        "MOOD CARDS FOUND:",
        cards.length
    );


    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                function () {

                    selectMood(
                        this
                    );

                }
            );

        }
    );


    // Support cards that use
    // mood name text instead of data-mood
    if (cards.length === 0) {

        const possibleCards =
            document.querySelectorAll(
                ".mood-card, .mood-option"
            );


        possibleCards.forEach(
            card => {

                card.addEventListener(
                    "click",
                    function () {

                        const name =
                            this.querySelector(
                                "h3, h4, .mood-name, span"
                            );


                        selectedMood =
                            name
                                ? name.textContent.trim()
                                : this.textContent.trim();


                        possibleCards.forEach(
                            item =>
                                item.classList.remove(
                                    "selected"
                                )
                        );


                        this.classList.add(
                            "selected"
                        );


                        console.log(
                            "SELECTED MOOD:",
                            selectedMood
                        );

                    }
                );

            }
        );

    }

}


// ============================================
// ANALYZE MOOD USING BACKEND
// ============================================

async function analyzeMoodWithAI(
    mood,
    journalText
) {

    console.log(
        "SENDING MOOD ANALYSIS..."
    );


    console.log(
        "MOOD:",
        mood
    );


    console.log(
        "JOURNAL:",
        journalText
    );


    const token =
        getToken();


    const headers = {

        "Content-Type":
            "application/json"

    };


    if (token) {

        headers.Authorization =
            "Bearer " + token;

    }


    const response =
        await fetch(
            MOOD_ANALYZE_URL,
            {

                method: "POST",

                headers: headers,

                body: JSON.stringify({

                    mood: mood,

                    text: journalText,

                    journal: journalText,

                    journalText: journalText

                })

            }
        );


    console.log(
        "MOOD ANALYSIS STATUS:",
        response.status
    );


    if (!response.ok) {

        const errorText =
            await response.text();


        console.error(
            "MOOD AI SERVER ERROR:",
            errorText
        );


        throw new Error(
            "AI analysis failed: " +
            response.status
        );

    }


    const data =
        await response.json();


    console.log(
        "MOOD AI RESPONSE:",
        data
    );


    const analysis =
        data.analysis ||
        data.result ||
        data.response ||
        data.message ||
        data.text ||
        data.data?.analysis ||
        data.data?.result ||
        data.data?.response;


    if (!analysis) {

        throw new Error(
            "AI returned no analysis."
        );

    }


    return analysis;

}


// ============================================
// FALLBACK ANALYSIS
// ============================================

function createFallbackAnalysis(
    mood,
    journalText
) {

    const lower =
        (
            mood +
            " " +
            journalText
        ).toLowerCase();


    if (
        lower.includes("scared") ||
        lower.includes("fear") ||
        lower.includes("afraid")
    ) {

        return (
            "It sounds like you may be experiencing fear or worry. " +
            "Take a moment to breathe slowly and give yourself " +
            "some time to feel safe and comfortable."
        );

    }


    if (
        lower.includes("sad") ||
        lower.includes("lonely") ||
        lower.includes("alone")
    ) {

        return (
            "You seem to be going through a difficult emotional moment. " +
            "Try reaching out to someone you trust and give yourself " +
            "permission to process your feelings."
        );

    }


    if (
        lower.includes("angry") ||
        lower.includes("frustrated")
    ) {

        return (
            "It sounds like something is frustrating you. " +
            "Taking a short break, breathing slowly, and identifying " +
            "what is causing the frustration may help."
        );

    }


    if (
        lower.includes("stress") ||
        lower.includes("overwhelmed") ||
        lower.includes("anxious")
    ) {

        return (
            "You may be feeling stressed or overwhelmed. " +
            "Try focusing on one small task at a time and take " +
            "a few slow breaths."
        );

    }


    if (
        lower.includes("happy") ||
        lower.includes("excited") ||
        lower.includes("grateful")
    ) {

        return (
            "Your entry shows some positive feelings. " +
            "Take a moment to appreciate what is going well " +
            "and continue the activities that support your wellbeing."
        );

    }


    return (
        "Thank you for sharing how you feel. " +
        "Your mood has been saved. Keep checking in with yourself " +
        "and notice how your emotions change over time."
    );

}


// ============================================
// ANALYZE AND SAVE MOOD
// ============================================

async function analyzeAndSaveMood() {

    const journalElement =
        getJournalElement();


    const button =
        getAnalyzeButton();


    if (!journalElement) {

        showStatus(
            "Journal text area not found.",
            "error"
        );

        return;

    }


    const journalText =
        journalElement.value.trim();


    const mood =
        getSelectedMood();


    if (!mood) {

        showStatus(
            "Please select a mood first.",
            "error"
        );

        return;

    }


    if (!journalText) {

        showStatus(
            "Please write something about your day.",
            "error"
        );

        return;

    }


    if (button) {

        button.disabled =
            true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "Analyzing...";

    }


    showStatus(
        "Analyzing your mood...",
        "info"
    );


    let analysis = "";

    let aiWorked = true;


    try {

        analysis =
            await analyzeMoodWithAI(
                mood,
                journalText
            );


    } catch (error) {

        aiWorked = false;


        console.error(
            "AI ANALYSIS ERROR:",
            error
        );


        // Important:
        // Save the mood even when AI fails.

        analysis =
            createFallbackAnalysis(
                mood,
                journalText
            );

    }


    // ========================================
    // SAVE MOOD LOCALLY
    // ========================================

    const entry = {

        id:
            Date.now(),

        mood:
            mood,

        journal:
            journalText,

        analysis:
            analysis,

        aiAnalyzed:
            aiWorked,

        date:
            new Date().toISOString(),

        timestamp:
            Date.now()

    };


    saveMoodEntry(
        entry
    );


    // ========================================
    // DISPLAY RESULT
    // ========================================

    showAnalysis(
        analysis
    );


    if (aiWorked) {

        showStatus(
            "Mood analyzed and saved successfully.",
            "success"
        );

    } else {

        showStatus(
            "Mood saved successfully. AI analysis was temporarily unavailable, so a basic analysis was provided.",
            "info"
        );

    }


    // Update dashboard data
    updateDashboardMoodData();


    if (button) {

        button.disabled =
            false;

        button.textContent =
            button.dataset.originalText ||
            "Analyze & Save Mood";

    }

}


// ============================================
// DISPLAY MOOD HISTORY
// ============================================

function loadMoodHistory() {

    const history =
        getMoodHistory();


    console.log(
        "MOOD HISTORY:",
        history
    );


    // Try multiple possible history containers

    const historyContainer =
        document.getElementById(
            "moodHistory"
        ) ||
        document.getElementById(
            "historyContainer"
        ) ||
        document.getElementById(
            "moodHistoryContainer"
        );


    if (!historyContainer) {

        return;

    }


    historyContainer.innerHTML = "";


    if (history.length === 0) {

        historyContainer.innerHTML = `
            <div class="empty-history">
                <div style="font-size:40px;">
                    📝
                </div>

                <h3>
                    No mood entries yet
                </h3>

                <p>
                    Your saved moods will appear here.
                </p>
            </div>
        `;

        return;

    }


    const recent =
        history
            .slice()
            .reverse()
            .slice(0, 20);


    recent.forEach(
        entry => {

            const date =
                new Date(
                    entry.date
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "mood-history-card";


            card.innerHTML = `
                <div class="history-header">

                    <strong>
                        ${escapeHTML(
                            entry.mood
                        )}
                    </strong>

                    <span>
                        ${date.toLocaleDateString()}
                    </span>

                </div>

                <p>
                    ${escapeHTML(
                        entry.journal
                    )}
                </p>

                ${
                    entry.analysis
                        ? `
                        <div class="history-analysis">
                            <strong>
                                AI Insight:
                            </strong>

                            ${escapeHTML(
                                entry.analysis
                            )}
                        </div>
                        `
                        : ""
                }

            `;


            historyContainer.appendChild(
                card
            );

        }
    );

}


// ============================================
// DELETE ALL MOOD HISTORY
// ============================================

function clearMoodHistory() {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete all your mood history?"
        );


    if (!confirmDelete) {

        return;

    }


    localStorage.removeItem(
        MOOD_STORAGE_KEY
    );


    loadMoodHistory();


    updateDashboardMoodData();


    showStatus(
        "Mood history cleared.",
        "success"
    );

}


// ============================================
// DASHBOARD MOOD DATA
// ============================================

function getDashboardMoodData() {

    const history =
        getMoodHistory();


    const recent =
        history.slice(-7);


    const moodCounts = {};


    recent.forEach(
        entry => {

            const mood =
                entry.mood ||
                "Unknown";


            moodCounts[mood] =
                (moodCounts[mood] || 0) + 1;

        }
    );


    let mostCommonMood =
        "No data";


    let highest =
        0;


    Object.entries(
        moodCounts
    ).forEach(
        ([mood, count]) => {

            if (count > highest) {

                highest =
                    count;

                mostCommonMood =
                    mood;

            }

        }
    );


    return {

        totalEntries:
            history.length,

        recentEntries:
            recent.length,

        moodCounts:
            moodCounts,

        mostCommonMood:
            mostCommonMood,

        entries:
            recent

    };

}


// ============================================
// MAKE DASHBOARD DATA AVAILABLE
// ============================================

function updateDashboardMoodData() {

    const data =
        getDashboardMoodData();


    localStorage.setItem(
        "mindcare_dashboard_mood_data",
        JSON.stringify(data)
    );


    console.log(
        "DASHBOARD MOOD DATA:",
        data
    );


    // Allow dashboard.js to use it
    window.dispatchEvent(
        new CustomEvent(
            "mindcareMoodUpdated",
            {
                detail: data
            }
        )
    );

}


// ============================================
// INITIALIZE
// ============================================

function initializeMoodPage() {

    console.log(
        "INITIALIZING MOOD PAGE..."
    );


    setupMoodCards();


    const analyzeButton =
        getAnalyzeButton();


    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                analyzeAndSaveMood();

            }
        );

    } else {

        console.warn(
            "Analyze & Save Mood button not found."
        );

    }


    loadMoodHistory();


    updateDashboardMoodData();


    // Clear history button
    const clearButton =
        document.getElementById(
            "clearMoodHistoryBtn"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearMoodHistory
        );

    }


    console.log(
        "MOOD PAGE READY"
    );

}


// ============================================
// START
// ============================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMoodPage
    );

} else {

    initializeMoodPage();

}


// ============================================
// GLOBAL FUNCTIONS
// ============================================

window.getMoodHistory =
    getMoodHistory;

window.saveMoodHistory =
    saveMoodHistory;

window.loadMoodHistory =
    loadMoodHistory;

window.clearMoodHistory =
    clearMoodHistory;

window.getDashboardMoodData =
    getDashboardMoodData;

window.analyzeAndSaveMood =
    analyzeAndSaveMood;