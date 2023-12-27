import { Admin } from "@/app/lib/models/Admin";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();
        const all_admins_emails = await Admin.find({}, "email");

        return NextResponse.json(all_admins_emails);
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
