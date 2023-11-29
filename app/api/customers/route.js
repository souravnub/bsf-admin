import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "data" });
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
