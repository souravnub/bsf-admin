// /api/courses/courserId/reviews

import { Course } from "@/app/lib/models/Course";
import { Review } from "@/app/lib/models/Review";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();

        // getting the courseId from url
        const reqStrArr = request.url.split("/");
        const courseId = reqStrArr[reqStrArr.length - 2];

        const body = await request.json();

        if (body.customerId == undefined) {
            throw new Error(`credentials not provided - customerId`);
        }

        const course = await Course.findOne({ _id: courseId });

        const canCustomerReview = await course.canCustomerReview(
            body.customerId
        );

        if (canCustomerReview) {
            const newReview = new Review({ courseId, ...body });
            await newReview.save();

            return NextResponse.json({ message: "Review added successfully" });
        } else {
            return NextResponse.json(
                {
                    message:
                        "cannot add review, as not a customer or already have review",
                },
                { status: 400 }
            );
        }
    } catch (err) {
        return NextResponse.json(
            {
                errorMessage: "Error while adding review",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
