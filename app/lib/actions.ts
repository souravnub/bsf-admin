"use server";

import { revalidatePath } from "next/cache";
import { Admin } from "./models/Admin";
import { Course } from "./models/Course";
import { WebsiteContent } from "./models/WebsiteContent";
import { CourseCategory } from "./models/CourseCategory";
import {
    connectToDB,
    convertToCents,
    deleteFileFromS3,
    getS3FileKey,
    getS3FileUrl,
    isURL,
    uploadFileToS3,
} from "./utils";
import { redirect } from "next/navigation";
import { signIn } from "../auth";
import { Video } from "./models/Video";
import Env from "./config/env";

import bcrypt from "bcryptjs";
import cryptoRandomString from "crypto-random-string";
import Cryptr from "cryptr";

import ForgotPasswordEmail from "./emails/templates/ForgotPasswordEmail";
import { Contact } from "./models/Contact";
import { Customer } from "./models/Customer";
import ReplyEmail from "./emails/templates/ReplyEmail";
import EmailToAll from "./emails/templates/EmailToAll";
import { AboutPageContent } from "./models/AboutPageContent";
import EmailToEnrollees from "./emails/templates/EmailToEnrollees";
import { Review } from "./models/Review";
import { HiringMessage } from "./models/HiringMessages";
import { Instructor } from "./models/Instructors";
import HiringReqReplyEmail from "./emails/templates/HiringReqReplyEmail";
import { SocialCategory } from "./models/SocialCategories";
import { NewsletterActions } from "../api/newsletter/types";
import { NewsletterSubscription } from "./models/NewsletterSubscriptions";
import { renderEmailHtml, sendEmail } from "./emails";

