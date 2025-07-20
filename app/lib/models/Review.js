import { mongoose, Schema } from "mongoose";

import { Course } from "./Course";
import { getModel, ModelNames } from ".";

const reviewSchema = new mongoose.Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.Customer,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.Course,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            required: [true, "a rating is required"],
        },
        message: {
            type: String,
            required: [true, "review message is required"],
        },
        isShown: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// pushing the review id into the course's reviews array once review is added by customer
reviewSchema.post("save", async function () {
    await Course.findByIdAndUpdate(this.courseId, {
        $push: { reviews: this._id },
    });
});

export const Review = getModel(ModelNames.Review, reviewSchema);
