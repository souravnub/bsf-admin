import { HiringMessage } from "@/app/lib/models/HiringMessages";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();
        const body = await request.json();

        const hiringReq = new HiringMessage(body);
        await hiringReq.save();
        return NextResponse.json({
            success: true,
            message: "Request sent successfully.",
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "Error sending hiring request",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
