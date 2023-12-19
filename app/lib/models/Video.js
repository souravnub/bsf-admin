import { mongoose } from "mongoose";

const videoSchema = new mongoose.Schema({
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
    mongoose.models.Video || mongoose.model("Video", videoSchema);
