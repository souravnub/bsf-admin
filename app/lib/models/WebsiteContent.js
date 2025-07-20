import { mongoose } from "mongoose";
import { getModel, ModelNames } from ".";

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
    contact: {
        msgEmail: { type: String },
        supportEmail: { type: String },
        phone: { type: String },
    },
    footerDescription: { type: String },
});

export const WebsiteContent = getModel(
    ModelNames.WebsiteContent,
    websiteContentSchema
);
