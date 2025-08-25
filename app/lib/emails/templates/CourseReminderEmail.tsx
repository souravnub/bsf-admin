import React from "react";

import {
    Section,
    Row,
    Text,
    Button,
    Hr,
    Column,
    Tailwind,
    Link,
} from "@react-email/components";
import { ICourseDocument } from "../../models/Course";

export default function CourseReminderEmail({
    name,
    upcomingCourses,
}: {
    name: string;
    upcomingCourses: ICourseDocument[];
}) {
    return (
        <Tailwind>
            <Section className="my-[16px]">
                <Section>
                    <Row>
                        <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px] capitalize">
                            Hi {name},
                        </Text>
                        <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                            Here&apos;s your weekly reminder for the exciting
                            courses starting soon! Stay ahead and don&apos;t
                            miss your chance to join in:
                        </Text>
                    </Row>
                </Section>

                <Section>
                    {upcomingCourses.map((course) => {
                        return (
                            <>
                                <Hr className="!border-gray-300 mx-0 my-[32px] w-full border border-solid" />
                                <Section>
                                    <Row>
                                        <Column className="">
                                            <Text className="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
                                                {course.name}
                                            </Text>
                                            <Text className="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                                                {course.description}
                                            </Text>
                                            <Button
                                                className="mt-2 rounded-[8px] bg-indigo-600 px-[16px] py-[12px] text-center font-semibold text-white"
                                                href={`https://bsfsystems.com/courses/${course._id}`}
                                            >
                                                Details
                                            </Button>
                                        </Column>
                                    </Row>
                                </Section>
                            </>
                        );
                    })}
                </Section>

                <Section className="mt-5">
                    <Row>
                        <strong>Warm regards,</strong>
                    </Row>
                    <Row>
                        <Text className="m-0">Banks Odole, Ph.D., PMP</Text>
                    </Row>
                    <Row>
                        <Text className="m-0">
                            Instructor, Project Management Essentials
                        </Text>
                    </Row>
                    <Row>
                        <Link
                            href="https://bsfsystems.com"
                            className="m-0 text-sm"
                        >
                            BSF Systems Inc.
                        </Link>
                    </Row>
                </Section>
            </Section>
        </Tailwind>
    );
}
