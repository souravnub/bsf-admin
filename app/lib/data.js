import { Admin, Course, CourseCategory, Customer } from "./models";
import { connectToDB } from "./utils";

export const fetchAdmins = async (q, page) => {
    const regex = new RegExp(q, "i");

    const ITEM_PER_PAGE = 10;

    try {
        connectToDB();
        const count = await Admin.find({ username: { $regex: regex } }).count();
        const users = await Admin.find({ username: { $regex: regex } })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));
        return { count, users };
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch admins!");
    }
};

export const fetchAdmin = async (id) => {
    console.log(id);
    try {
        connectToDB();
        const user = await Admin.findById(id);
        return user;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch admin!");
    }
};

export const fetchCustomers = async (q, page) => {
    const regex = new RegExp(q, "i");

    const ITEM_PER_PAGE = 10;

    try {
        connectToDB();
        const count = await Customer.find({
            username: { $regex: regex },
        }).count();
        const users = await Customer.find({ username: { $regex: regex } })
            .limit(ITEM_PER_PAGE)
            .skip(ITEM_PER_PAGE * (page - 1));
        return { count, users };
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch customers!");
    }
};

export const fetchCustomer = async (id) => {
    console.log(id);
    try {
        connectToDB();
        const user = await Customer.findById(id);
        return user;
    } catch (err) {
        console.log(err);
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

        console.log(courses);

        return { count, courses };
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch courses!");
    }
};

export const fetchCourse = async (id) => {
    try {
        connectToDB();
        const course = await Course.findById(id);
        return course;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch course!");
    }
};

export const fetchCategories = async () => {
    try {
        connectToDB();

        const categories = await CourseCategory.find();
        return categories;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch course categories!");
    }
};

// DUMMY DATA

export const cards = [
    {
        id: 1,
        title: "Total Users",
        number: 10.928,
        change: 12,
    },
    {
        id: 2,
        title: "Stock",
        number: 8.236,
        change: -2,
    },
    {
        id: 3,
        title: "Revenue",
        number: 6.642,
        change: 18,
    },
];
