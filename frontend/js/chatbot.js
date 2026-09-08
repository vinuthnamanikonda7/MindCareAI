//
// MindCare AI - Chatbot
//

console.log("CHATBOT.JS LOADED");


// ============================================
// Configuration
// ============================================

const API_URL = "http://localhost:5000/api/ai/chat";

const CHAT_STORAGE_KEY =
    "mindcare_chat_history";


// ============================================
// Elements
// ============================================

const chatBody =
    document.getElementById("chatBody");

const chatInput =
    document.getElementById("chatInput");

const sendBtn =
    document.getElementById("sendBtn");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const homeBtn =
    document.getElementById("homeBtn");


// ============================================
// Check elements
// ============================================

if (!chatBody) {
    console.error("chatBody not found");
}

if (!chatInput) {
    console.error("chatInput not found");
}

if (!sendBtn) {
    console.error("sendBtn not found");
}


// ============================================
// Get authentication token
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
// Get chat history
// ============================================

function getChatHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CHAT_STORAGE_KEY
            ) || "[]"
        );

    } catch (error) {

        console.error(
            "CHAT HISTORY ERROR:",
            error
        );

        return [];

    }

}


// ============================================
// Save chat history
// ============================================

function saveChatHistory(history) {

    localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(history)
    );

}


// ============================================
// Escape HTML
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;

}


// ============================================
// Add message to chat
// ============================================

function addMessage(
    sender,
    text,
    save = true
) {

    if (!chatBody) {
        return;
    }


    const row =
        document.createElement("div");

    row.className =
        "message-row " +
        (
            sender === "user"
                ? "user"
                : "bot"
        );


    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";


    const now =
        new Date();


    bubble.innerHTML = `
        ${escapeHTML(text)}

        <span class="message-time">
            ${now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}
        </span>
    `;


    row.appendChild(bubble);

    chatBody.appendChild(row);


    chatBody.scrollTop =
        chatBody.scrollHeight;


    if (save) {

        const history =
            getChatHistory();


        history.push({

            sender: sender,

            text: text,

            time: Date.now()

        });


        saveChatHistory(history);

    }

}


// ============================================
// Load chat history
// ============================================

function loadChatHistory() {

    if (!chatBody) {
        return;
    }


    const history =
        getChatHistory();


    chatBody.innerHTML = "";


    if (history.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-chat";


        empty.innerHTML = `
            <div style="font-size:45px;">
                🧠
            </div>

            <h3 style="margin:15px 0;">
                Hello! I'm MindCare AI
            </h3>

            <p>
                Tell me how you're feeling.
                I'm here to listen.
            </p>
        `;


        chatBody.appendChild(empty);

        return;

    }


    history.forEach(function (item) {

        addMessage(
            item.sender,
            item.text,
            false
        );

    });

}


// ============================================
// Send message
// ============================================

async function sendMessage() {

    if (!chatInput || !sendBtn) {
        return;
    }


    const text =
        chatInput.value.trim();


    if (!text) {
        return;
    }


    // Show user's message immediately

    addMessage(
        "user",
        text,
        true
    );


    chatInput.value = "";


    sendBtn.disabled = true;

    sendBtn.textContent =
        "Sending...";


    try {

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


        console.log(
            "CHAT API:",
            API_URL
        );

        console.log(
            "CHAT MESSAGE:",
            text
        );


        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: headers,

                    body: JSON.stringify({

                        message: text,

                        prompt: text

                    })

                }
            );


        console.log(
            "CHAT STATUS:",
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "CHAT SERVER ERROR:",
                errorText
            );


            throw new Error(
                "Server returned " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "CHAT RESPONSE:",
            data
        );


        const reply =
            data.reply ||
            data.response ||
            data.message ||
            data.text ||
            data.data?.reply ||
            data.data?.response ||
            "I'm here with you. Tell me more about how you're feeling.";


        addMessage(
            "bot",
            reply,
            true
        );


    } catch (error) {

        console.error(
            "CHAT ERROR:",
            error
        );


        addMessage(
            "bot",
            "I'm unable to connect right now. Please try again.",
            true
        );

    } finally {

        sendBtn.disabled = false;

        sendBtn.textContent =
            "Send";


        if (chatInput) {

            chatInput.focus();

        }

    }

}


// ============================================
// Send button
// ============================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

}


// ============================================
// Enter key
// ============================================

if (chatInput) {

    chatInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// ============================================
// Clear chat history
// ============================================

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "Are you sure you want to clear your chat history?"
                );


            if (!confirmClear) {
                return;
            }


            localStorage.removeItem(
                CHAT_STORAGE_KEY
            );


            loadChatHistory();

        }
    );

}


// ============================================
// Home button
// ============================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );

}


// ============================================
// Initial load
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadChatHistory();


        if (chatInput) {

            chatInput.focus();

        }

    }
);