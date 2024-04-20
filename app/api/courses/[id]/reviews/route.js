import { Course } from "@/app/lib/models/Course";
import { Customer } from "@/app/lib/models/Customer";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    try {
        const queryParams = request.nextUrl.searchParams;
        const email = queryParams.get("email");
        const courseId = params.id;

        if (!email)
            return NextResponse.json({
                success: false,
                msg: "Provide an email",
            });

        await connectToDB();

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return NextResponse.json({
                success: false,
                msg: "Cannot find a customer with this email",
            });
        }

        const courseToReview = await Course.findById(courseId);

        const canCustomerReview = await courseToReview.canCustomerReview(
            customer._id.toString()
        );

        if (!canCustomerReview)
            return NextResponse.json({
                success: false,
                msg: "Cannot add a review to this course (not a customer/already have a review)",
            });

        const encryptedOTP = await customer.genAndSendOTP();
        customer.otp_token = encryptedOTP;
        await customer.save();

        return NextResponse.json({
            success: true,
            msg: "An OTP had been sent to your email.",
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}
