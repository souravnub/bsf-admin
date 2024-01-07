import { mongoose } from "mongoose";

const AboutPageContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sectionTitle: { type: String, required: true },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    vission: { type: String },
    mission: { type: String },
    strategy: { type: String },
});

export const AboutPageContent =
    mongoose.models.AboutPageContent ||
    mongoose.model("AboutPageContent", AboutPageContentSchema);
