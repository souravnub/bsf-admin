import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/utils.js";
import { Course } from "../../../lib/models.js";

export async function GET(request) {
    try {
        await connectToDB();
        // getting the id from the url
        const id = request.url.slice(request.url.lastIndexOf("/") + 1);

        const course = await Course.find({
            _id: id,
        });

        return NextResponse.json({ course });
    } catch (err) {
        throw new Error("Error while fetching course");
    }
}
