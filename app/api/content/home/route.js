import { WebsiteContent } from "@/app/lib/models/WebsiteContent";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const content = await WebsiteContent.find({});

        return NextResponse.json(content);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch website content!");
    }
}
