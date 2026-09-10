// ============================================================
// MindCare AI - Mood Questionnaire
// Complete Replacement mood.js
// ============================================================

console.log("MINDCARE MOOD.JS LOADED");

// ============================================================
// CONFIGURATION
// ============================================================

const MOOD_ANALYZE_URL =
    "http://localhost:5000/api/ai/analyze";

const MOOD_STORAGE_KEY =
    "mindcare_mood_history";


// ============================================================
// MOOD QUESTION BANK
// ============================================================
//
// These are screening-style questions organized by emotional
// domain. They are NOT presented as exact questions from a
// validated psychological scale.
//
// Replace/verify these with your psychologist-approved scale
// questions before describing the questionnaire as a validated
// clinical scale.
// ============================================================

const QUESTION_BANK = {

    Happy: [
        "How often have you felt positive about your daily life?",
        "How often have you felt satisfied with yourself recently?",
        "How often have you enjoyed activities that are normally important to you?",
        "How often have you felt hopeful about the near future?",
        "How often have you felt emotionally balanced?"
    ],

    Excited: [
        "How often have you recently felt energetic and enthusiastic?",
        "How often have you looked forward to activities or events?",
        "How often have you felt motivated to do things you enjoy?",
        "How often have you felt unusually restless or unable to slow down?",
        "How well have you been able to manage your excitement?"
    ],

    Calm: [
        "How often have you felt relaxed during the day?",
        "How often have you been able to calm yourself when something worries you?",
        "How often have you felt comfortable with your current situation?",
        "How often have you been able to focus without feeling overwhelmed?",
        "How often have you felt emotionally peaceful?"
    ],

    Loved: [
        "How often have you felt cared for by people around you?",
        "How often have you felt emotionally connected to someone?",
        "How comfortable are you expressing your feelings to people you trust?",
        "How often have you felt that you belong?",
        "How often have you received emotional support when you needed it?"
    ],

    Grateful: [
        "How often have you noticed positive things in your life?",
        "How often have you appreciated people who support you?",
        "How often have you felt thankful for your current circumstances?",
        "How often have you focused on things that are going well?",
        "How often does gratitude improve your mood?"
    ],

    Confident: [
        "How confident have you felt about handling your daily responsibilities?",
        "How often have you believed that you can solve problems you face?",
        "How often have you felt comfortable making decisions?",
        "How often have you felt capable of dealing with challenges?",
        "How often have you felt good about yourself?"
    ],

    Neutral: [
        "How would you describe your emotional state during most of the day?",
        "How often have your emotions felt stable?",
        "How often have you felt neither particularly positive nor negative?",
        "How well have you been managing your normal responsibilities?",
        "How satisfied are you with your current emotional state?"
    ],

    Tired: [
        "How often have you felt physically or mentally tired?",
        "How often has tiredness made it difficult to complete your normal activities?",
        "How often have you had difficulty getting enough rest?",
        "How often have you lacked energy during the day?",
        "How often has tiredness affected your concentration?"
    ],

    Bored: [
        "How often have you felt uninterested in your usual activities?",
        "How often have you struggled to find something enjoyable to do?",
        "How often have you felt that your daily routine is repetitive?",
        "How often have you lacked motivation to start activities?",
        "How often have you wished you had more meaningful activities?"
    ],

    Confused: [
        "How often have you found it difficult to make decisions?",
        "How often have your thoughts felt unclear or disorganized?",
        "How often have you struggled to understand what you are feeling?",
        "How often have you found it difficult to concentrate?",
        "How often have you felt uncertain about what to do next?"
    ],

    Worried: [
        "How often have you found yourself worrying about different things?",
        "How difficult has it been to control your worries?",
        "How often have worries affected your concentration?",
        "How often have you expected something to go wrong?",
        "How often have your worries affected your daily activities?"
    ],

    Anxious: [
        "How often have you felt nervous, anxious, or on edge?",
        "How often have you found it difficult to control anxious thoughts?",
        "How often have you felt restless or unable to relax?",
        "How often have anxiety or nervousness affected your concentration?",
        "How often have you avoided activities because you felt anxious?"
    ],

    Sad: [
        "How often have you felt sad or emotionally low?",
        "How often have you lost interest in activities you normally enjoy?",
        "How often have you felt that everyday activities require extra effort?",
        "How often have you felt discouraged about the future?",
        "How often has sadness affected your daily responsibilities?"
    ],

    Lonely: [
        "How often have you felt lonely even when other people were around?",
        "How often have you felt that you do not have someone to talk to?",
        "How often have you felt disconnected from people around you?",
        "How often have you wished you had stronger social connections?",
        "How often has loneliness affected your mood?"
    ],

    Angry: [
        "How often have you felt easily irritated?",
        "How often have you found it difficult to control your anger?",
        "How often have small problems made you unusually angry?",
        "How often has anger affected your communication with others?",
        "How often have you regretted something you said or did while angry?"
    ],

    Stressed: [
        "How often have you felt unable to manage everything you need to do?",
        "How often have you felt that demands were building up around you?",
        "How often have you found it difficult to relax because of responsibilities?",
        "How often has stress affected your sleep or concentration?",
        "How often have you felt that you were under too much pressure?"
    ],

    Frustrated: [
        "How often have things not gone the way you expected?",
        "How often have you become irritated when facing obstacles?",
        "How difficult has it been to remain patient when problems occur?",
        "How often has frustration affected your interactions with others?",
        "How often have you found it difficult to move on after a frustrating event?"
    ],

    Overwhelmed: [
        "How often have you felt that there were too many things to handle?",
        "How often have you struggled to decide what to do first?",
        "How often have your responsibilities felt difficult to manage?",
        "How often have you felt mentally exhausted by your situation?",
        "How often have you felt unable to take a break from your concerns?"
    ]

};


