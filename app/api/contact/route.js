import { Contact } from "@/app/lib/models";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();

        const body = await request.json();

        const newContact = new Contact(body);
        await newContact.save();

        return NextResponse.json({ message: "message sent succesfully" });
    } catch (err) {
        return NextResponse.json(
            {
                errorMessage: "Error while sending message",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
