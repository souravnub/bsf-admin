"use server";

import { revalidatePath } from "next/cache";
import { Admin } from "./models/Admin";
import { Course } from "./models/Course";
import { WebsiteContent } from "./models/WebsiteContent";
import { CourseCategory } from "./models/CourseCategory";
import {
    connectToDB,
    deleteFileFromS3,
    getS3FileKey,
    getS3FileUrl,
    uploadFileToS3,
} from "./utils";
import { redirect } from "next/navigation";
import { signIn } from "../auth";
import { Video } from "./models/Video";
import Env from "./config/env";

import bcrypt from "bcrypt";
import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";

import {
    renderEmailHtml,
    sendRenderedEmail,
} from "../ui/login/emails/renderAndSendEmail";
import ForgotPasswordEmail from "../ui/login/emails/ForgotPasswordEmail";
import { Contact } from "./models/Contact";
import { Customer } from "./models/Customer";
import ReplyEmail from "../ui/login/emails/ReplyEmail";
import EmailToAll from "../ui/login/emails/EmailToAll";
import { AboutPageContent } from "./models/AboutPageContent";

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
        pageTitle,
        pageSubTitle,
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
            pageTitle,
            pageSubTitle,
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

export async function deleteFile(fileName) {
    try {
        const fileKey = await deleteFileFromS3(fileName);
        return { success: true, msg: "File successfully deleted!", fileKey };
    } catch (error) {
        throw new Error(error);
    }
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
        pageTitle,
        pageSubTitle,
        endDate,
        description,
        priceIncludesTax,
        isInDemand,
    } = Object.fromEntries(formData);

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
    if (image1 !== "") {
        const course = await Course.findById(id);
        await deleteFile(getS3FileKey(course.image));
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
            pageTitle,
            pageSubTitle,
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
    try {
        await connectToDB();
        const newCategory = new Video({ name, videos: [] });
        await newCategory.save();
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

    await signIn("credentials", { username, password });
};

export async function uploadFile(formData) {
    try {
        const file = formData.get("file");

        if (!file) {
            return { msg: "File is required.", success: false };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueFileName = cryptoRandomString({ length: 15 });

        const fileKey = await uploadFileToS3(buffer, uniqueFileName);

        return { success: true, msg: "File uploaded successfully!", fileKey };
    } catch (error) {
        throw new Error(error);
    }
}

export const updateAboutContent = async (formData) => {
    connectToDB();

    try {
        const {
            title,
            description,
            sectionTitle,
            image1,
            image2,
            image3,
            vission,
            mission,
            strategy,
        } = Object.fromEntries(formData);

        console.log(Object.fromEntries(formData));

        const images = {};

        if (image1 !== "") {
            images.image1 = getS3FileUrl(image1);
        }
        if (image2 !== "") {
            images.image2 = getS3FileUrl(image2);
        }
        if (image3 !== "") {
            images.image3 = getS3FileUrl(image3);
        }

        await AboutPageContent.findByIdAndUpdate("6594d31fb3aceb3350a605a5", {
            $set: {
                title,
                description,
                sectionTitle,
                ...images,
                vission,
                mission,
                strategy,
            },
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
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

        const homeContent = await WebsiteContent.findById(
            "6582621f6224f786a42635e1"
        );

        const cardsData = homeContent.section.cards;

        cardsData[0].description = description1;
        cardsData[1].description = description2;
        cardsData[2].description = description3;

        if (image1 !== "") {
            const img1 = getS3FileUrl(image1);
            console.log(homeContent.section.cards[0].bannerImage);
            await deleteFile(
                getS3FileKey(homeContent.section.cards[0].bannerImage)
            );
            cardsData[0].bannerImage = img1;
        }
        if (image2 !== "") {
            const img2 = getS3FileUrl(image2);
            await deleteFile(
                getS3FileKey(homeContent.section.cards[1].bannerImage)
            );
            cardsData[1].bannerImage = img2;
        }
        if (image3 !== "") {
            const img3 = getS3FileUrl(image3);
            await deleteFile(
                getS3FileKey(homeContent.section.cards[2].bannerImage)
            );

            cardsData[2].bannerImage = img3;
        }
        if (video1 !== "") {
            const vid1 = getS3FileUrl(video1);
            await deleteFile(getS3FileKey(homeContent.section.cards[0].video));
            cardsData[0].video = vid1;
        }
        if (video2 !== "") {
            const vid2 = getS3FileUrl(video2);
            await deleteFile(getS3FileKey(homeContent.section.cards[1].video));
            cardsData[1].video = vid2;
        }
        if (video3 !== "") {
            const vid3 = getS3FileUrl(video3);
            await deleteFile(getS3FileKey(homeContent.section.cards[2].video));
            cardsData[2].video = vid3;
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

        await Admin.updateOne({ email }, { password_reset_token: randomStr });

        // Encrypt user email
        const crypt = new Cryptr(Env.SECRET_KEY);
        const encrypted_email = crypt.encrypt(admin.email);

        const url = `${Env.APP_URL}/reset-password/${encrypted_email}?signature=${randomStr}`;

        try {
            const renderedEmail = renderEmailHtml(
                {
                    name: admin.username,
                    url,
                },
                ForgotPasswordEmail
            );

            await sendRenderedEmail(
                {
                    email,
                    subject: "Reset Password | BSF Systems",
                },
                renderedEmail
            );

            return "A reset link has been sent to your email. Please check your email.";
        } catch (error) {
            console.log(error);
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

export const sendReply = async (prevState, formData) => {
    const { firstName, lastName, email, message, reply, id } =
        Object.fromEntries(formData);

    try {
        try {
            connectToDB();
            await Contact.findByIdAndUpdate(id, { replied: true });
        } catch (error) {
            console.log("error updating message");
        }

        const renderedEmail = renderEmailHtml(
            {
                message,
                reply,
                firstName,
                lastName,
            },
            ReplyEmail
        );

        await sendRenderedEmail(
            {
                email,
                subject: "Reply from BSF Systems",
            },
            renderedEmail
        );

        return "Reply has been sent successfully.";
    } catch (error) {
        return "Whoops. Something went wrong.";
    }
};
export const deleteMessage = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDB();
        await Contact.findByIdAndDelete(JSON.parse(id));
    } catch (error) {
        throw new Error("Beep Bop 🤖 Failed to delete the message");
    }
    revalidatePath("/dashboard/messages");
};

export const getCustomerCount = async () => {
    const totalCustomers = await Customer.find({}).count();

    return totalCustomers;
};

export const sendToAll = async (prevState, formData) => {
    const { subject, body } = Object.fromEntries(formData);

    try {
        connectToDB();

        const emails = await Customer.find({}, { email: 1, _id: 0 });

        const renderedEmail = renderEmailHtml(
            {
                message: body,
            },
            EmailToAll
        );

        await sendRenderedEmail(
            {
                emails,
                subject,
            },
            renderedEmail
        );

        return "Email sent successfully.";
    } catch (error) {
        return "Error sending emails.";
    }
};

export const sendToSelected = async (prevState, formData) => {
    console.log("hey.");
};
