import { Course } from "@/app/lib/models/Course";
import { Customer } from "@/app/lib/models/Customer";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();

        const body = await request.json();

        const customerExists = await Customer.findOne({ email: body.email });
        const course = await Course.findOne({ _id: body.course });
        if (customerExists) {
            const currentDate = new Date();
            const courseEnrolled = body.course;

            customerExists.courses.push({
                course: courseEnrolled,
                purchaseDate: currentDate,
            });
            course.customers.push(customerExists._id);

            await course.save();
            await customerExists.save();
            return NextResponse.json({ message: "Success." });
        } else {
            const customerCourses = [];
            const currentDate = new Date();

            customerCourses.push({
                course: body.course,
                purchaseDate: currentDate,
            });

            const customerData = {
                email: body.email,
                name: body.name,
                courses: customerCourses,
            };

            const newCustomer = new Customer(customerData);

            course.customers.push(newCustomer._id);

            await course.save();
            await newCustomer.save();

            return NextResponse.json({ message: "Success." });
        }
    } catch (err) {
        return NextResponse.json(
            {
                errorMessage: "Error creating customer",
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
