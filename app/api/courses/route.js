import { Course } from "@/app/lib/models/Course";
import { CourseCategory } from "@/app/lib/models/CourseCategory";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

// @params: brand_new: bool || popular: bool, category: categoryId, count: number
export async function GET() {
    try {
        connectToDB();
        // Fetch all categories
        const categories = await CourseCategory.find({});

        // Prepare the data in the desired format
        const formattedData = [];

        for (const category of categories) {
            const courses = await Course.find({ category: category._id });

            const formattedCourses = courses.map((course) => ({
                id: course._id.toString(),
                name: course.name,
                img: {
                    url: course.image,
                },
                features: course.features,
                price: course.price,
                category: category.category,
                // Add other properties as needed and map them from your model
            }));

            formattedData.push({
                category: category.category,
                courses: formattedCourses,
            });
        }

        return NextResponse.json(formattedData);
    } catch (error) {
        return NextResponse.json(
            {
                errorMessage: "Error while fetching courses",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

/*
    APIs needed-
    1. Courses (course_count?: number, popular?: boolean, brand_new: boolean )
    2. Course (id)
    3. checkIfCustomer(email) -> boolean {true if customer but no review, false if customer and review or not customer} 
    4. getReviews (numberofreviewsneeded) => customername, review_description, rating: Number, course

    5. successful_transaction(course_id, *payment_info)
    6. message_save({...message_content}) => send an email when message is saved in the db.

    * -> not sure
*/