// ============================================================
// ANSWER SCALE
// ============================================================

const ANSWERS = [
    {
        text: "Not at all",
        value: 0
    },
    {
        text: "Several days / Rarely",
        value: 1
    },
    {
        text: "More than half the days / Sometimes",
        value: 2
    },
    {
        text: "Nearly every day / Often",
        value: 3
    }
];


// ============================================================
// VARIABLES
// ============================================================

let selectedMood = "";

let currentQuestion = 0;

let questionAnswers = [];

let currentQuestions = [];


// ============================================================
// TOKEN
// ============================================================

function getToken() {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken") ||
        ""
    );

}


// ============================================================
// DOM HELPERS
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}


// ============================================================
// STATUS
// ============================================================

function showStatus(message, type = "info") {

    const element = getElement("message");

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className = "message";

    if (type === "success") {
        element.classList.add("success");
    }

    if (type === "error") {
        element.classList.add("error");
    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = String(value ?? "");

    return div.innerHTML;

}


// ============================================================
// SELECT MOOD
// ============================================================

function selectMood(element) {

    const cards =
        document.querySelectorAll("[data-mood]");

    cards.forEach(card => {
        card.classList.remove("selected");
    });

    element.classList.add("selected");

    selectedMood =
        element.dataset.mood;

    console.log(
        "SELECTED MOOD:",
        selectedMood
    );

    startQuestionnaire(selectedMood);

}


// ============================================================
// SETUP MOOD CARDS
// ============================================================

function setupMoodCards() {

    const cards =
        document.querySelectorAll("[data-mood]");

    console.log(
        "MOOD CARDS FOUND:",
        cards.length
    );

    cards.forEach(card => {

        card.addEventListener(
            "click",
            function() {

                selectMood(this);

            }
        );

    });

}


// ============================================================
// START QUESTIONNAIRE
// ============================================================

function startQuestionnaire(mood) {

    currentQuestions =
        QUESTION_BANK[mood] ||
        QUESTION_BANK.Neutral;

    currentQuestion = 0;

    questionAnswers =
        new Array(
            currentQuestions.length
        ).fill(null);

    const questionnaire =
        getElement("questionnaire");

    const journalSection =
        getElement("journalSection");

    questionnaire.classList.add("show");

    journalSection.classList.remove("show");

    getElement("questionnaireTitle")
        .textContent =
        `Let's understand your ${mood.toLowerCase()} mood`;

    renderQuestion();

    questionnaire.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ============================================================
// RENDER QUESTION
// ============================================================

function renderQuestion() {

    const total =
        currentQuestions.length;

    const question =
        currentQuestions[currentQuestion];

    getElement("questionNumber")
        .textContent =
        `QUESTION ${currentQuestion + 1}`;

    getElement("questionCount")
        .textContent =
        `Question ${currentQuestion + 1} of ${total}`;

    getElement("questionText")
        .textContent =
        question;

    const progress =
        ((currentQuestion + 1) / total) * 100;

    getElement("progressBar")
        .style.width =
        `${progress}%`;

    const answerContainer =
        getElement("answerOptions");

    answerContainer.innerHTML = "";

    ANSWERS.forEach((answer, index) => {

        const label =
            document.createElement("label");

        label.className =
            "answer-option";

        if (
            questionAnswers[currentQuestion] ===
            answer.value
        ) {
            label.classList.add("selected");
        }

        label.innerHTML = `
            <input
                type="radio"
                name="questionAnswer"
                value="${answer.value}"
                ${questionAnswers[currentQuestion] === answer.value ? "checked" : ""}
            >

            <span>
                ${escapeHTML(answer.text)}
            </span>
        `;

        const radio =
            label.querySelector("input");

        radio.addEventListener(
            "change",
            function() {

                questionAnswers[currentQuestion] =
                    Number(this.value);

                document
                    .querySelectorAll(".answer-option")
                    .forEach(option => {
                        option.classList.remove(
                            "selected"
                        );
                    });

                label.classList.add("selected");

            }
        );

        answerContainer.appendChild(label);

    });

    const previousBtn =
        getElement("previousBtn");

    const nextBtn =
        getElement("nextBtn");

    if (currentQuestion === 0) {

        previousBtn.style.visibility =
            "hidden";

    } else {

        previousBtn.style.visibility =
            "visible";

    }

    if (
        currentQuestion ===
        total - 1
    ) {

        nextBtn.textContent =
            "Finish Questions ✓";

    } else {

        nextBtn.textContent =
            "Next →";

    }

}


// ============================================================
// NEXT QUESTION
// ============================================================

function nextQuestion() {

    if (
        questionAnswers[currentQuestion] ===
        null
    ) {

        alert(
            "Please select an answer before continuing."
        );

        return;

    }

    if (
        currentQuestion <
        currentQuestions.length - 1
    ) {

        currentQuestion++;

        renderQuestion();

        return;

    }

    finishQuestionnaire();

}


// ============================================================
// PREVIOUS QUESTION
// ============================================================

function previousQuestion() {

    if (currentQuestion <= 0) {
        return;
    }

    currentQuestion--;

    renderQuestion();

}


// ============================================================
// FINISH QUESTIONNAIRE
// ============================================================

function finishQuestionnaire() {

    console.log(
        "QUESTIONNAIRE ANSWERS:",
        questionAnswers
    );

    const questionnaire =
        getElement("questionnaire");

    const journalSection =
        getElement("journalSection");

    questionnaire.classList.remove("show");

    journalSection.classList.add("show");

    journalSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    showStatus(
        "Questions completed. You can now tell us more about your day.",
        "success"
    );

}


// ============================================================
// CALCULATE SCORE
// ============================================================

function calculateScore() {

    return questionAnswers.reduce(
        (total, value) => {

            return total +
                (Number(value) || 0);

        },
        0
    );

}


// ============================================================
// CALCULATE WELLNESS LEVEL
// ============================================================

function calculateWellnessLevel() {

    const score =
        calculateScore();

    const maximum =
        currentQuestions.length * 3;

    const percentage =
        maximum === 0
            ? 0
            : (score / maximum) * 100;


    /*
        This is a project-level screening indicator,
        NOT a clinical diagnostic scale.
    */

    if (percentage <= 25) {

        return {
            level: "Low",
            className: "risk-low"
        };

    }

    if (percentage <= 50) {

        return {
            level: "Moderate",
            className: "risk-moderate"
        };

    }

    if (percentage <= 75) {

        return {
            level: "High",
            className: "risk-high"
        };

    }

    return {
        level: "Critical",
        className: "risk-critical"
    };

}


// ============================================================
// JOURNAL ELEMENT
// ============================================================

function getJournalElement() {

    return (
        getElement("journalText") ||
        getElement("journalEntry") ||
        getElement("moodText") ||
        document.querySelector("textarea")
    );

}


// ============================================================
// AI ANALYSIS
// ============================================================

async function analyzeMoodWithAI(
    mood,
    journalText
) {

    const token =
        getToken();

    const score =
        calculateScore();

    const wellness =
        calculateWellnessLevel();

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

                    journalText: journalText,

                    questionnaireAnswers:
                        questionAnswers,

                    questionnaireQuestions:
                        currentQuestions,

                    questionnaireScore:
                        score,

                    wellnessLevel:
                        wellness.level

                })
            }
        );


    console.log(
        "AI RESPONSE STATUS:",
        response.status
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            "AI SERVER ERROR:",
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
        "AI DATA:",
        data
    );

    return data;

}


