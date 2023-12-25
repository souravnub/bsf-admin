import nodemailer from "nodemailer";
import Env from "./env";

const smtpConfig = {
    host: Env.SMTP_HOST,
    port: Number(Env.SMTP_PORT),
    secure: Env.SMTP_SECURE === "true", // use SSL
    auth: {
        user: Env.SMPT_USER,
        pass: Env.SMTP_PASSWORD,
        method: "PLAIN",
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
