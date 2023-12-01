import { Review } from "./Review";

const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        customers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer",
            },
        ],

        name: {
            type: String,
            required: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseCategory",
        },

        image: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        features: [
            {
                type: String,
                required: true,
            },
        ],

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
