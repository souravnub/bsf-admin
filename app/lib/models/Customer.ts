import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";
import mongoose, { Document, Model, Types } from "mongoose";
import Env from "../config/env";

import {
    renderEmailHtml,
    sendRenderedEmail,
} from "@/app/ui/login/emails/renderAndSendEmail";
import OTPEmail from "@/app/ui/login/emails/OTPEmail";

interface ICustomer {
    email: string;
    name: string;
    courses: {
        course: Types.ObjectId;
        purchaseDate: mongoose.Date;
    }[];
    otp_token: string;
}
export interface ICustomerDocument extends ICustomer, Document {}
interface ICustomerModle extends Model<ICustomerDocument> {}

const customerSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        courses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                },
                purchaseDate: {
                    type: Date,
                    required: true,
                },
            },
        ],
        otp_token: {
            type: String,
            required: false,
            trim: true,
        },
    },
    { timestamps: true }
);

customerSchema.methods.genAndSendOTP = async function () {
    const OTP = cryptoRandomString({
        length: 5,
        type: "numeric",
    });
    const encrypter = new Cryptr(Env.SECRET_KEY);
    const encryptedOTP = encrypter.encrypt(OTP);

    const renderedEmail = renderEmailHtml(
        {
            name: this.name,
            OTP,
        },
        OTPEmail
    );

    await sendRenderedEmail(
        this.email,
        "Email Verification | BSF Systems",

        renderedEmail
    );

    return encryptedOTP;
};

customerSchema.methods.isOTPValid = async function (OTP) {
    const crypter = new Cryptr(Env.SECRET_KEY);
    const backendDecryptedOTP = crypter.decrypt(this.otp_token);
    if (OTP?.trim() === backendDecryptedOTP) {
        return true;
    }
    return false;
};

export const Customer: ICustomerModle =
    mongoose.models.Customer || mongoose.model("Customer", customerSchema);
