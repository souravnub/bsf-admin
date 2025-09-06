"use server";

import { ObjectId } from "mongoose";
import { AboutPageContent } from "./models/AboutPageContent";
import { Admin } from "./models/Admin";
import { Contact } from "./models/Contact";
import { Course, ICourseDocument } from "./models/Course";
import { CourseCategory } from "./models/CourseCategory";
import { Customer, ICustomerDocument } from "./models/Customer";
import { HiringMessage } from "./models/HiringMessages";
import { IInstructorDocument, Instructor } from "./models/Instructors";
import { IPaymentDocument, Payment } from "./models/Payments";
import { Review } from "./models/Review";
import { SocialCategory } from "./models/SocialCategories";
import { WebsiteContent } from "./models/WebsiteContent";
import { connectToDB, convertToDollars } from "./utils";
import moment from "moment";

export const fetchAdmins = async (q, page) => {
    const regex = new RegExp(q, "i");

    const ITEM_PER_PAGE = 10;

    try {
        connectToDB();
        const count = await Admin.find({ username: { $regex: regex } }).count();
        const admins = await Admin.find({ username: { $regex: regex } })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));
        return { count, admins };
    } catch (err) {
        throw new Error("Failed to fetch admins!");
    }
};

export const fetchInstructors = async () => {
    try {
        connectToDB();
        const instructors = await Instructor.find({});
        return instructors;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch Instructors");
    }
};
export const fetchInstructor = async (id) => {
    try {
        connectToDB();
        const instructor = await Instructor.findById(id);
        return instructor;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch Instructor");
    }
};

export const fetchAdmin = async (id) => {
    try {
        connectToDB();
        const admin = await Admin.findById(id);

        return admin;
    } catch (err) {
        throw new Error("Failed to fetch admin!");
    }
};

export const fetchCustomers = async (q) => {
    const regex = new RegExp(q, "i");

    try {
        connectToDB();
        const customers = await Customer.find({ email: { $regex: regex } });
        return { customers };
    } catch (err) {
        throw new Error("Failed to fetch customers!");
    }
};

export const fetchCustomer = async (id) => {
    try {
        connectToDB();
        const user = await Customer.findById(id)
            .populate("courses.course")
            .exec();
        return user;
    } catch (err) {
        throw new Error("Failed to fetch customer!");
    }
};

export const fetchCourses = async (q, page) => {
    const regex = new RegExp(q, "i");

    const ITEM_PER_PAGE = 10;

    try {
        connectToDB();
        const count = await Course.find({ name: { $regex: regex } }).count();
        const courses = await Course.find({ name: { $regex: regex } })
            .populate("category")
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1))
            .exec();

        return { count, courses };
    } catch (err) {
        throw new Error("Failed to fetch courses!");
    }
};

export const fetchCourseCustomers = async (courseId) => {
    try {
        connectToDB();
        const course = await Course.findById(courseId)
            .populate<{ customers: ICustomerDocument[] }>("customers")
            .exec();
        return course.customers;
    } catch (err) {
        throw new Error("Failed to fetch course!");
    }
};

export const fetchCourse = async (id) => {
    try {
        connectToDB();
        const course = await Course.findById(id)
            .populate("category")
            .populate<{ instructor: IInstructorDocument }>("instructor")
            .exec();
        return course;
    } catch (err) {
        throw new Error("Failed to fetch course!");
    }
};

export const fetchReviews = async (id = null) => {
    try {
        connectToDB();

        const reviews = await Review.find(id && { _id: id })
            .populate("customerId", "email -_id")
            .populate("courseId", "name -_id")
            .exec();

        const output = reviews.map((review) => {
            const r = {
                ...review._doc,
                customerEmail: review.customerId.email,
                courseName: review.courseId.name,
            };
            delete r.customerId;
            delete r.courseId;
            return r;
        });

        return output;
    } catch (err) {
        throw new Error("Failed to fetch reviews");
    }
};

export const fetchCategories = async () => {
    try {
        connectToDB();

        const categories = await CourseCategory.find({});
        return categories;
    } catch (error) {
        throw new Error("Failed to fetch course categories!");
    }
};

