import { Course } from "@/app/lib/models/Course";
import { Customer } from "@/app/lib/models/Customer";
import { Review } from "@/app/lib/models/Review";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const { email, OTP, rating, message } = await request.json();
        const courseId = params.id;

        if (!OTP) {
            return NextResponse.json({
                success: false,
                msg: "OTP is requierd",
            });
        }

        const customer = await Customer.findOne({ email });
        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json(
                { success: false, msg: "course not found" },
                { status: 404 }
            );
        }
        if (!customer) {
            return NextResponse.json(
                { success: false, msg: "customer not found" },
                { status: 404 }
            );
        }

        const isOTPValid = await customer.isOTPValid(OTP);

        if (!isOTPValid) {
            return NextResponse.json({
                success: false,
                msg: "OTP is not valid",
            });
        }

        // removing the otp from customer document once customer enteres a valid OTP, so that customer cannot reuse it.
        // using customer.findByIdAndUpdate so that .save() wouldn't hash the already hashed password
        await Customer.findByIdAndUpdate(customer._id, {
            $set: { otp_token: null },
        });

        // the new Review will be automtically pushed to the course's reviews array (schema method "pre save")
        await Review.create({
            customerId: customer._id,
            courseId,
            rating,
            message,
        });

        return NextResponse.json({
            success: true,
            msg: "Review added successfully",
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}
