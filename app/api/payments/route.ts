import { Payment } from "@/app/lib/models/Payments";
import { connectToDB } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    courseId: string;
    customerId: string;
    amountPaid: string;
    isEmailSent: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { courseId, customerId, amountPaid, isEmailSent }: RequestBody =
            await request.json();

        await connectToDB();

        const payment = await Payment.create({
            courseId,
            customerId,
            amountPaidCents: amountPaid,
            isConfirmationEmailSent: isEmailSent,
        });

        return NextResponse.json({ success: true, payment });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
