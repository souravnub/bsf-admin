import mongoose from "mongoose";

const socialCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
});

export const SocialCategory =
    mongoose.models.SocialCategory ||
    mongoose.model("SocialCategory", socialCategorySchema);
