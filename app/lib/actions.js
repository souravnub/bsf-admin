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
    const { username, password, email, isAdmin } = Object.fromEntries(formData);

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Admin({
            username,
            password: hashedPassword,
            email,
            isAdmin: isAdmin == "true" ? true : false,
        });

        await newUser.save();
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create admin!");
    }

    revalidatePath("/dashboard/admins");
    redirect("/dashboard/admins");
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
    const tools = [];
    const otherLearnings = [];
    const prequisites = [];
    const jobOpportunities = [];

    for (let [key, value] of formData.entries()) {
        if (key === "tools") {
            tools.push(value);
        } else if (key === "prerequisite") {
            prequisites.push(value);
        } else if (key == "other") {
            otherLearnings.push(value);
        } else if (key == "jobOpportunities") {
            jobOpportunities.push(value);
        }
    }

    const {
        name,
        category,
        image,
        price,
        description,
        priceIncludesTax,
        isInDemand,
    } = Object.fromEntries(formData);

    const categoryExists = await CourseCategory.findOne({ category: category });

    let newCategoryId;
    if (categoryExists === null) {
        connectToDB();
        const newCategory = new CourseCategory({
            category,
        });

        const savedCategory = await newCategory.save();
        newCategoryId = savedCategory._id;
    }

    try {
        await connectToDB();
        const imageUrl = getImageUrl(image.name);
        const newCourse = new Course({
            name,
            // if newCategoryId is not undefined => newCategory was created.. so use that new category else use pre existed category
            category: newCategoryId ? newCategoryId : category,
            image: imageUrl,
            description,
            learnings: { other: otherLearnings, tools },
            prequisites,
            jobOpportunities,
            price,
            priceIncludesTax: priceIncludesTax == "true" ? true : false,
            isInDemand: isInDemand == "true" ? true : false,
        });

        await newCourse.save();
    } catch (err) {
        console.log(err);
        throw new Error("some error occured while adding the course");
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
    const tools = [];
    const otherLearnings = [];
    const prequisites = [];
    const jobOpportunities = [];

    for (let [key, value] of formData.entries()) {
        if (key === "tools") {
            tools.push(value);
        } else if (key === "prerequisite") {
            prequisites.push(value);
        } else if (key == "other") {
            otherLearnings.push(value);
        } else if (key == "jobOpportunities") {
            jobOpportunities.push(value);
        }
    }

    const {
        id,
        name,
        category,
        image,
        price,
        description,
        priceIncludesTax,
        isInDemand,
    } = Object.fromEntries(formData);

    deleteImageFromCloudinary(id);

    const categoryExists = await CourseCategory.findOne({ category: category });

    let newCategoryId;
    let newImageUrl;

    if (categoryExists === null) {
        connectToDB();
        const newCategory = new CourseCategory({
            category,
        });

        const savedCategory = await newCategory.save();
        newCategoryId = savedCategory._id;
    }
    // if the image is provided in the form entries
    if (image !== undefined) {
        newImageUrl = getImageUrl(image.name);
    }

    try {
        await connectToDB();
        const updateFields = {
            name,
            description,
            prequisites,
            price,
            learnings: {
                tools,
                other: otherLearnings,
            },
            jobOpportunities,
            priceIncludesTax: priceIncludesTax == "true" ? true : false,
            isInDemand: isInDemand == "true" ? true : false,
        };
        // newCateogryId exists
        if (newCategoryId) {
            updateFields.category = newCategoryId;
        }
        // newImageUrl exists
        if (newImageUrl) {
            updateFields.image = newImageUrl;
        }

        await Course.findByIdAndUpdate(id, updateFields);
    } catch (err) {
        console.log(err);
        throw new Error(err);
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

export const addUrlToGallery = async ({ _id, value: newUrl }) => {
    try {
        await connectToDB();
        await Video.findByIdAndUpdate(_id, { $push: { url: newUrl } });
    } catch (err) {
        console.log(err);
        throw new Error("error while adding url to the video gallery");
    }
    revalidatePath("/dashboard/content");
};

export const deleteVideoGalleryCategory = async (_id) => {
    try {
        await connectToDB();
        await Video.findByIdAndDelete(_id);
    } catch (err) {
        throw new Error("error while deleting video gallery category");
    }
    revalidatePath("/dashboard/content");
};

export const addVideoGalleryCategory = async ({ value: name }) => {
    try {
        await connectToDB();
        const newCategory = new Video({ category: name, url: [] });
        await newCategory.save();
    } catch (err) {
        throw new Error("error while adding new video gallery category");
    }
    revalidatePath("/dashboard/content");
};

export const deleteUrlFromGallery = async (_id, url) => {
    try {
        await connectToDB();
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
