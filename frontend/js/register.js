const EMAILJS_PUBLIC_KEY = "x0F9yq1fx54FQcUYs";
const EMAILJS_SERVICE_ID = "service_bq2q0vr";
const EMAILJS_TEMPLATE_ID = "template_5l0r8xc";

console.log("REGISTER.JS LOADED");

emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("REGISTER FORM NOT FOUND");
        return;
    }

    console.log("REGISTER FORM FOUND");

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log("CREATE ACCOUNT CLICKED");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!name) {
            alert("Enter your name");
            return;
        }

        if (!email) {
            alert("Enter your email");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        console.log("================================");
        console.log("FINAL RECIPIENT:", email);
        console.log("SERVICE:", EMAILJS_SERVICE_ID);
        console.log("TEMPLATE:", EMAILJS_TEMPLATE_ID);
        console.log("OTP:", otp);
        console.log("================================");

        try {

            console.log("SENDING EMAIL...");

            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    otp: otp
                }
            );

            console.log("EMAILJS RESPONSE:", response);

            if (response.status === 200) {

                console.log("EMAIL SENT TO EMAILJS");

                sessionStorage.setItem(
                    "mindcare_pending_registration",
                    JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        otp: otp,
                        createdAt: Date.now()
                    })
                );

                alert(
                    "EmailJS accepted the request. Check EmailJS History."
                );

                window.location.href = "./otp.html";

            } else {

                console.error(
                    "EMAILJS FAILED:",
                    response
                );

                alert("EmailJS failed.");

            }

        } catch (error) {

            console.error("EMAILJS ERROR:", error);

            alert(
                "EmailJS Error: " +
                (error.text || error.message || JSON.stringify(error))
            );

        }

    });

});