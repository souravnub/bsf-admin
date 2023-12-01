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

export const Review =
    mongoose.models.Review || mongoose.model("Review", reviewSchema);
