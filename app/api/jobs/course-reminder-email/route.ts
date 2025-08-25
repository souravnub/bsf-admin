import { renderEmailHtml, sendEmail } from "@/app/lib/emails";
import CourseReminderEmail from "@/app/lib/emails/templates/CourseReminderEmail";
import { Course } from "@/app/lib/models/Course";
import { NewsletterSubscription } from "@/app/lib/models/NewsletterSubscriptions";
import { connectToDB } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response("Unauthorized", {
                status: 401,
            });
        }

        const now = new Date();
        connectToDB();

        const newsletterSubscriptions = await NewsletterSubscription.find();

        if (newsletterSubscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                message: "skipping job as no subscriptions found",
            });
        }

        const courses = await Course.find();
        const coursesToSendReminderFor = courses.filter((course) => {
            const startDate = new Date(course.schedule.startDate);

            if (startDate > now) {
                return course;
            }
        });

        const emailPromises = newsletterSubscriptions.map((subscription) => {
            const emailContent = renderEmailHtml(
                {
                    name: subscription.name,
                    upcomingCourses: coursesToSendReminderFor,
                },
                CourseReminderEmail
            );

            return sendEmail(
                subscription.email,
                "Wohoo! Reminder for courses",
                emailContent
            );
        });

        await Promise.all(emailPromises);

        return NextResponse.json({ success: true, message: "reminder sent" });
    } catch (err) {
        return NextResponse.json(
            {
                error: err.message,
            },
            { status: 500 }
        );
    }
}
