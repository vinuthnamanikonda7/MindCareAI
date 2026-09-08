const API_URL = "http://localhost:5000/api";

/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message =
                document.getElementById("registerMessage");

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.className =
                    "message error";

                return;
            }

            try {

                message.textContent =
                    "Creating account...";

                message.className =
                    "message";

                const response = await fetch(
                    `${API_URL}/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Registration failed"
                    );
                }

                localStorage.setItem(
                    "pendingEmail",
                    email
                );

                message.textContent =
                    "Registration successful!";

                message.className =
                    "message success";

                setTimeout(() => {

                    window.location.href =
                        "otp.html";

                }, 1000);

            } catch (error) {

                message.textContent =
                    error.message;

                message.className =
                    "message error";
            }
        }
    );
}

/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail")
                .value.trim();

            const password =
                document.getElementById("loginPassword")
                .value;

            const message =
                document.getElementById("loginMessage");

            try {

                message.textContent =
                    "Logging in...";

                message.className =
                    "message";

                const response = await fetch(
                    `${API_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed"
                    );
                }

                if (data.token) {

                    localStorage.setItem(
                        "mindcareToken",
                        data.token
                    );
                }

                if (data.user) {

                    localStorage.setItem(
                        "mindcareUser",
                        JSON.stringify(data.user)
                    );

                } else {

                    localStorage.setItem(
                        "mindcareUser",
                        JSON.stringify({
                            email: email
                        })
                    );
                }

                message.textContent =
                    "Login successful!";

                message.className =
                    "message success";

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            } catch (error) {

                message.textContent =
                    error.message;

                message.className =
                    "message error";
            }
        }
    );
}

/* =========================
   OTP
========================= */

const otpForm =
    document.getElementById("otpForm");

if (otpForm) {

    const inputs =
        document.querySelectorAll(".otp-input");

    inputs.forEach((input, index) => {

        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value.replace(
                        /[^0-9]/g,
                        ""
                    );

                if (
                    input.value &&
                    index < inputs.length - 1
                ) {

                    inputs[index + 1].focus();

                }
            }
        );

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    inputs[index - 1].focus();

                }

            }
        );
    });

    otpForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            let otp = "";

            inputs.forEach(input => {
                otp += input.value;
            });

            const email =
                localStorage.getItem("pendingEmail");

            const message =
                document.getElementById("otpMessage");

            if (otp.length !== 6) {

                message.textContent =
                    "Please enter the complete 6-digit OTP.";

                message.className =
                    "message error";

                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/auth/verify-otp`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            otp
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "OTP verification failed"
                    );
                }

                message.textContent =
                    "Email verified successfully!";

                message.className =
                    "message success";

                localStorage.removeItem(
                    "pendingEmail"
                );

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);

            } catch (error) {

                message.textContent =
                    error.message;

                message.className =
                    "message error";
            }
        }
    );
}

/* =========================
   RESEND OTP
========================= */

const resendBtn =
    document.getElementById("resendBtn");

if (resendBtn) {

    resendBtn.addEventListener(
        "click",
        async function () {

            const email =
                localStorage.getItem(
                    "pendingEmail"
                );

            if (!email) {

                alert(
                    "Email not found. Please register again."
                );

                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/auth/resend-otp`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email
                        })
                    }
                );

                const data =
                    await response.json();

                alert(
                    data.message ||
                    "OTP sent successfully."
                );

            } catch (error) {

                alert(
                    "Unable to resend OTP."
                );
            }
        }
    );
}

/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "mindcareToken"
    );

    localStorage.removeItem(
        "mindcareUser"
    );

    window.location.href =
        "login.html";
}