
// ============================================
// MindCare AI - Dashboard
// Complete Replacement dashboard.js
// ============================================

console.log("DASHBOARD.JS LOADED");

// ============================================
// STORAGE KEYS
// ============================================

const MOOD_STORAGE_KEY = "mindcare_mood_history";
const CHAT_STORAGE_KEY = "mindcare_chat_history";

// ============================================
// DOM READY
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("DASHBOARD DOM LOADED");

    initializeDashboard();

});

// ============================================
// INITIALIZE DASHBOARD
// ============================================

function initializeDashboard() {

    loadDashboardData();

    loadUserInformation();

    loadRecentMood();

    loadMoodSummary();

    loadMoodChart();

    loadEmotionalPattern();

    loadChatSummary();

    setupNavigation();

    setupLogout();

}

// ============================================
// GET MOOD HISTORY
// ============================================

function getMoodHistory() {

    try {

        const history = JSON.parse(
            localStorage.getItem(MOOD_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(history)) {
            return [];
        }

        return history;

    } catch (error) {

        console.error("MOOD HISTORY ERROR:", error);

        return [];

    }

}

// ============================================
// LOAD DASHBOARD DATA
// ============================================

function loadDashboardData() {

    try {

        const history = getMoodHistory();

        console.log(
            "DASHBOARD MOOD HISTORY:",
            history
        );

        if (history.length === 0) {

            console.log(
                "No real mood data available."
            );

            return;

        }

        console.log(
            "Real mood data available:",
            history.length
        );

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

    }

}

// ============================================
// USER INFORMATION
// ============================================

function loadUserInformation() {

    let user = null;

    // ----------------------------------------
    // Get stored user object
    // ----------------------------------------

    const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

    if (storedUser) {

        try {

            user = JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "USER OBJECT PARSE ERROR:",
                error
            );

        }

    }

    // ----------------------------------------
    // Get registered name
    // ----------------------------------------

    let name = "";

    if (user) {

        name =
            user.name ||
            user.fullName ||
            user.username ||
            "";

    }

    // ----------------------------------------
    // Fallback to separately stored name
    // ----------------------------------------

    if (!name) {

        name =
            localStorage.getItem("userName") ||
            localStorage.getItem("name") ||
            sessionStorage.getItem("userName") ||
            sessionStorage.getItem("name") ||
            "";

    }

    // ----------------------------------------
    // Update all user-name elements
    // ----------------------------------------

    const nameElements =
        document.querySelectorAll(
            "#userName, #welcomeName, .user-name"
        );

    nameElements.forEach(function (element) {

        element.textContent =
            name || "User";

    });

    // ----------------------------------------
    // Keep name available for dashboard
    // ----------------------------------------

    if (name) {

        localStorage.setItem(
            "userName",
            name
        );

    }

    console.log(
        "REGISTERED USER NAME:",
        name || "User"
    );

}

// ============================================
// GET LAST MOOD
// ============================================

function loadRecentMood() {

    const history = getMoodHistory();

    if (history.length === 0) {
        return;
    }

    const latest =
        history[history.length - 1];

    console.log(
        "LATEST MOOD:",
        latest
    );

    const moodElements =
        document.querySelectorAll(
            "#currentMood, #latestMood, .current-mood"
        );

    moodElements.forEach(function (element) {

        element.textContent =
            latest.mood || "Not available";

    });

    const journalElements =
        document.querySelectorAll(
            "#latestJournal, .latest-journal"
        );

    journalElements.forEach(function (element) {

        element.textContent =
            latest.journal || "";

    });

}

// ============================================
// MOOD COUNTS
// ============================================

function getMoodCounts(history) {

    const counts = {};

    history.forEach(function (entry) {

        const mood = entry.mood;

        if (!mood) {
            return;
        }

        counts[mood] =
            (counts[mood] || 0) + 1;

    });

    return counts;

}

// ============================================
// MOOD SUMMARY
// ============================================

function loadMoodSummary() {

    const history = getMoodHistory();

    const counts =
        getMoodCounts(history);

    const total =
        history.length;

    let mostCommon = "No data";
    let highest = 0;

    Object.entries(counts).forEach(
        function ([mood, count]) {

            if (count > highest) {

                highest = count;
                mostCommon = mood;

            }

        }
    );

    console.log(
        "MOOD SUMMARY:",
        {
            total,
            mostCommon,
            counts
        }
    );

    setText(
        [
            "#totalMoodEntries",
            "#moodCount",
            ".mood-count"
        ],
        total
    );

    setText(
        [
            "#mostCommonMood",
            "#dominantMood",
            ".dominant-mood"
        ],
        mostCommon
    );

}

// ============================================
// WEEKLY MOOD DATA
// ============================================

