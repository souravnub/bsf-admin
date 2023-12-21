import { mongoose } from "mongoose";

const websiteContentSchema = new mongoose.Schema({
    heroText: {
        type: String,
    },
    section: {
        smallHeading: { type: String },
        bigHeading: { type: String },
        cards: [
            {
                bannerImage: { type: String },
                description: { type: String },
                video: { type: String },
            },
        ],
    },
    footerDescription: { type: String },
});

export const WebsiteContent =
    mongoose.models.WebsiteContent ||
    mongoose.model("WebsiteContent", websiteContentSchema);
