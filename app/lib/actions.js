"use server";

import { revalidatePath } from "next/cache";
import { Admin } from "./models/Admin";
import { Course } from "./models/Course";
import { WebsiteContent } from "./models/WebsiteContent";
import { CourseCategory } from "./models/CourseCategory";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import { signIn } from "../auth";
import { cloudinary } from "../cloudinaryConfig";
import { Video } from "./models/Video";
import Env from "./config/env";

import bcrypt from "bcrypt";
import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";

import { triggerClientEmailSending } from "../ui/login/emails/triggerClientEmailSending";

export const addAdmin = async (formData) => {
    const { username, password, email, isAdmin } = Object.fromEntries(formData);

    try {
        connectToDB();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Admin({
            username,
            password: hashedPassword,
            email,
            isAdmin: isAdmin == "true" ? true : false,
        });

        await newUser.save();
    } catch (err) {
        throw new Error("Failed to create admin!");
    }

    revalidatePath("/dashboard/admins");
    redirect("/dashboard/admins");
};

export const updateAdmin = async (formData) => {
    let { username, password } = Object.fromEntries(formData);
    try {
        connectToDB();

        const updateFields = {};

        if (username) {
            updateFields.username = username;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updateFields.password = hash;
        }

        await Admin.updateOne({ username }, { $set: updateFields });
    } catch (err) {
        throw new Error("Failed to update user!");
    }

    revalidatePath("/dashboard/admins");
    redirect("/dashboard/admins");
};
export const checkAdminPassword = async (username, oldPassword) => {
    await connectToDB();
    const adminFound = await Admin.findOne({ username: username });
    if (!adminFound) {
        return false;
    }

    const isPassCorrect = await bcrypt.compare(
        oldPassword.trim(),
        adminFound.password
    );
    return isPassCorrect;
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
        image1,
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
        const imageUrl = getS3FileUrl(image1);
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
        image1,
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
    if (image1 !== undefined) {
        newImageUrl = getS3FileUrl(image1);
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
        throw new Error("Error while fetching details");
    }
};

export const addUrlToGallery = async ({ _id, value: newUrl }) => {
    try {
        await connectToDB();
        await Video.findByIdAndUpdate(_id, { $push: { url: newUrl } });
    } catch (err) {
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

    await signIn("credentials", { username, password });
};

export async function uploadFile(formData) {
    try {
        const file = formData.get("file");

        if (!file) {
            return { msg: "File is required.", success: false };
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const fileKey = await uploadFileToS3(buffer, file.name);

        return { success: true, msg: "File uploaded successfully!", fileKey };
    } catch (error) {
        throw new Error(error);
    }
}

function getS3FileUrl(fileName) {
    // amazon s3 replaces a " " with a +
    fileName = fileName.split(" ").join("+");
    return `https://${Env.AWS_S3_BUCKET_NAME}.s3.${Env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
}

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

        console.log(Object.fromEntries(formData));

        const homeContent = await WebsiteContent.findById(
            "6582621f6224f786a42635e1"
        );

        const cardsData = homeContent.section.cards;

        if (image1 !== "") {
            const img1 = getS3FileUrl(image1);
            cardsData[0].bannerImage = img1;
        }
        if (image2 !== "") {
            const img2 = getS3FileUrl(image2);
            cardsData[1].bannerImage = img2;
        }
        if (image3 !== "") {
            const img3 = getS3FileUrl(image3);
            cardsData[2].bannerImage = img3;
        }
        if (video1 !== "") {
            // const vid1 = getS3FileUrl(video1);
            // cardsData[0].video = vid1;
        }
        if (video2 !== "") {
            // const vid2 = getS3FileUrl(video2);
            // cardsData[1].video = vid2;
        }
        if (video3 !== "") {
            // const vid3 = getS3FileUrl(video3);
            // cardsData.video = vid3;
        }

        await WebsiteContent.findByIdAndUpdate("6582621f6224f786a42635e1", {
            heroText,
            section: {
                smallHeading,
                bigHeading,
                cards: cardsData,
            },
        });
    } catch (error) {
        throw new Error(`Error updating home content: ${error.message}`);
    }
};

export const sendLink = async (prevState, formData) => {
    connectToDB();
    const { email } = Object.fromEntries(formData);

    const admin = await Admin.findOne({ email });

    if (admin) {
        // Generate and store token
        const randomStr = cryptoRandomString({
            length: 64,
            type: "alphanumeric",
        });

        admin.password_reset_token = randomStr;
        await admin.save();

        // Encrypt user email
        const crypt = new Cryptr(Env.SECRET_KEY);
        const encrypted_email = crypt.encrypt(admin.email);

        const url = `${Env.APP_URL}/reset-password/${encrypted_email}?signature=${randomStr}`;

        try {
            await triggerClientEmailSending(email, admin.username, url);

            return "A reset link has been sent to your email. Please check your email.";
        } catch (error) {
            return "Whoops. Something went wrong.";
        }
    } else {
        return "This email is not associated with an account.";
    }
};

export const resetPassword = async (prevState, formData) => {
    const { email, signature, password, confirmPassword } =
        Object.fromEntries(formData);
    if (password === confirmPassword) {
        const updateFields = {};

        // * Decrypt string
        const crypter = new Cryptr(Env.SECRET_KEY);
        const emailDecrypted = crypter.decrypt(email);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        updateFields.password = hash;
        updateFields.password_reset_token = null;

        await Admin.updateOne(
            { email: emailDecrypted, password_reset_token: signature },
            { $set: updateFields }
        );

        redirect("/login");
    } else {
        return "Passwords do not match.";
    }
};
