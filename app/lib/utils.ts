import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import Env from "./config/env";

let connection: {
    isConnected: boolean;
    connectState?: mongoose.ConnectionStates;
} = { isConnected: false };

export const connectToDB = async () => {
    try {
        if (connection.isConnected) return;
        const db = await mongoose.connect(process.env.MONGO);

        connection = {
            isConnected: true,
            connectState: db.connections[0].readyState,
        };
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

export function getRandomColor() {
    const colors = [
        "#FF6633",
        "#FFB399",
        "#FF33FF",
        "#FFFF99",
        "#00B3E6",
        "#E6B333",
        "#3366E6",
        "#999966",
        "#99FF99",
        "#B34D4D",
        "#80B300",
        "#809900",
        "#E6B3B3",
        "#6680B3",
        "#66991A",
        "#FF99E6",
        "#CCFF1A",
        "#FF1A66",
        "#E6331A",
        "#33FFCC",
        "#66994D",
        "#B366CC",
        "#4D8000",
        "#B33300",
        "#CC80CC",
        "#66664D",
        "#991AFF",
        "#E666FF",
        "#4DB3FF",
        "#1AB399",
        "#E666B3",
        "#33991A",
        "#CC9999",
        "#B3B31A",
        "#00E680",
        "#4D8066",
        "#809980",
        "#E6FF80",
        "#1AFF33",
        "#999933",
        "#FF3380",
        "#CCCC00",
        "#66E64D",
        "#4D80CC",
        "#9900B3",
        "#E64D66",
        "#4DB380",
        "#FF4D4D",
        "#99E6E6",
        "#6666FF",
    ];

    const randomIdx = Math.floor(Math.random() * colors.length);
    return colors[randomIdx];
}
