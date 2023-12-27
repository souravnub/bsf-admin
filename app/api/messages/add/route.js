import { Contact } from "@/app/lib/models/Contact";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();

        const body = await request.json();

        const newContact = new Contact(body);
        await newContact.save();

        return NextResponse.json({ message: "Success." });
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

export async function OPTIONS(request) {
    const allowedOrigin = request.headers.get("origin");
    const response = new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": allowedOrigin || "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
                "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
            "Access-Control-Max-Age": "86400",
        },
    });

    return response;
}
