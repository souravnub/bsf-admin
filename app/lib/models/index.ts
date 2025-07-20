import mongoose, { Schema } from "mongoose";

export enum ModelNames {
    AboutPageContent = "AboutPageContent",
    Admin = "Admin",
    Contact = "Contact",
    Course = "Course",
    CourseCategory = "CourseCategory",
    Customer = "Customer",
    HiringMessage = "HiringMessage",
    Instructor = "Instructor",
    Review = "Review",
    SocialCategory = "SocialCategory",
    Video = "Video",
    WebsiteContent = "WebsiteContent",
}

export function getModel(model: ModelNames, schema: Schema) {
    return (
        mongoose.models[ModelNames[model]] ||
        mongoose.model(ModelNames[model], schema)
    );
}
