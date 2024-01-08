import { Review } from "@/app/lib/models/Review";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();
        const reviews = await Review.find({ isShown: true })
            .populate("courseId", "pageTitle rating message")
            .populate("customerId", "name");

        console.log(reviews);

        const output = reviews.map(
            ({ _id, courseId, rating, message, customerId }) => {
                const r = {
                    id: _id,
                    course: courseId.pageTitle,
                    review: message,
                    rating,
                    name: customerId.name,
                };
                return r;
            }
        );

        return NextResponse.json({
            count: reviews.length,
            testimonials: output,
        });
    } catch (error) {
        throw new Error("Failed to fetch reviews for courses!");
    }
}
