import { mongoose } from "mongoose";

const AboutPageContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    section: {
        title: { type: String, required: true },
        images: [{ type: String }],
    },
    cards: [{ title: String, description: String }],
});

export const AboutPageContent =
    mongoose.models.AboutPageContent ||
    mongoose.model("AboutPageContent", AboutPageContentSchema);
