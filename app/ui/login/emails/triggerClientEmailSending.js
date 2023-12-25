import { render } from "@react-email/render"; // Import necessary email rendering tools
import { sendEmail } from "@/app/lib/config/mail"; // Import the email sending function
import ForgotPasswordEmail from "./ForgotPasswordEmail";

export const triggerClientEmailSending = async (userEmail, username, url) => {
    const html = render(ForgotPasswordEmail({ name: username, url }));

    // Send email to the user
    await sendEmail(userEmail, "Reset Password | BSF Systems", html);
};
