import { mongoose } from "mongoose";
import { getModel, ModelNames } from ".";

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

export const Video = getModel(ModelNames.Video, modalVideoSchema);