export const fetchSocialCategories = async () => {
    try {
        connectToDB();

        const categories = await SocialCategory.find();
        return categories;
    } catch (error) {
        console.log(error);
        throw new Error("Faild to fetch social categories!");
    }
};

export const fetchHiringRequests = async () => {
    connectToDB();
    const messages = await HiringMessage.find({});
    const messageWithFormattedDate = messages.map((message) => {
        const formattedDate = moment(message.createdAt).format("MMM D, dddd");
        return {
            ...message._doc,
            createdAt: formattedDate,
        };
    });
    return messageWithFormattedDate;
};

export const fetchMessages = async (q, page, sortBy) => {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;

    try {
        connectToDB();

        let query = Contact.find({
            $or: [{ firstName: regex }, { lastName: regex }],
        });

        switch (sortBy) {
            case "newest_first":
                query = query.find({ replied: false }).sort({ createdAt: -1 }); // Sort by latest date
                break;
            case "oldest":
                query = query.find({ replied: false }).sort({ createdAt: 1 }); // Sort by oldest date
                break;
            case "replied_to":
                query = query.find({ replied: true }); // Filter by replied messages
                break;
            default:
                // For other cases or default sorting
                query = query.sort({ createdAt: -1 }); // Default: Sort by latest date
                break;
        }

        const count = await Contact.countDocuments({
            $or: [{ firstName: regex }, { lastName: regex }],
        });

        const messages = await query
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1))
            .exec();

        const messageWithFormattedDate = messages.map((message) => {
            const formattedDate = moment(message.createdAt).format(
                "MMM D, dddd"
            );
            return {
                ...message._doc,
                createdAt: formattedDate,
            };
        });

        return { count, messages: messageWithFormattedDate };
    } catch (err) {
        throw new Error("Failed to fetch messages!");
    }
};

export const dashboardData = async () => {
    try {
        connectToDB();

        const studentsCount = await Customer.countDocuments();
        const payments = await Payment.find()
            .populate<{ customerId: ICustomerDocument }>("customerId")
            .populate<{ courseId: ICourseDocument }>("courseId")
            .sort([["createdAt", -1]]);

        const latestPayments = payments.slice(0, 3).map((payment) => ({
            customer: payment.customerId.name,
            course: payment.courseId.name,
            date: moment(payment.createdAt).format("YYYY MMMM DD"),
            amountPaid: convertToDollars(payment.amountPaidCents),
        }));

        let revenue = payments.reduce(
            (accumulator, paymentDoc) =>
                accumulator + paymentDoc.amountPaidCents,
            0
        );

        let totalCoursesSold = payments.length;

        return {
            studentsCount,
            latestPayments,
            // revenue in dollars
            revenue: convertToDollars(revenue),
            totalCoursesSold,
        };
    } catch (error) {
        console.error("Error in dashboard data:", error);
        throw error;
    }
};

export type DashboardChartData = Record<string, number>[];

