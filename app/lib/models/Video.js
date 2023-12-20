import { mongoose } from "mongoose";

const modalVideoSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    url: [
        {
            type: String,
            required: true,
            unique: true,
        },
    ],
});

export const Video =
    mongoose.models.Video || mongoose.model("Video", modalVideoSchema);
