import { Course } from "@/app/lib/models/Course";
import { Customer } from "@/app/lib/models/Customer";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();

        const body = await request.json();

        const customer = await Customer.findOne({ email: body.email });
        const course = await Course.findOne({ _id: body.course });

        if (customer) {
            // case: customer already exists

            const now = new Date();
            const courseEnrolled = body.course;
            const isAlreadyEnrolledInCourse = customer.courses.find(
                (course) => course.course === courseEnrolled
            );

            if (isAlreadyEnrolledInCourse) {
                // should be an Invalid State as customer should not be able to enroll for a course twice
                return NextResponse.json({
                    message:
                        "Success. (customer was already enrolled in course)",
                });
            }

            customer.courses.push({
                course: courseEnrolled,
                purchaseDate: now,
            });
            course.customers.push(customer._id);

            await course.save();
            const createdCustomer = await customer.save();
            return NextResponse.json({
                message: "Success",
                customer: createdCustomer,
            });
        } else {
            const customerCourses = [];
            const now = new Date();

            customerCourses.push({
                course: body.course,
                purchaseDate: now,
            });

            const customerData = {
                email: body.email.toLowerCase(),
                name: body.name,
                courses: customerCourses,
            };

            const newCustomer = new Customer(customerData);

            course.customers.push(newCustomer._id);

            await course.save();
            const createdCustomer = await newCustomer.save();
            return NextResponse.json({
                message: "Success",
                customer: createdCustomer,
            });
        }
    } catch (err) {
        console.log("error while creating customer.", err);
        return NextResponse.json(
            {
                errorMessage: err.message,
                error: true,
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
