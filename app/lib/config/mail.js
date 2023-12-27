import nodemailer from "nodemailer";
import Env from "./env";

const smtpConfig = {
    host: Env.SMTP_HOST,
    port: Env.SMTP_PORT,
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
