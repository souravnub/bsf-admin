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
        replied: {
            type: Boolean,
            default: false,
            required: true,
        },
        repliedAt: {
            type: Date, // Field to store the reply timestamp
            expires: 60 * 60 * 24 * 90, // 90 days in seconds
            default: null, // Set to null when the message is not replied to
        },
    },
    { timestamps: true }
);

contactSchema.index({ repliedAt: 1 }, { expireAfterSeconds: 0 });

export const Contact =
    mongoose.models.Contact || mongoose.model("Contact", contactSchema);
