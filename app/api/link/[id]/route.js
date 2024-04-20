import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils.js";
import { Course } from "../../../lib/models/Course.js";

export async function GET(request) {
    try {
        await connectToDB();
        // getting the id from the url
        const id = request.url.slice(request.url.lastIndexOf("/") + 1);

        const course = await Course.findById(id);

        return NextResponse.json({
            course_name: course.name,
            link: course.email_link,
        });
    } catch (err) {
        return NextResponse.json(
            {
                errorMessage: "Error while fetching course",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