// ============================================================
// FALLBACK ANALYSIS
// ============================================================

function createFallbackAnalysis(
    mood,
    wellness
) {

    const messages = {

        Happy:
            "Your responses suggest positive emotional wellbeing. Continue activities that make you feel happy and connected.",

        Excited:
            "You appear to be experiencing positive energy and enthusiasm. Remember to maintain a healthy balance between activity and rest.",

        Calm:
            "Your responses suggest a relatively calm emotional state. Continue using activities that help you relax.",

        Loved:
            "Your responses indicate that connection and emotional support may be positive parts of your current wellbeing.",

        Grateful:
            "Your responses suggest positive reflection and appreciation. Continuing gratitude activities may support your wellbeing.",

        Confident:
            "Your responses suggest positive self-confidence. Continue setting realistic goals and recognizing your achievements.",

        Neutral:
            "Your responses suggest a relatively neutral emotional state. Continue checking in with yourself regularly.",

        Tired:
            "Your responses suggest that tiredness may be affecting your wellbeing. Consider rest, regular sleep and manageable daily activities.",

        Bored:
            "Your responses suggest reduced interest or motivation. Try introducing small meaningful or enjoyable activities into your routine.",

        Confused:
            "Your responses suggest some uncertainty or difficulty organizing thoughts. Taking one small step at a time may help.",

        Worried:
            "Your responses suggest that worry may be affecting you. Slow breathing, writing down concerns and talking to someone you trust may help.",

        Anxious:
            "Your responses suggest that anxiety may be affecting your wellbeing. Consider calming activities and speaking with someone you trust.",

        Sad:
            "Your responses suggest that you may be experiencing sadness. Consider connecting with someone you trust and giving yourself time to process your feelings.",

        Lonely:
            "Your responses suggest feelings of loneliness. Reaching out to a trusted friend, family member or supportive person may help.",

        Angry:
            "Your responses suggest that anger or irritation may be affecting you. Taking a pause before reacting can help create space to respond calmly.",

        Stressed:
            "Your responses suggest that stress may be affecting your wellbeing. Breaking responsibilities into smaller tasks and taking short breaks may help.",

        Frustrated:
            "Your responses suggest that frustration may be affecting you. Taking a short break and identifying what you can control may help.",

        Overwhelmed:
            "Your responses suggest that you may be feeling overloaded. Focus on one manageable task at a time and allow yourself time to rest."

    };


    return (
        messages[mood] ||
        "Thank you for sharing how you feel. Continue checking in with yourself regularly."
    );

}


