import { Document, Model, Schema } from "mongoose";

import { getModel, ModelNames } from ".";

interface INewsletterSubscription {
    email: string;
    name: string;
    isSubscribed: boolean;
}
export interface INewsletterSubscriptionDocument
    extends INewsletterSubscription,
        Document {}
interface INewsletterSubscriptionModel
    extends Model<INewsletterSubscriptionDocument> {}

const newsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        isSubscribed: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

export const NewsletterSubscription: INewsletterSubscriptionModel = getModel(
    ModelNames.NewsletterSubscription,
    newsletterSubscriptionSchema
);
