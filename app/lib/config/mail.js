import nodemailer from "nodemailer";
import Env from "./env";

/*
export const transporter = nodemailer.createTransport({
    host: Env.SMPT_USER,
    port: Number(Env.SMTP_PORT),
    secure: true,
    auth: {
        user: Env.SMPT_USER,
        pass: Env.SMTP_PASSWORD,
    },
});
 */

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    const info = await transporter.sendMail({
        from: Env.EMAIL_FROM,
        to,
        subject,
        html,
    });
    return info?.messageId;
};
