import { render } from "@react-email/render"; // Import necessary email rendering tools
import { sendEmail } from "@/app/lib/config/mail"; // Import the email sending function

export const renderEmailHtml = (templateProps, template) =>
    render(template(templateProps));

export const sendRenderedEmail = async (emailProps, renderedHtmlEmail) => {
    await sendEmail(emailProps.email, emailProps.subject, renderedHtmlEmail);
};
