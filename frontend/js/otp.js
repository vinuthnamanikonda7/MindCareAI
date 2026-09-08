// ============================================
// MindCare AI - OTP Verification
// ============================================


// Get saved registration data
const savedData =
    sessionStorage.getItem(
        "mindcare_pending_registration"
    );


// If no registration data
if (!savedData) {

    alert(
        "Registration session not found. Please register again."
    );

    window.location.href =
        "register.html";
}


// Convert JSON to object
const registrationData =
    JSON.parse(savedData);


// ============================================
// Elements
// ============================================

const emailDisplay =
    document.getElementById(
        "emailDisplay"
    );

const otpInputs =
    document.querySelectorAll(
        ".otp-input"
    );

const verifyBtn =
    document.getElementById(
        "verifyBtn"
    );

const resendBtn =
    document.getElementById(
        "resendBtn"
    );

const message =
    document.getElementById(
        "message"
    );


// ============================================
// Show Email
// ============================================

emailDisplay.textContent =
    registrationData.email;


// ============================================
// OTP Input
// ============================================

otpInputs.forEach(
    function (input, index) {


        input.addEventListener(
            "input",
            function () {

                input.value =
                    input.value.replace(
                        /[^0-9]/g,
                        ""
                    );


                if (
                    input.value &&
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        index + 1
                    ].focus();

                }

            }
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }

            }
        );

    }
);


// ============================================
// Get Entered OTP
// ============================================

function getOTP() {

    let otp = "";

    otpInputs.forEach(
        function (input) {

            otp += input.value;

        }
    );

    return otp;
}


// ============================================
// Show Message
// ============================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        "message " + type;
}


// ============================================
// Verify OTP
// ============================================

verifyBtn.addEventListener(
    "click",
    async function () {

        const enteredOTP =
            getOTP();


        if (
            enteredOTP.length !== 6
        ) {

            showMessage(
                "Please enter the complete 6-digit OTP.",
                "error"
            );

            return;
        }


        // Check OTP
        if (
            enteredOTP !==
            registrationData.otp
        ) {

            showMessage(
                "Incorrect OTP. Please try again.",
                "error"
            );

            return;
        }


        verifyBtn.disabled =
            true;

        verifyBtn.textContent =
            "Creating Account...";


        try {

            // ==================================
            // Send registration to backend
            // ==================================

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                registrationData.name,

                            email:
                                registrationData.email,

                            password:
                                registrationData.password

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed."
                );
            }


            // ==================================
            // Clear session
            // ==================================

            sessionStorage.removeItem(
                "mindcare_pending_registration"
            );


            showMessage(
                "Email verified! Account created successfully.",
                "success"
            );


            // ==================================
            // Go Login
            // ==================================

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1500
            );


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to create account.",
                "error"
            );


            verifyBtn.disabled =
                false;

            verifyBtn.textContent =
                "Verify Email";

        }

    }
);