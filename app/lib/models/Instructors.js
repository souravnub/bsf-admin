const { default: mongoose } = require("mongoose");

const InstructorSchema = mongoose.Schema({
    imgUrl: {
        type: String,
        default: "https://bsf-web-bucket.s3.us-east-2.amazonaws.com/avatar.png",
    },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    socials: [
        {
            name: { type: String, required: true },
            href: { type: String, required: true },
        },
    ],
});

export const Instructor =
    mongoose.models.Instructor ||
    mongoose.model("Instructor", InstructorSchema);
