import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { JSX } from "react";

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "false" ? false : true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
};

export const transporter = nodemailer.createTransport(smtpConfig);

export const renderEmailHtml = (
    templateProps: any,
    template: (templateProps: any) => JSX.Element
) => render(template(templateProps));

export const sendEmail = async (
    to: string | string[],
    subject: string,
    html: string
) => {
    const mailData = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    };

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
