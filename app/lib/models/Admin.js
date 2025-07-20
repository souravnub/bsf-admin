import mongoose from "mongoose";
import { genHash } from "../utils";
import { getModel, ModelNames } from ".";

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
        password_reset_token: {
            required: false,
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

adminSchema.pre("save", async function () {
    const hash = await genHash(this.password);
    this.password = hash;
});

export const Admin = getModel(ModelNames.Admin, adminSchema);
