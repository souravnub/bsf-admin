const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Admin =
    mongoose.models.Admin || mongoose.model("Admin", adminSchema);
