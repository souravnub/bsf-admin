import { getModel, ModelNames } from ".";

const { default: mongoose } = require("mongoose");

const hiringMsgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    roleRequired: { type: String, required: true },
    experience: { type: Number, required: true },
    jobDesc: { type: String, required: true },
    replied: { type: Boolean, default: false },
    reply: { type: String, default: null },
    repliedAt: { type: Date, default: null, expires: 60 * 60 * 24 * 90 },
});

export const HiringMessage = getModel(
    ModelNames.HiringMessage,
    hiringMsgSchema
);
