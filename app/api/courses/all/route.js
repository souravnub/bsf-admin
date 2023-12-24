import { Course } from "@/app/lib/models/Course";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();
        const courses = await Course.find({}, "name image price category")
            .populate("category") // Assuming you want category name
            .exec();

        // Shuffle the courses array to ensure randomness
        const shuffledCourses = courses.sort(() => Math.random() - 0.5);

        // Return only the first three courses from the shuffled array
        const randomCourses = shuffledCourses.slice(0, 3);

        return NextResponse.json(randomCourses);
    } catch (error) {
        return NextResponse.json(
            {
                errorMessage: "Error while fetching courses",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
