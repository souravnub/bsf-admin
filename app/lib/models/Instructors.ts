import { Document, Model } from "mongoose";
import { getModel, ModelNames } from ".";

const { default: mongoose } = require("mongoose");

interface IInstructor {
    imgUrl: string;
    email: string;
    name: string;
    role: string;
    socials: { name: string; href: string }[];
    description: string;
}

export interface IInstructorDocument extends IInstructor, Document {}
interface IInstructorModel extends Model<IInstructor> {}

const InstructorSchema = mongoose.Schema({
    imgUrl: {
        type: String,
        default: "https://bsf-web-bucket.s3.us-east-2.amazonaws.com/avatar.png",
    },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    socials: [
        {
            name: { type: String, required: true },
            href: { type: String, required: true },
        },
    ],
    description: { type: String },
});

export const Instructor: IInstructorModel = getModel(
    ModelNames.Instructor,
    InstructorSchema
);
