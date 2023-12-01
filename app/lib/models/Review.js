import { Course } from "./Course";

const { default: mongoose, Schema } = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            required: [true, "a rating is required"],
        },
        message: {
            type: String,
            require: [true, "review message is required"],
        },
    },
    { timestamps: true }
);

// pushing the review id into the course's reviews array once review is added by customer
reviewSchema.post("save", async function () {
    await Course.findOneAndUpdate(
        { _id: this.courseId },
        { $push: { reviews: this._id } }
    );
});

export const Review =
    mongoose.models.Review || mongoose.model("Review", reviewSchema);
