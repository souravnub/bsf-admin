import { WebsiteContent } from "@/app/lib/models/WebsiteContent";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export const revalidate = 0;
export async function GET() {
    try {
        connectToDB();

        const content = await WebsiteContent.find({});

        return NextResponse.json(content);
    } catch (error) {
        throw new Error("Failed to fetch website content!");
    }
}