// ============================================================
// EXTRACT AI RESPONSE
// ============================================================

function extractAIData(data) {

    const analysis =
        data?.analysis ||
        data?.result ||
        data?.response ||
        data?.message ||
        data?.text ||
        data?.data?.analysis ||
        data?.data?.result ||
        data?.data?.response ||
        "";

    const emotion =
        data?.emotion ||
        data?.data?.emotion ||
        "Not available";

    const sentiment =
        data?.sentiment ||
        data?.data?.sentiment ||
        "Not available";

    const risk =
        data?.riskLevel ||
        data?.risk ||
        data?.data?.riskLevel ||
        data?.data?.risk ||
        "";

    return {
        analysis,
        emotion,
        sentiment,
        risk
    };

}


// ============================================================
// SAVE LOCAL HISTORY
// ============================================================

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
            "HISTORY READ ERROR:",
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
            "HISTORY SAVE ERROR:",
            error
        );

        return false;

    }

}


// ============================================================
// SAVE ONE ENTRY
// ============================================================

function saveMoodEntry(entry) {

    const history =
        getMoodHistory();

    history.push(entry);

    const limitedHistory =
        history.slice(-100);

    saveMoodHistory(
        limitedHistory
    );

}


// ============================================================
// DISPLAY RESULT
// ============================================================

