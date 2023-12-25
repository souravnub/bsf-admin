import { Video } from "@/app/lib/models/Video";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const videos = await Video.find({});

        return NextResponse.json(videos);
    } catch (error) {
        throw new Error("Failed to fetch videos!");
    }
}
