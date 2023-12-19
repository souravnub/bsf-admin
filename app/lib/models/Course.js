import mongoose from "mongoose";

import { Review } from "./Review";

const courseSchema = new mongoose.Schema(
    {
        customers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer",
            },
        ],

        image: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        priceIncludesTax: { type: Boolean, default: false },
        isInDemand: { type: Boolean, default: false },

        description: {
            type: String,
            required: true,
        },

        learnings: {
            tools: [{ type: String }],
            other: [{ type: String }],
        },

        schedule: {
            startDate: { type: Date, default: Date.now },
            endDate: { type: Date, required: true },
            // classDays: {monday: {from: '11pm', to: '2pm'}, saturday: {from: "10pm", to: "2pm"}}
            classDays: {
                type: Map,
                of: {
                    from: { type: String },
                    to: { type: String },
                },
            },
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseCategory",
        },

        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        prequisites: [
            {
                type: String,
            },
        ],

        price: {
            type: Number,
            required: true,
        },

        jobOpportunities: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

// method for checking if customer can review on a course or not
// if is customer && don't have a review ? true : false
courseSchema.methods.canCustomerReview = async function (customerId) {
    let reviewerIsCustomer = false;
    let customerHaveReview = false;
    const reviewsOnCoursePromises = [];

    this.customers.forEach((customer_id) => {
        if (customer_id == customerId) {
            reviewerIsCustomer = true;
        }
    });

    this.reviews.forEach((reviewId) => {
        reviewsOnCoursePromises.push(Review.findById(reviewId));
    });

    const results = await Promise.allSettled(reviewsOnCoursePromises);
    results.forEach(({ value: review }) => {
        if (review.customerId == customerId) {
            customerHaveReview = true;
        }
    });

    return reviewerIsCustomer && !customerHaveReview;
};

export const Course =
    mongoose.models.Course || mongoose.model("Course", courseSchema);
