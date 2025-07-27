import mongoose, { Document, Model, Schema } from "mongoose";
import { getModel, ModelNames } from ".";

interface IPayment {
    courseId: Schema.Types.ObjectId;
    customerId: Schema.Types.ObjectId;
    amountPaidCents: number;
    isConfirmationEmailSent: boolean;
}
export interface IPaymentDocument extends IPayment, Document {}
interface IPaymentModel extends Model<IPaymentDocument> {}

const paymentSchema = new mongoose.Schema<IPayment>(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.Course,
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: ModelNames.Customer,
            required: true,
        },
        amountPaidCents: {
            type: Number,
            required: true,
        },
        isConfirmationEmailSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Payment: IPaymentModel = getModel(
    ModelNames.Payment,
    paymentSchema
);
