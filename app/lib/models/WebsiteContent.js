import { mongoose } from "mongoose";

const websiteContentSchema = new mongoose.Schema({
    heroText: {
        type: String,
        required: true,
    },
    section: [
        {
            smallHeading: { type: String, required: true },
            bigHeading: { type: String, required: true },
            cards: [
                {
                    bannerImage: { type: String, required: true },
                    description: { type: String, required: true },
                    video: { type: String, required: true },
                },
            ],
        },
    ],
    footerDescription: { type: String, required: true },
});

export const Video =
    mongoose.models.Video ||
    mongoose.model("Website Content", websiteContentSchema);
