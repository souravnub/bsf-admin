const { default: mongoose } = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        courses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                },
                purchaseDate: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Customer =
    mongoose.models.Customer || mongoose.model("Customer", customerSchema);
