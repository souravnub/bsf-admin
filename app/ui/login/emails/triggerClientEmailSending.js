import { render } from "@react-email/render"; // Import necessary email rendering tools
import { sendEmail } from "@/app/lib/config/mail"; // Import the email sending function
import ForgotPasswordEmail from "./ForgotPasswordEmail";
import ReplyEmail from "./ReplyEmail";
import EmailToAll from "./EmailToAll";

export const triggerClientEmailSending = async (
    userEmail,
    subject,
    reason,
    username,
    url,
    message,
    reply,
    firstName,
    lastName
) => {
    if (reason === "forgot password") {
        const html = render(ForgotPasswordEmail({ name: username, url }));
        await sendEmail(userEmail, subject, html);
    } else if (reason === "reply") {
        const html = render(
            ReplyEmail({
                message,
                reply,
                firstName,
                lastName,
            })
        );
        await sendEmail(userEmail, subject, html);
    } else if (reason == "all") {
        const html = render(EmailToAll({ message }));
        await sendEmail(userEmail, subject, html);
    }
    // Send email to the user
};
