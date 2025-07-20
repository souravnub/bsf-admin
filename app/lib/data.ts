import { AboutPageContent } from "./models/AboutPageContent";
import { Admin } from "./models/Admin";
import { Contact } from "./models/Contact";
import { Course } from "./models/Course";
import { CourseCategory } from "./models/CourseCategory";
import { Customer, ICustomerDocument } from "./models/Customer";
import { HiringMessage } from "./models/HiringMessages";
import { Instructor } from "./models/Instructors";
import { Review } from "./models/Review";
import { SocialCategory } from "./models/SocialCategories";
import { WebsiteContent } from "./models/WebsiteContent";
import { connectToDB } from "./utils";
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
            .populate("instructor")
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
        const courses = await Course.find().populate<{
            customers: ICustomerDocument[];
        }>("customers", "email");

        let totalRevenue = 0;
        let totalCoursesSold = 0;

        courses.forEach((course) => {
            const courseCustomers = course.customers.map(
                (customer) => customer.email
            );
            const uniqueCustomers = new Set(courseCustomers);
            const courseRevenue = course.price * uniqueCustomers.size;

            totalRevenue += courseRevenue;
            totalCoursesSold += uniqueCustomers.size;
        });

        const data = [
            {
                id: 1,
                title: "Total Students",
                number: studentsCount,
            },
            {
                id: 2,
                title: "Revenue",
                number: "$" + totalRevenue,
            },
            {
                id: 3,
                title: "Total Courses Sold",
                number: totalCoursesSold,
            },
        ];

        return data;
    } catch (error) {
        console.error("Error in dashboard data:", error);
        throw error;
    }
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
