import mongoose from "mongoose";
import { getModel, ModelNames } from ".";

const courseCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
});

export const CourseCategory = getModel(
    ModelNames.CourseCategory,
    courseCategorySchema
);
