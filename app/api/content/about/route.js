import { AboutPageContent } from "@/app/lib/models/AboutPageContent";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const content = await AboutPageContent.findById(
            "6594d31fb3aceb3350a605a5"
        );

        return NextResponse.json(content);
    } catch (error) {
        throw new Error("Failed to fetch website content!");
    }
}
