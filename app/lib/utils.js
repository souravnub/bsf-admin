import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const connection = {};

export const connectToDB = async () => {
    try {
        if (connection.isConnected) return;
        const db = await mongoose.connect(process.env.MONGO);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        throw new Error(error);
    }
};

export const genHash = async (str) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);
    return hash;
};
