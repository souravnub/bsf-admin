import mongoose from "mongoose";
import { genHash } from "../utils";

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

adminSchema.pre("save", async function () {
    const hash = await genHash(this.password);
    this.password = hash;
});

export const Admin =
    mongoose.models.Admin || mongoose.model("Admin", adminSchema);
