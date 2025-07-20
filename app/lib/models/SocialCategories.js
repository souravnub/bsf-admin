import mongoose from "mongoose";
import { getModel, ModelNames } from ".";

const socialCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
});

export const SocialCategory = getModel(
    ModelNames.SocialCategory,
    socialCategorySchema
);