export const getDashboardChartData = async (): Promise<DashboardChartData> => {
    await connectToDB();

    const dataForChart = await Payment.aggregate([
        // Step 1: Get all courses once
        {
            $facet: {
                courseList: [
                    {
                        $lookup: {
                            from: "courses",
                            pipeline: [{ $project: { _id: 1, name: 1 } }],
                            as: "courses",
                        },
                    },
                    { $unwind: "$courses" },
                    { $replaceRoot: { newRoot: "$courses" } },
                ],
                sales: [
                    {
                        $group: {
                            _id: {
                                month: { $month: "$createdAt" },
                                courseId: "$courseId",
                            },
                            totalAmount: { $sum: "$amountPaidCents" },
                        },
                    },
                    {
                        $set: {
                            totalAmount: { $divide: ["$totalAmount", 100] },
                        },
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id.courseId",
                            foreignField: "_id",
                            as: "course",
                        },
                    },
                    { $unwind: "$course" },
                    {
                        $project: {
                            month: "$_id.month",
                            courseName: "$course.name",
                            totalAmount: 1,
                        },
                    },
                ],
            },
        },

        // Step 2: Cross join months and courses
        {
            $project: {
                courseList: 1,
                sales: 1,
                months: [
                    { num: 1, name: "jan" },
                    { num: 2, name: "feb" },
                    { num: 3, name: "mar" },
                    { num: 4, name: "apr" },
                    { num: 5, name: "may" },
                    { num: 6, name: "jun" },
                    { num: 7, name: "jul" },
                    { num: 8, name: "aug" },
                    { num: 9, name: "sep" },
                    { num: 10, name: "oct" },
                    { num: 11, name: "nov" },
                    { num: 12, name: "dec" },
                ],
            },
        },

        // Step 3: For each month, fill in all courses
        {
            $project: {
                months: {
                    $map: {
                        input: "$months",
                        as: "m",
                        in: {
                            month: "$$m.name",
                            courses: {
                                $map: {
                                    input: "$courseList",
                                    as: "c",
                                    in: {
                                        k: "$$c.name",
                                        v: {
                                            $let: {
                                                vars: {
                                                    found: {
                                                        $first: {
                                                            $filter: {
                                                                input: "$sales",
                                                                cond: {
                                                                    $and: [
                                                                        {
                                                                            $eq: [
                                                                                "$$this.month",
                                                                                "$$m.num",
                                                                            ],
                                                                        },
                                                                        {
                                                                            $eq: [
                                                                                "$$this.courseName",
                                                                                "$$c.name",
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                                as: "this",
                                                            },
                                                        },
                                                    },
                                                },
                                                in: {
                                                    $ifNull: [
                                                        "$$found.totalAmount",
                                                        0,
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        // Step 4: Convert course array into object
        {
            $project: {
                months: {
                    $map: {
                        input: "$months",
                        as: "m",
                        in: {
                            $mergeObjects: [
                                { month: "$$m.month" },
                                { $arrayToObject: "$$m.courses" },
                            ],
                        },
                    },
                },
            },
        },

        // Step 5: Flatten result
        { $unwind: "$months" },
        { $replaceRoot: { newRoot: "$months" } },
    ]);

    return dataForChart as unknown as DashboardChartData;
};

export const getLatestTransactions = async () => {
    try {
        const latestTransactions = await Customer.aggregate([
            {
                $unwind: "$courses",
            },
            {
                $unwind: {
                    path: "$courses",
                    includeArrayIndex: "index",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    email: { $first: "$email" },
                    name: { $first: "$name" },
                    latestCourse: { $last: "$courses.course" },
                    latestPurchaseDate: { $last: "$courses.purchaseDate" },
                },
            },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    name: 1,
                    latestCourse: 1,
                    latestPurchaseDate: 1,
                },
            },
            { $limit: 5 },
        ]);

        return latestTransactions;
    } catch (error) {
        console.error("Error retrieving latest transactions:", error);
        return [];
    }
};

export const fetchHomeContent = async () => {
    connectToDB();

    try {
        const homeContent = await WebsiteContent.find({});

        return { homeContent };
    } catch (error) {
        throw new Error(`Error fetching home content: ${error.message}`);
    }
};

export const fetchAboutContent = async () => {
    connectToDB();

    try {
        const aboutContent = await AboutPageContent.findById(
            "659c61e132b7030a5d069033"
        );
        return aboutContent;
    } catch (err) {
        console.log(err);
        throw new Error(`Error fetching about content`);
    }
};

export const fetchContactInfo = async () => {
    connectToDB();

    try {
        const contactInfo = await WebsiteContent.findOne({});
        return contactInfo.contact;
    } catch (err) {
        console.log(err);
        throw new Error(`Error fetching about content`);
    }
};

export const fetchPayments = async (): Promise<
    (Omit<IPaymentDocument, "courseId" | "customerId"> & {
        courseId: { _id: ObjectId; name: string };
        customerId: { _id: ObjectId; name: string };
    })[]
> => {
    connectToDB();

    try {
        const payments = await Payment.find()
            .populate<{ customerId: { _id: ObjectId; name: string } }>(
                "customerId",
                "name"
            )
            .populate<{ courseId: { _id: ObjectId; name: string } }>(
                "courseId",
                "name"
            )
            .exec();

        return payments;
    } catch (err) {
        console.log("erorr while fetching payments", err);
        throw new Error("Error fetching payments");
    }
};

fetchPayments();