function getLast7DaysData() {

    const history =
        getMoodHistory();

    const today =
        new Date();

    const days = [];

    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);

        date.setHours(
            0,
            0,
            0,
            0
        );

        date.setDate(
            date.getDate() - i
        );

        days.push({

            date: date,

            label:
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                ),

            moods: []

        });

    }

    history.forEach(function (entry) {

        if (!entry.date) {
            return;
        }

        const entryDate =
            new Date(entry.date);

        entryDate.setHours(
            0,
            0,
            0,
            0
        );

        days.forEach(function (day) {

            if (
                entryDate.getTime() ===
                day.date.getTime()
            ) {

                day.moods.push(
                    entry.mood
                );

            }

        });

    });

    return days;

}

// ============================================
// MOOD SCORE
// ============================================

function getMoodScore(mood) {

    if (!mood) {
        return 3;
    }

    const value =
        mood.toLowerCase();

    const positive = [

        "happy",
        "excited",
        "calm",
        "grateful",
        "loved",
        "confident",
        "hopeful",
        "motivated",
        "peaceful"

    ];

    const negative = [

        "sad",
        "lonely",
        "angry",
        "stressed",
        "frustrated",
        "overwhelmed",
        "scared",
        "anxious",
        "worried",
        "tired",
        "nervous",
        "disappointed"

    ];

    if (
        positive.includes(value)
    ) {

        return 5;

    }

    if (
        negative.includes(value)
    ) {

        return 2;

    }

    return 3;

}

// ============================================
// LOAD MOOD CHART
// ============================================

function loadMoodChart() {

    const chartCanvas =
        document.getElementById(
            "moodChart"
        );

    if (!chartCanvas) {

        console.log(
            "Mood chart canvas not found."
        );

        return;

    }

    const days =
        getLast7DaysData();

    const labels =
        days.map(
            day => day.label
        );

    const values =
        days.map(function (day) {

            if (
                day.moods.length === 0
            ) {

                return null;

            }

            const scores =
                day.moods.map(
                    mood =>
                        getMoodScore(mood)
                );

            const total =
                scores.reduce(
                    (
                        sum,
                        value
                    ) =>
                        sum + value,
                    0
                );

            return (
                total /
                scores.length
            );

        });

    console.log(
        "WEEKLY MOOD VALUES:",
        values
    );

    if (
        typeof Chart !== "undefined"
    ) {

        createChart(
            chartCanvas,
            labels,
            values
        );

        return;

    }

    createSimpleChart(
        chartCanvas,
        labels,
        values
    );

}

// ============================================
// CREATE CHART.JS CHART
// ============================================

