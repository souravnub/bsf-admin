import { Course } from "@/app/lib/models";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


// @params: brand_new: bool || popular: bool, category: categoryId, count: number 
export async function GET(request) {
    await connectToDB();

    const {
        nextUrl: { search },
    } = request;
    const urlSearchParams = new URLSearchParams(search);

    // can only sort by one option at a time: either brand_new or popular
    const { popular, category, count, brand_new } = Object.fromEntries(
        urlSearchParams.entries()
    );
    const options = [];

    if (category) {
        options.push({"$match" : {category: new mongoose.Types.ObjectId(category)}});
    }
    if(popular && !brand_new) {
        options.push({"$sort": {"customerCount" : -1}})
    }
    if(brand_new && !popular) {
        options.push({"$sort": {"updatedAt": -1}})
    }
    if(count ) {
        options.push({"$limit": parseInt(count)})
    }
    

        const courses = await Course.aggregate([{
            "$project": {
            "customers": 1, 
            "name" :1, 
            "category": 1, 
            "image" :1, 
            "price": 1, 
            "createdAt": 1,
            "updatedAt": 1,
            "customerCount" : {
                "$size" : '$customers'
            }
        }}, ...options ])
    

    return NextResponse.json({ count: courses.length, courses });
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