export const addAdmin = async (formData) => {
    const { username, password, email, isAdmin } = Object.fromEntries(formData);

    try {
        connectToDB();

        const newUser = new Admin({
            username,
            password,
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

        const updateFields: { username?: string; password?: string } = {};

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

export const addInstructor = async (formData) => {
    try {
        connectToDB();
        const socialCategories = await SocialCategory.find();
        const socialCategorieNames = socialCategories.map((c) => c.category);
        const { name, role, email, image1, description } =
            Object.fromEntries(formData);

        const socials = [];

        for (let [key, value] of formData.entries()) {
            if (socialCategorieNames.includes(key)) {
                // eliminting the select tag value pairs
                if (key !== value) {
                    socials.push({ name: key, href: value });
                }
            }
        }

        const newInstructor = new Instructor({
            name,
            role,
            email,
            imgUrl: getS3FileUrl(image1),
            socials,
            description,
        });
        await newInstructor.save();
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }

    revalidatePath("/dashboard/instructors");
    redirect("/dashboard/instructors");
};

export const updateInstructor = async (formData) => {
    try {
        connectToDB();
        const socialCategories = await SocialCategory.find();
        const socialCategorieNames = socialCategories.map((c) => c.category);
        const { id, name, role, email, image1, description } =
            Object.fromEntries(formData);

        const socials = [];

        for (let [key, value] of formData.entries()) {
            if (socialCategorieNames.includes(key)) {
                // eliminting the select tag value pairs
                if (key !== value) {
                    socials.push({ name: key, href: value });
                }
            }
        }

        let newImageUrl;
        const updateFields = {
            name,
            role,
            email,
            socials,
            description,
        };

        // imageKey is provided
        if (image1 !== "") {
            const instructor = await Instructor.findById(id);
            await deleteFile(getS3FileKey(instructor.imgUrl));
            newImageUrl = getS3FileUrl(image1);
        }

        if (newImageUrl) {
            // @ts-ignore
            updateFields.imgUrl = newImageUrl;
        }

        await Instructor.findByIdAndUpdate(id, updateFields);
    } catch (err) {
        throw new Error(err);
    }

    revalidatePath("/dashboard/instructors");
    redirect("/dashboard/instructors");
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
        link,
        priceIncludesTax,
        isInDemand,
        isActive,
        isVisibleToCustomers,
        startDate,
        endDate,
        instructor,
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

    if (isURL(link)) {
        try {
            await connectToDB();
            const imageUrl = getS3FileUrl(image1);
            const newCourse = new Course({
                name,
                // if newCategoryId is not undefined => newCategory was created.. so use that new category else use pre existed category
                category: newCategoryId ? newCategoryId : categoryFound._id,
                image: imageUrl,
                description,
                email_link: link,
                learnings: { other: otherLearnings, tools },
                schedule: {
                    startDate,
                    endDate,
                    classDays,
                },
                instructor,
                prequisites,
                jobOpportunities,
                price: convertToCents(price),
                pageTitle,
                pageSubTitle,
                priceIncludesTax: priceIncludesTax == "on" ? true : false,
                isInDemand: isInDemand == "on" ? true : false,
                isActive: isActive == "on" ? true : false,
                isVisibleToCustomers:
                    isVisibleToCustomers == "on" ? true : false,
            });

            await newCourse.save();
        } catch (err) {
            console.log(err);
            throw new Error("some error occured while adding the course");
        }
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
        instructor,
        category,
        image1,
        price,
        startDate,
        pageTitle,
        pageSubTitle,
        endDate,
        description,
        link,
        priceIncludesTax,
        isInDemand,
        isActive,
        isVisibleToCustomers,
        background,
        textColor,
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

    if (isURL(link)) {
        try {
            await connectToDB();
            const updateFields = {
                name,
                instructor,
                description,
                email_link: link,
                prequisites,
                price: convertToCents(price),
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
                isInDemand: isInDemand == "on" ? true : false,
                isActive: isActive == "on" ? true : false,
                isVisibleToCustomers:
                    isVisibleToCustomers == "on" ? true : false,
                background,
                textColor,
            };

            // newCateogryId exists
            if (newCategoryId) {
                updateFields.category = newCategoryId;
            }
            // newImageUrl exists
            if (newImageUrl) {
                // @ts-ignore
                updateFields.image = newImageUrl;
            }

            await Course.findByIdAndUpdate(id, updateFields);
        } catch (err) {
            throw new Error(err);
        }
    }
    revalidatePath("/dashboard/courses");
    redirect("/dashboard/courses");
};

export const setReviewVisibility = async (reviewId, isShown) => {
    await Review.findByIdAndUpdate(reviewId, { $set: { isShown } });
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
export const deleteInstructor = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDB();
        await Instructor.findByIdAndDelete(id);
    } catch (err) {
        throw new Error("Failed to delete instructor!");
    }

    revalidatePath("/dashboard/instructors");
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

        const fileKey = await uploadFileToS3({
            file: buffer,
            fileKey: uniqueFileName,
            fileType: file.type,
        });

        return { success: true, msg: "File uploaded successfully!", fileKey };
    } catch (error) {
        throw new Error(error);
    }
}

export const updateAboutContent = async (_, formData) => {
    connectToDB();

    try {
        const { title, description, vission, mission, strategy, video1 } =
            Object.fromEntries(formData);

        const dataToUpdate = {
            title,
            description,
            vission,
            mission,
            strategy,
        };

        if (video1 !== "") {
            const vid1 = getS3FileUrl(video1);
            // @ts-ignore
            dataToUpdate.video = vid1;
        }

        await AboutPageContent.findByIdAndUpdate("659c61e132b7030a5d069033", {
            $set: dataToUpdate,
        });
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
};

export const updateContactInfo = async (_, formData) => {
    connectToDB();

    try {
        const { msgEmail, supportEmail, phone } = Object.fromEntries(formData);

        await WebsiteContent.findByIdAndUpdate("6582621f6224f786a42635e1", {
            $set: {
                contact: {
                    msgEmail,
                    supportEmail,
                    phone,
                },
            },
        });

        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
};

export const updateHomeContent = async (_, formData) => {
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

        return {
            success: true,
        };
    } catch (error) {
        console.error(`Error updating home content: ${error.message}`);
        return {
            success: false,
        };
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

            await sendEmail(
                email,
                "Reset Password | BSF Systems",

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

        // @ts-ignore
        updateFields.password = hash;
        // @ts-ignore
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

export const sendReplyToHiringReq = async (prevState, formData) => {
    const { id, name, email, jobDesc, roleRequired, reply } =
        Object.fromEntries(formData);

    try {
        connectToDB();
        await HiringMessage.findByIdAndUpdate(JSON.parse(id), {
            repliedAt: Date.now(),
            replied: true,
            reply,
        });
        const renderedEmail = renderEmailHtml(
            {
                jobDesc,
                roleRequired,
                reply,
                name,
            },
            HiringReqReplyEmail
        );
        await sendEmail(email, "Response from BSF systems", renderedEmail);
        revalidatePath("/dashboard/hire-alumni");
    } catch (err) {
        console.error(err);
        return "Whoops. Something went wrong";
    }
};

export const sendReply = async (prevState, formData) => {
    const { firstName, lastName, email, message, reply, id } =
        Object.fromEntries(formData);

    try {
        try {
            connectToDB();
            await Contact.findByIdAndUpdate(JSON.parse(id), {
                replied: true,
                reply,
            });
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

        await sendEmail(email, "Reply from BSF Systems", renderedEmail);
        revalidatePath("/dashboard/messages");
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

        const customers = await Customer.find().select<{ email: string }>(
            "email"
        );
        const emails = Array.from(
            new Set(customers.map((customer) => customer.email))
        );

        const renderedEmail = renderEmailHtml(
            {
                message: body,
            },
            EmailToAll
        );

        await sendEmail(emails, subject, renderedEmail);

        return "Email sent successfully.";
    } catch (error) {
        return "Error sending emails.";
    }
};

export const addSocialCategory = async (newCategory) => {
    try {
        connectToDB();
        const category = new SocialCategory({ category: newCategory });
        await category.save();

        revalidatePath("/dashboard/instructors/add");
        return { success: true, msg: "category added successfully" };
    } catch (err) {
        console.log(err);
        throw new Error("error while adding a social category");
    }
};

export const sendToSelected = async (prevState, formData) => {
    const { category, subject, body } = Object.fromEntries(formData);

    try {
        connectToDB();

        const categoryId = await CourseCategory.find({ category });

        // Find courses in the specified category
        const courses = await Course.find({ category: categoryId });

        // Extract unique customer IDs from these courses
        const customerIds = courses.reduce((acc, course) => {
            acc.push(...course.customers);
            return acc;
        }, []);

        // Retrieve customers with their emails
        const customersWithEmails = await Customer.find<{ email: string }>(
            { _id: { $in: customerIds } },
            { email: 1 }
        );

        const emails = Array.from(
            new Set(customersWithEmails.map((customer) => customer.email))
        );

        // Find the category by its name
        if (emails.length < 0) {
            return "There are no students in that course category.";
        }

        const renderedEmail = renderEmailHtml(
            {
                message: body,
                category: category,
            },
            EmailToEnrollees
        );

        await sendEmail(emails, subject, renderedEmail);

        return "Email sent successfully.";
    } catch (error) {
        return "Error sending emails.";
    }
};

export const handleNewsletterRequest = async (payload: {
    action: NewsletterActions;
    data: { name?: string; email: string };
}): Promise<{ success: boolean; message: string; error?: any }> => {
    connectToDB();
    const { action } = payload;

    try {
        if (action === NewsletterActions.subscribe) {
            const { email, name } = payload.data;

            const subscription = await NewsletterSubscription.findOne({
                email,
            });

            if (!subscription) {
                // action = subscribe &  no subscription exists: create a new subscription
                await NewsletterSubscription.create({
                    email,
                    name,
                    isSubscribed: true,
                });
                return {
                    success: true,
                    message: "newsletter updated successfully",
                };
            }

            if (subscription.isSubscribed) {
                // action = subscribe & susbscription exists & the customer is already subscribed: error
                return {
                    success: false,
                    message: "subscription to newsletter already exists",
                };
            } else {
                // action = subscribe & subscription exists but is not subscribed: subscribe the customer
                await NewsletterSubscription.findOneAndUpdate(
                    { email: payload.data.email },
                    { isSubscribed: true }
                );

                return {
                    success: true,
                    message: '"newsletter updated successfully"',
                };
            }
        } else {
            // action = unsubscribe: update the subscription to unsubscribed
            await NewsletterSubscription.findOneAndUpdate(
                { email: payload.data.email },
                { isSubscribed: false }
            );
        }

        return { success: true, message: "newsletter updated successfully" };
    } catch (error) {
        return {
            success: false,
            message: "unknown error while handling newsletter action",
            error,
        };
    }
};
