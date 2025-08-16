import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils";
import { Course } from "../../../lib/models/Course";
// import Instructor Model here, because was getting error: Instructor schema haven't been registered yet.
import { Instructor } from "@/app/lib/models/Instructors";

export async function GET(request) {
    try {
        await connectToDB();
        // getting the id from the url
        const id = request.url.slice(request.url.lastIndexOf("/") + 1);

        const course = await Course.findById(id).populate("instructor").exec();

        return NextResponse.json(course);
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                errorMessage: "Error while fetching course",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
