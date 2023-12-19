import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide first name"],
        },
        lastName: {
            type: String,
            required: [true, "Please provide last name"],
        },
        interestCategories: [{ type: String }],
        email: {
            type: String,
            required: [true, "Please provide email"],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ],
        },
        message: {
            type: String,
            trim: true,
            minLength: [10, "message should be atleast 10 characters"],
        },
    },
    { timestamps: true }
);

export const Contact =
    mongoose.models.Contact || mongoose.model("Contact", contactSchema);
