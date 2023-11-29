import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 20,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const customerSchema = new mongoose.Schema(
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
        courses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                },
                purchaseDate: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const courseCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
});

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

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide first name"],
        },
        lastName: {
            type: String,
            required: [true, "Please provide last name"],
        },
        interestCategories: [{ type: String }],
        email: {
            type: String,
            required: [true, "Please provide email"],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ],
        },
        message: {
            type: String,
            trim: true,
            minLength: [10, "message should be atleast 10 characters"],
        },
    },
    { timestamps: true }
);

export const Admin =
    mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export const Customer =
    mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export const Course =
    mongoose.models.Course || mongoose.model("Course", courseSchema);

export const CourseCategory =
    mongoose.models.CourseCategory ||
    mongoose.model("CourseCategory", courseCategorySchema);

export const Contact =
    mongoose.models.Contact || mongoose.model("Contact", contactSchema);
