import { Instructor } from "@/app/lib/models/Instructors";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const instructors = await Instructor.find();

        return NextResponse.json({ instructors });
    } catch (err) {
        return NextResponse.json(
            {
                error: err.message,
            },
            { status: 500 }
        );
    }
}
