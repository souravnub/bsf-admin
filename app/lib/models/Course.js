const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        customers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer",
            },
        ],

        name: {
            type: String,
            required: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseCategory",
        },

        image: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        features: [
            {
                type: String,
                required: true,
            },
        ],

        prequisites: [
            {
                type: String,
            },
        ],

        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Course =
    mongoose.models.Course || mongoose.model("Course", courseSchema);
