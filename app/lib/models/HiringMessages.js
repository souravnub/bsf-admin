const { default: mongoose } = require("mongoose");

const hiringMsgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    roleRequired: { type: String, required: true },
    experience: { type: Number, required: true },
    jobDesc: { type: String, required: true },
});

export const HiringMessage =
    mongoose.models.HiringMessage ||
    mongoose.model("HiringMessage", hiringMsgSchema);
