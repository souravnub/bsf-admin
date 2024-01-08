import { Course } from "@/app/lib/models/Course";
import { connectToDB } from "@/app/lib/utils";
import { NextResponse } from "next/server";

const getDate = (date) => {
    return date.split("T")[0];
};

export async function GET(request) {
    connectToDB();
    // [{title, start, end, allDay:true, background, textColor}]

    const courses = await Course.find({});

    const events = courses.map(({ pageTitle, schedule }) => ({
        title: pageTitle,
        start: getDate(schedule?.startDate),
        end: getDate(schedule?.endDate),
        allDay: true,
    }));

    return NextResponse.json(events);
}