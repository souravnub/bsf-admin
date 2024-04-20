import { mongoose } from "mongoose";

const AboutPageContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, required: true },
    vission: { type: String, required: true },
    mission: { type: String, required: true },
    strategy: { type: String, required: true },
});

export const AboutPageContent =
    mongoose.models.AboutPageContent ||
    mongoose.model("AboutPageContent", AboutPageContentSchema);
