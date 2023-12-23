import nodemailer from "nodemailer";
import Env from "./env";

export const transporter = nodemailer.createTransport({
    host: Env.SMPT_USER,
    port: Number(Env.SMTP_PORT),
    secure: true,
    auth: {
        user: Env.SMPT_USER,
        pass: Env.SMTP_PASSWORD,
    },
});

export const sendEmail = async (to, subject, html) => {
    const info = await transporter.sendMail({
        from: Env.EMAIL_FROM, // sender address
        to: "zaidd250@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    // const info = await transporter.sendMail({
    //     from: Env.EMAIL_FROM,
    //     to,
    //     subject,
    //     html,
    // });

    return info?.messageId;
};
