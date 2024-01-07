import { CourseCategory } from "@/app/lib/models/CourseCategory";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const categories = await CourseCategory.find({});

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            {
                errorMessage: "Error while fetching categories",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
