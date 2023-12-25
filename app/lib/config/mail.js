import nodemailer from "nodemailer";
import Env from "./env";

console.log("FJLKDSFJS:", Env.SMPT_USER);
console.log("FJLKDSFJS:", Env.SMTP_PASSWORD);

const smtpConfig = {
    host: Env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: Env.SMTP_USER,
        pass: Env.SMTP_PASSWORD,
    },
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = async (to, subject, html) => {
    const info = await transporter.sendMail({
        from: Env.EMAIL_FROM,
        to,
        subject,
        html,
    });
    return info?.messageId;
};

// Ask banks to either disable 2FA or create another app for this.