function createChart(
    canvas,
    labels,
    values
) {

    if (
        canvas._mindCareChart
    ) {

        canvas._mindCareChart.destroy();

    }

    canvas._mindCareChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Mood Pattern",

                            data:
                                values,

                            borderWidth:
                                3,

                            tension:
                                0.4,

                            fill:
                                false,

                            spanGaps:
                                true

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            min: 1,

                            max: 5,

                            ticks: {

                                stepSize:
                                    1,

                                callback:
                                    function (
                                        value
                                    ) {

                                        const labels = {

                                            1:
                                                "Low",

                                            2:
                                                "Difficult",

                                            3:
                                                "Neutral",

                                            4:
                                                "Good",

                                            5:
                                                "Positive"

                                        };

                                        return (
                                            labels[value] ||
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}

// ============================================
// SIMPLE FALLBACK CHART
// ============================================

function createSimpleChart(
    canvas,
    labels,
    values
) {

    const parent =
        canvas.parentElement;

    if (!parent) {
        return;
    }

    let chart =
        parent.querySelector(
            ".simple-mood-chart"
        );

    if (!chart) {

        chart =
            document.createElement(
                "div"
            );

        chart.className =
            "simple-mood-chart";

        parent.appendChild(
            chart
        );

    }

    chart.innerHTML = "";

    values.forEach(
        function (
            value,
            index
        ) {

            const column =
                document.createElement(
                    "div"
                );

            column.style.display =
                "inline-flex";

            column.style.flexDirection =
                "column";

            column.style.alignItems =
                "center";

            column.style.margin =
                "0 8px";

            const bar =
                document.createElement(
                    "div"
                );

            const height =
                value
                    ? value * 20
                    : 5;

            bar.style.height =
                height + "px";

            bar.style.width =
                "25px";

            bar.style.background =
                "#6257ff";

            bar.style.borderRadius =
                "6px";

            const label =
                document.createElement(
                    "small"
                );

            label.textContent =
                labels[index];

            column.appendChild(
                bar
            );

            column.appendChild(
                label
            );

            chart.appendChild(
                column
            );

        }
    );

}

// ============================================
// EMOTIONAL PATTERN
// ============================================

function loadEmotionalPattern() {

    const history =
        getMoodHistory();

    const patternElements =
        document.querySelectorAll(
            "#emotionalPattern, " +
            "#recentEmotionalPattern, " +
            ".emotional-pattern"
        );

    if (
        patternElements.length === 0
    ) {

        return;

    }

    if (
        history.length === 0
    ) {

        patternElements.forEach(
            function (element) {

                element.textContent =
                    "Start recording your moods to see your emotional pattern.";

            }
        );

        return;

    }

    const recent =
        history.slice(-7);

    const counts =
        getMoodCounts(recent);

    let mostCommon = "";
    let highest = 0;

    Object.entries(counts).forEach(
        function ([mood, count]) {

            if (
                count > highest
            ) {

                highest = count;
                mostCommon = mood;

            }

        }
    );

    const positiveMoods = [

        "Happy",
        "Excited",
        "Calm",
        "Grateful",
        "Loved",
        "Confident",
        "Hopeful",
        "Motivated",
        "Peaceful"

    ];

    const negativeMoods = [

        "Sad",
        "Lonely",
        "Angry",
        "Stressed",
        "Frustrated",
        "Overwhelmed",
        "Scared",
        "Anxious",
        "Worried",
        "Tired",
        "Nervous",
        "Disappointed"

    ];

    let positiveCount = 0;
    let negativeCount = 0;

    recent.forEach(
        function (entry) {

            if (
                positiveMoods.includes(
                    entry.mood
                )
            ) {

                positiveCount++;

            }

            if (
                negativeMoods.includes(
                    entry.mood
                )
            ) {

                negativeCount++;

            }

        }
    );

    let pattern = "";

    if (
        positiveCount >
        negativeCount
    ) {

        pattern =
            `Your recent emotional pattern is mostly positive, with ${mostCommon} appearing most often. Keep doing activities that support your wellbeing.`;

    } else if (
        negativeCount >
        positiveCount
    ) {

        pattern =
            `Your recent entries show more difficult emotions, with ${mostCommon} appearing most often. Consider taking time to rest, reflect, and connect with someone you trust.`;

    } else {

        pattern =
            `Your recent emotional pattern is mixed. ${mostCommon} is currently your most frequently recorded mood. Keep checking in with yourself regularly.`;

    }

    patternElements.forEach(
        function (element) {

            element.textContent =
                pattern;

        }
    );

    console.log(
        "EMOTIONAL PATTERN:",
        pattern
    );

}

// ============================================
// CHAT SUMMARY
// ============================================

function loadChatSummary() {

    try {

        const history =
            JSON.parse(
                localStorage.getItem(
                    CHAT_STORAGE_KEY
                ) || "[]"
            );

        const count =
            Array.isArray(history)
                ? history.length
                : 0;

        setText(
            [
                "#chatCount",
                "#totalChats",
                ".chat-count"
            ],
            count
        );

    } catch (error) {

        console.error(
            "CHAT HISTORY ERROR:",
            error
        );

    }

}

// ============================================
// SET TEXT HELPER
// ============================================

function setText(
    selectors,
    value
) {

    selectors.forEach(
        function (selector) {

            const elements =
                document.querySelectorAll(
                    selector
                );

            elements.forEach(
                function (element) {

                    element.textContent =
                        value;

                }
            );

        }
    );

}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {

    const homeButtons =
        document.querySelectorAll(
            "#homeBtn, .home-btn"
        );

    homeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "dashboard.html";

                }
            );

        }
    );

    const moodButtons =
        document.querySelectorAll(
            "#moodBtn, .mood-btn, [data-page='mood']"
        );

    moodButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "mood.html";

                }
            );

        }
    );

    const chatbotButtons =
        document.querySelectorAll(
            "#chatbotBtn, .chatbot-btn, [data-page='chatbot']"
        );

    chatbotButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "chatbot.html";

                }
            );

        }
    );

    const profileButtons =
        document.querySelectorAll(
            "#profileBtn, .profile-btn, [data-page='profile']"
        );

    profileButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "profile.html";

                }
            );

        }
    );

}

// ============================================
// LOGOUT
// ============================================

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, .logout-btn"
        );

    logoutButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const confirmed =
                        confirm(
                            "Are you sure you want to logout?"
                        );

                    if (!confirmed) {
                        return;
                    }

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "authToken"
                    );

                    sessionStorage.removeItem(
                        "token"
                    );

                    sessionStorage.removeItem(
                        "authToken"
                    );

                    window.location.href =
                        "login.html";

                }
            );

        }
    );

}

// ============================================
// REFRESH DASHBOARD WHEN MOOD CHANGES
// ============================================

window.addEventListener(
    "mindcareMoodUpdated",
    function () {

        console.log(
            "MOOD UPDATED - REFRESHING DASHBOARD"
        );

        loadDashboardData();

        loadRecentMood();

        loadMoodSummary();

        loadMoodChart();

        loadEmotionalPattern();

    }
);

// ============================================
// REFRESH WHEN TAB BECOMES ACTIVE
// ============================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadDashboardData();

            loadRecentMood();

            loadMoodSummary();

            loadMoodChart();

            loadEmotionalPattern();

            loadUserInformation();

        }

    }
);

// ============================================
// GLOBAL DASHBOARD FUNCTIONS
// ============================================

window.loadDashboardData =
    loadDashboardData;

window.loadMoodSummary =
    loadMoodSummary;

window.loadMoodChart =
    loadMoodChart;
window.loadEmotionalPattern =
    loadEmotionalPattern;
window.getMoodHistory =
    getMoodHistory;
window.loadUserInformation =
    loadUserInformation;
