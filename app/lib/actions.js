"use server";

import { revalidatePath } from "next/cache";
import { Admin } from "./models/Admin";
import { Course } from "./models/Course";
import { WebsiteContent } from "./models/WebsiteContent";
import { CourseCategory } from "./models/CourseCategory";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";
import { cloudinary } from "../cloudinaryConfig";
import { Video } from "./models/Video";

function getImageUrl(fileName, type) {
    const baseUrl =
        "https://res.cloudinary.com/dmssr3ii7/image/upload/v1700699608/my-uploads";
    const imageUrl = `${baseUrl}/${fileName}.${
        type === "image" ? ".jpg" : ".mp4"
    }`;

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

const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export const addCourse = async (formData) => {
    const tools = [];
    const otherLearnings = [];
    const prequisites = [];
    const jobOpportunities = [];
    const classDays = {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
    };

    for (let [key, value] of formData.entries()) {
        days.forEach((day) => {
            if (key === day && value && classDays[day].from === undefined) {
                classDays[day].from = value;
            } else if (
                key === day &&
                value &&
                classDays[day].from !== undefined
            ) {
                classDays[day].to = value;
            }
        });

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
        startDate,
        endDate,
    } = Object.fromEntries(formData);

    const categoryFound = await CourseCategory.findOne({ category: category });

    let newCategoryId;
    if (categoryFound === null) {
        connectToDB();
        const newCategory = new CourseCategory({
            category,
        });

        const savedCategory = await newCategory.save();
        newCategoryId = savedCategory._id;
    }

    try {
        await connectToDB();
        const imageUrl = getImageUrl(image.name, "image");
        const newCourse = new Course({
            name,
            // if newCategoryId is not undefined => newCategory was created.. so use that new category else use pre existed category
            category: newCategoryId ? newCategoryId : categoryFound._id,
            image: imageUrl,
            description,
            learnings: { other: otherLearnings, tools },
            schedule: {
                startDate,
                endDate,
                classDays,
            },
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
    const classDays = {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
    };

    for (let [key, value] of formData.entries()) {
        days.forEach((day) => {
            if (key === day && value && classDays[day].from === undefined) {
                classDays[day].from = value;
            } else if (
                key === day &&
                value &&
                classDays[day].from !== undefined
            ) {
                classDays[day].to = value;
            }
        });

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
        startDate,
        endDate,
        description,
        priceIncludesTax,
        isInDemand,
    } = Object.fromEntries(formData);

    deleteImageFromCloudinary(id);

    const categoryFound = await CourseCategory.findOne({ category: category });

    let newCategoryId;
    let newImageUrl;

    if (categoryFound === null) {
        connectToDB();
        const newCategory = new CourseCategory({
            category,
        });

        const savedCategory = await newCategory.save();
        newCategoryId = savedCategory._id;
    }
    // if the image is provided in the form entries
    if (image !== undefined) {
        newImageUrl = getImageUrl(image.name, "image");
    }

    try {
        await connectToDB();
        const updateFields = {
            name,
            description,
            prequisites,
            price,
            category: newCategoryId ? newCategoryId : categoryFound._id,
            learnings: {
                tools,
                other: otherLearnings,
            },
            schedule: {
                startDate,
                endDate,
                classDays,
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
        await Video.findByIdAndUpdate(_id, { $push: { videos: newUrl } });
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
    await connectToDB();
    const newCategory = new Video({ name, videos: [] });
    await newCategory.save();
    try {
    } catch (err) {
        throw new Error("error while adding new video gallery category");
    }
    revalidatePath("/dashboard/content");
};

export const deleteUrlFromGallery = async (_id, url) => {
    try {
        await connectToDB();
        await Video.findByIdAndUpdate(_id, { $pull: { videos: url } });
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

export const updateHomeContent = async (formData) => {
    connectToDB();

    try {
        const {
            heroText,
            smallHeading,
            bigHeading,
            image1,
            description1,
            video1,
            image2,
            description2,
            video2,
            image3,
            description3,
            video3,
        } = Object.fromEntries(formData);

        const img1 = getImageUrl(image1.name, "image");
        const img2 = getImageUrl(image2.name, "image");
        const img3 = getImageUrl(image3.name, "image");

        const vid1 = getImageUrl(video1.name, "video");
        const vid2 = getImageUrl(video2.name, "video");
        const vid3 = getImageUrl(video3.name, "video");

        const cardsData = [
            {
                bannerImage: img1,
                description: description1,
                video: vid1,
            },
            {
                bannerImage: img2,
                description: description2,
                video: vid2,
            },
            {
                bannerImage: img3,
                description: description3,
                video: vid3,
            },
        ];

        const homeContent = await WebsiteContent.findByIdAndUpdate(
            "6582621f6224f786a42635e1",
            {
                heroText,
                section: { smallHeading, bigHeading, cards: cardsData },
            }
        );

        if (!homeContent) {
            throw new Error("Content not found");
        }

        await homeContent.save();
    } catch (error) {
        throw new Error(`Error updating home content: ${error.message}`);
    }
};
