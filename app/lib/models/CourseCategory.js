import mongoose from "mongoose";

const courseCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
});

export const CourseCategory =
    mongoose.models.CourseCategory ||
    mongoose.model("CourseCategory", courseCategorySchema);