function showResult(
    mood,
    score,
    wellness,
    aiData
) {

    const result =
        getElement("result");

    result.classList.add("show");

    getElement("resultMood")
        .textContent =
        mood;

    getElement("resultScore")
        .textContent =
        `${score} / ${currentQuestions.length * 3}`;

    const riskElement =
        getElement("resultRisk");

    riskElement.textContent =
        aiData.risk ||
        wellness.level;

    riskElement.className =
        "result-value " +
        wellness.className;


    getElement("resultEmotion")
        .textContent =
        aiData.emotion ||
        "Not available";

    getElement("resultSentiment")
        .textContent =
        aiData.sentiment ||
        "Not available";

    getElement("aiInsight")
        .innerHTML = `
            <strong>MindCare AI Insight:</strong>
            <p style="margin-top:8px;">
                ${escapeHTML(
                    aiData.analysis
                )}
            </p>
        `;

}


// ============================================================
// ANALYZE AND SAVE
// ============================================================

async function analyzeAndSaveMood() {

    if (!selectedMood) {

        showStatus(
            "Please select a mood first.",
            "error"
        );

        return;

    }


    if (
        questionAnswers.length === 0 ||
        questionAnswers.some(
            answer => answer === null
        )
    ) {

        showStatus(
            "Please complete all questionnaire questions.",
            "error"
        );

        return;

    }


    const journalElement =
        getJournalElement();

    const journalText =
        journalElement
            ? journalElement.value.trim()
            : "";


    const button =
        getElement("analyzeBtn");

    if (button) {

        button.disabled = true;

        button.textContent =
            "Analyzing...";

    }


    showStatus(
        "MindCare AI is analyzing your responses...",
        "info"
    );


    const score =
        calculateScore();

    const wellness =
        calculateWellnessLevel();


    let aiData = {

        analysis:
            createFallbackAnalysis(
                selectedMood,
                wellness
            ),

        emotion:
            selectedMood,

        sentiment:
            wellness.level,

        risk:
            wellness.level

    };


    let aiWorked = false;


    try {

        const backendData =
            await analyzeMoodWithAI(
                selectedMood,
                journalText
            );

        const extracted =
            extractAIData(
                backendData
            );


        if (extracted.analysis) {

            aiData = {

                analysis:
                    extracted.analysis,

                emotion:
                    extracted.emotion,

                sentiment:
                    extracted.sentiment,

                risk:
                    extracted.risk ||
                    wellness.level

            };

            aiWorked = true;

        }

    } catch (error) {

        console.error(
            "AI ANALYSIS ERROR:",
            error
        );

    }


    // ========================================================
    // SAVE ENTRY
    // ========================================================

    const entry = {

        id:
            Date.now(),

        mood:
            selectedMood,

        journal:
            journalText,

        questions:
            currentQuestions,

        answers:
            questionAnswers,

        questionnaireScore:
            score,

        maximumScore:
            currentQuestions.length * 3,

        wellnessLevel:
            wellness.level,

        analysis:
            aiData.analysis,

        emotion:
            aiData.emotion,

        sentiment:
            aiData.sentiment,

        aiAnalyzed:
            aiWorked,

        date:
            new Date().toISOString(),

        timestamp:
            Date.now()

    };


    saveMoodEntry(entry);


    // ========================================================
    // DISPLAY
    // ========================================================

    showResult(
        selectedMood,
        score,
        wellness,
        aiData
    );


    if (aiWorked) {

        showStatus(
            "Mood analyzed and saved successfully.",
            "success"
        );

    } else {

        showStatus(
            "Mood saved successfully. Basic wellbeing analysis was used because AI was unavailable.",
            "success"
        );

    }


    updateDashboardMoodData();

    loadMoodHistory();


    if (button) {

        button.disabled = false;

        button.textContent =
            "🧠 Analyze & Save Mood";

    }

}


