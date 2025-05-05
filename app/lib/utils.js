import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import Env from "./config/env";

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

const s3Client = new S3Client({
    region: Env.AWS_S3_REGION,
    credentials: {
        accessKeyId: Env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: Env.AWS_S3_SECRET_ACCESS_KEY,
    },
});
export async function uploadFileToS3({ file, fileKey, fileType }) {
    const fileBuffer = file;

    const params = {
        Bucket: Env.AWS_S3_BUCKET_NAME,
        Key: `${fileKey}`,
        Body: fileBuffer,
        ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return fileKey;
}

export async function deleteFileFromS3(fileName) {
    const params = {
        Bucket: Env.AWS_S3_BUCKET_NAME,
        Key: `${fileName}`,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return fileName;
}

export function getS3FileUrl(fileName) {
    return `https://${Env.AWS_S3_BUCKET_NAME}.s3.${Env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
}
export function getS3FileKey(s3FileUrl) {
    const splitStrs = s3FileUrl.split("/");
    return splitStrs[splitStrs.length - 1];
}

export function isURL(text) {
    // Regular expression to match a URL
    const urlRegex =
        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?|localhost(:\d{1,5})?)(\/[\w-]+)*\/?(\?[^\s]*)?$/;

    // Test the provided text against the regular expression
    return urlRegex.test(text);
}
