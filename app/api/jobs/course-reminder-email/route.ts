import { renderEmailHtml, sendEmail } from "@/app/lib/emails";
import CourseReminderEmail from "@/app/lib/emails/templates/CourseReminderEmail";
import { Course, ICourseDocument } from "@/app/lib/models/Course";
import { Customer } from "@/app/lib/models/Customer";
import {
    INewsletterSubscriptionDocument,
    NewsletterSubscription,
} from "@/app/lib/models/NewsletterSubscriptions";
import { Payment } from "@/app/lib/models/Payments";
import { connectToDB } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

async function sendCourseReminderEmial(
    subscription: INewsletterSubscriptionDocument,
    coursesToSendReminderFor: ICourseDocument[]
) {
    const emailContent = renderEmailHtml(
        {
            name: subscription.name,
            upcomingCourses: coursesToSendReminderFor,
            email: subscription.email,
        },
        CourseReminderEmail
    );

    await sendEmail(
        subscription.email,
        "Wohoo! Reminder for courses",
        emailContent
    );
}

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

        for await (const subscription of newsletterSubscriptions) {
            const customer = await Customer.findOne({
                email: subscription.email,
            });

            if (!customer) {
                await sendCourseReminderEmial(
                    subscription,
                    coursesToSendReminderFor
                );
            }

            const payments = await Payment.find({
                customerId: customer._id,
            });

            const coursesNotToSendInReminder = payments.map((payment) =>
                payment.courseId.toString()
            );

            const coursesToSendInReminder = coursesToSendReminderFor.filter(
                (course) => {
                    if (
                        !coursesNotToSendInReminder.includes(
                            course._id.toString()
                        )
                    ) {
                        return course;
                    }
                }
            );

            if (coursesToSendInReminder.length === 0) {
                continue;
            }

            await sendCourseReminderEmial(
                subscription,
                coursesToSendInReminder
            );
        }

        return NextResponse.json({ success: true, message: "reminders sent" });
    } catch (err) {
        return NextResponse.json(
            {
                error: err.message,
            },
            { status: 500 }
        );
    }
}
