import { Customer } from "@/app/lib/models/Customer";
import { connectToDB } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectToDB();
        const customerEmail = request.nextUrl.searchParams.get("email");

        if (!customerEmail) {
            return NextResponse.json(
                { success: false, message: "no email provided in params" },
                { status: 400 }
            );
        }

        const customer = await Customer.findOne({
            email: customerEmail,
        });

        return NextResponse.json({
            success: true,
            enrollments: customer
                ? customer.courses.map((course) => course.course)
                : [],
        });
    } catch (err) {
        return NextResponse.json(
            {
                message: "error fetching enrollments",
                success: false,
            },
            { status: 500 }
        );
    }
}
