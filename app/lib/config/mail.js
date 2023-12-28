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
    console.log("HERE IS THE CONFIG", smtpConfig);
    console.log("USER THRU ENV -> ", Env.SMTP_USER);
    console.log("USER THRU .env-> ", process.env.SMTP_USER);
    const mailData = {
        from: Env.EMAIL_FROM,
        to,
        subject,
        html,
    };

    console.log("MAILDATA", mailData);
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};