// ============================================================
// HISTORY DISPLAY
// ============================================================

function loadMoodHistory() {

    const history =
        getMoodHistory();

    const container =
        getElement("moodHistory");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (history.length === 0) {

        container.innerHTML = `
            <div class="empty">
                📝
                <br><br>
                No mood entries yet.
                <br>
                Your saved moods will appear here.
            </div>
        `;

        return;

    }


    const recent =
        history
            .slice()
            .reverse()
            .slice(0, 20);


    recent.forEach(entry => {

        const date =
            new Date(
                entry.date
            );


        const item =
            document.createElement(
                "div"
            );

        item.className =
            "history-item";


        item.innerHTML = `

            <div class="history-top">

                <span class="history-mood">
                    ${escapeHTML(
                        entry.mood
                    )}
                </span>

                <span class="history-date">
                    ${date.toLocaleDateString()}
                </span>

            </div>

            <div class="history-text">
                ${escapeHTML(
                    entry.journal ||
                    "No journal entry."
                )}
            </div>

            <div class="history-analysis">

                <strong>
                    Wellness Level:
                </strong>

                ${escapeHTML(
                    entry.wellnessLevel ||
                    "Not available"
                )}

                <br>

                <strong>
                    Score:
                </strong>

                ${escapeHTML(
                    String(
                        entry.questionnaireScore ??
                        "N/A"
                    )
                )}

                <br>

                <strong>
                    AI Insight:
                </strong>

                ${escapeHTML(
                    entry.analysis ||
                    "Not available"
                )}

            </div>
        `;


        container.appendChild(item);

    });

}


// ============================================================
// DASHBOARD DATA
// ============================================================

function getDashboardMoodData() {

    const history =
        getMoodHistory();

    const recent =
        history.slice(-7);

    const moodCounts = {};


    recent.forEach(entry => {

        const mood =
            entry.mood ||
            "Unknown";

        moodCounts[mood] =
            (moodCounts[mood] || 0) + 1;

    });


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


function updateDashboardMoodData() {

    const data =
        getDashboardMoodData();

    localStorage.setItem(
        "mindcare_dashboard_mood_data",
        JSON.stringify(data)
    );


    window.dispatchEvent(
        new CustomEvent(
            "mindcareMoodUpdated",
            {
                detail: data
            }
        )
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeMoodPage() {

    console.log(
        "INITIALIZING MINDCARE MOOD PAGE..."
    );


    setupMoodCards();


    const nextBtn =
        getElement("nextBtn");

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextQuestion
        );

    }


    const previousBtn =
        getElement("previousBtn");

    if (previousBtn) {

        previousBtn.addEventListener(
            "click",
            previousQuestion
        );

    }


    const analyzeBtn =
        getElement("analyzeBtn");

    if (analyzeBtn) {

        analyzeBtn.addEventListener(
            "click",
            analyzeAndSaveMood
        );

    }


    loadMoodHistory();

    updateDashboardMoodData();


    console.log(
        "MINDCARE MOOD PAGE READY"
    );

}


// ============================================================
// START
// ============================================================

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


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.getMoodHistory =
    getMoodHistory;

window.saveMoodHistory =
    saveMoodHistory;

window.loadMoodHistory =
    loadMoodHistory;

window.getDashboardMoodData =
    getDashboardMoodData;

window.analyzeAndSaveMood =
    analyzeAndSaveMood;

window.calculateScore =
    calculateScore;