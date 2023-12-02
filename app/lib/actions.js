"use server";

import { revalidatePath } from "next/cache";
import { Admin } from "./models/Admin";
import { Course } from "./models/Course";
import { CourseCategory } from "./models/CourseCategory";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";
import { cloudinary } from "../cloudinaryConfig";
import { Video } from "./models/Video";

function getImageUrl(fileName) {
    const baseUrl =
        "https://res.cloudinary.com/dmssr3ii7/image/upload/v1700699608/my-uploads";
    const imageUrl = `${baseUrl}/${fileName}.jpg`;

    return imageUrl;
}

export const addAdmin = async (formData) => {
    const { username, password } = Object.fromEntries(formData);

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Admin({
            username,
            password: hashedPassword,
        });

        await newUser.save();
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create admin!");
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
};

export const updateAdmin = async (formData) => {
    const { id, username, password } = Object.fromEntries(formData);

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateFields = {
            username,
            password: hashedPassword,
        };

        await Admin.findByIdAndUpdate(id, updateFields);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to update user!");
    }

    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
};

export const addCourse = async (formData) => {
    const features = [];
    const prequisites = [];

    for (let [key, value] of formData.entries()) {
        if (key === "feature") {
            features.push(value);
        } else if (key === "prerequisite") {
            prequisites.push(value);
        }
    }

    const { name, category, image, price, description } =
        Object.fromEntries(formData);

    const categoryExists = await CourseCategory.find({ category: category });

    if (categoryExists.length == 0) {
        connectToDB();
        const newCategory = new CourseCategory({
            category,
        });
        await newCategory.save();

        const imageUrl = getImageUrl(image.name);

        try {
            connectToDB();

            const newCourse = new Course({
                name,
                category: newCategory._id,
                image: imageUrl,
                description,
                features,
                prequisites,
                price,
            });

            await newCourse.save();
        } catch (err) {
            console.log(err);
            throw new Error("Failed to create course!");
        }
    } else {
        const imageUrl = getImageUrl(image.name);
        try {
            connectToDB();

            const newCourse = new Course({
                name,
                category,
                image: imageUrl,
                description,
                features,
                prequisites,
                price,
            });

            await newCourse.save();
        } catch (err) {
            console.log(err);
            throw new Error("Failed to create course!");
        }
    }
    revalidatePath("/dashboard/courses");
    redirect("/dashboard/courses");
};

async function deleteImageFromCloudinary(id) {
    const oldCourse = await Course.findById(id);
    const parts = oldCourse.image.split("/");
    const filenameWithExtension = parts[parts.length - 1];
    const filenameParts = filenameWithExtension.split(".");
    const imageName = filenameParts.slice(0, -1).join(".");

    cloudinary.v2.api.delete_resources([`my-uploads/${imageName}`], {
        type: "upload",
        resource_type: "image",
    });
}

export const updateCourse = async (formData) => {
    const features = [];
    const prequisites = [];

    for (let [key, value] of formData.entries()) {
        if (key === "feature") {
            features.push(value);
        } else if (key === "prerequisite") {
            prequisites.push(value);
        }
    }

    const { id, name, category, image, price, description } =
        Object.fromEntries(formData);

    deleteImageFromCloudinary(id);

    const categoryExists = await CourseCategory.find({ category: category });

    if (categoryExists.length == 0) {
        connectToDB();
        const newCategory = new CourseCategory({
            category,
        });
        await newCategory.save();

        if (image !== undefined) {
            const imageUrl = getImageUrl(image.name);

            try {
                connectToDB();

                const updateFields = {
                    name,
                    category: newCategory._id,
                    image: imageUrl,
                    description,
                    features,
                    prequisites,
                    price,
                };

                await Course.findByIdAndUpdate(id, updateFields);
            } catch (err) {
                console.log(err);
                throw new Error("Failed to create course!");
            }
        } else {
            try {
                connectToDB();

                const updateFields = {
                    name,
                    category: newCategory._id,
                    description,
                    features,
                    prequisites,
                    price,
                };

                await Course.findByIdAndUpdate(id, updateFields);
            } catch (err) {
                console.log(err);
                throw new Error("Failed to create course!");
            }
        }
    } else {
        if (image !== undefined) {
            const imageUrl = getImageUrl(image.name);

            try {
                connectToDB();

                const updateFields = {
                    name,
                    category,
                    image: imageUrl,
                    description,
                    features,
                    prequisites,
                    price,
                };

                await Course.findByIdAndUpdate(id, updateFields);
            } catch (err) {
                console.log(err);
                throw new Error("Failed to create course!");
            }
        } else {
            try {
                connectToDB();

                const updateFields = {
                    name,
                    category,
                    description,
                    features,
                    prequisites,
                    price,
                };

                await Course.findByIdAndUpdate(id, updateFields);
            } catch (err) {
                console.log(err);
                throw new Error("Failed to create course!");
            }
        }
    }
    revalidatePath("/dashboard/courses");
    redirect("/dashboard/courses");
};

export const deleteAdmin = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDB();
        await Admin.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to delete admin!");
    }

    revalidatePath("/dashboard/products");
};

export const deleteCourse = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDB();
        await Course.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        throw new Error("Failed to delete course!");
    }

    revalidatePath("/dashboard/products");
};

export const fetchVideoGalleryTabs = async () => {
    try {
        await connectToDB();
        const tabs = await Video.find();
        return tabs;
    } catch (err) {
        console.log(err);
        throw new Error("Error while fetching details");
    }
};

export const addUrlToGallery = async (_id, newUrl) => {
    try {
        await Video.findByIdAndUpdate(_id, { $push: { url: newUrl } });
    } catch (err) {
        throw new Error("error while adding url to the video gallery");
    }
    revalidatePath("/dashboard/content");
};
export const deleteUrlFromGallery = async (_id, url) => {
    try {
        await Video.findByIdAndUpdate(_id, { $pull: { url } });
    } catch (err) {
        throw new Error("error while deleting url from the video gallery");
    }
    revalidatePath("/dashboard/content");
};

export const authenticate = async (prevState, formData) => {
    const { username, password } = Object.fromEntries(formData);

    connectToDB();

    try {
        await signIn("credentials", { username, password });
    } catch (err) {
        return "Wrong Credentials!";
    }
};

export const sendVerificationCode = async (email) => {
    // Send a verification code to the email
};
