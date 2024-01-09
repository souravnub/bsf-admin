import { Review } from "@/app/lib/models/Review";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

// importing customer model, so as to initialize the customer schema
// prevents error:  MissingSchemaError: Schema hasn't been registered for model "Customer"
import { Customer } from "@/app/lib/models/Customer";

export async function GET() {
    try {
        connectToDB();
        const reviews = await Review.find({ isShown: true })
            .populate("courseId", "pageTitle rating message")
            .populate("customerId", "name");

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
        console.log(error);
        throw new Error("Failed to fetch reviews for courses!");
    }
}
