import { renderEmailHtml, sendEmail } from "@/app/lib/emails";
import CourseReminderEmail from "@/app/lib/emails/templates/CourseReminderEmail";
import { Course } from "@/app/lib/models/Course";
import { Customer } from "@/app/lib/models/Customer";
import { NewsletterSubscription } from "@/app/lib/models/NewsletterSubscriptions";
import { Payment } from "@/app/lib/models/Payments";
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

        for await (const subscription of newsletterSubscriptions) {
            const customer = await Customer.findOne({
                email: subscription.email,
            });

            if (!customer) {
                const emailContent = renderEmailHtml(
                    {
                        name: subscription.name,
                        upcomingCourses: coursesToSendReminderFor,
                    },
                    CourseReminderEmail
                );

                await sendEmail(
                    subscription.email,
                    "Wohoo! Reminder for courses",
                    emailContent
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

            const emailContent = renderEmailHtml(
                {
                    name: subscription.name,
                    upcomingCourses: coursesToSendInReminder,
                },
                CourseReminderEmail
            );

            await sendEmail(
                subscription.email,
                "Wohoo! Reminder for courses",
                emailContent
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
