import { mongoose } from "mongoose";

const modalVideoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    videos: [
        {
            type: String,
            required: true,
        },
    ],
});

export const Video =
    mongoose.models.Video || mongoose.model("Video", modalVideoSchema);
