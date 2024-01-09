import { AboutPageContent } from "@/app/lib/models/AboutPageContent";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const content = await AboutPageContent.findById(
            "659c61e132b7030a5d069033"
        );

        const aboutPageData = {
            title: "What we do?",
            description: content.description,
            video: content.video,
            tabs: [
                {
                    title: "Vision",
                    description: content.vission,
                },
                {
                    title: "Strategy",
                    description: content.strategy,
                },
                {
                    title: "Mission",
                    description: content.mission,
                },
            ],
        };

        return NextResponse.json(aboutPageData);
    } catch (error) {
        throw new Error("Failed to fetch website content!");
    }
}
