import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils.js";
import { Course } from "../../../lib/models/Course";

export async function GET(request) {
    try {
        await connectToDB();
        // getting the id from the url
        const id = request.url.slice(request.url.lastIndexOf("/") + 1);

        const course = await Course.findById(id);

        return NextResponse.json(course);
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
