import React from "react";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import SocialCategoriesSelect from "@/app/ui/dashboard/instructors/add/SocialCategoriesSelect";

const AddInstructor = () => {
    return (
        <div className={styles.container}>
            <form action="" className={styles.form}>
                <ImageUpload />

                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" />
                </div>
                <div>
                    <label htmlFor="role">Role</label>
                    <input type="text" id="role" name="role" />
                </div>
                <div>
                    <label htmlFor="categories">Socials</label>
                    <SocialCategoriesSelect id="categories" />
                </div>
            </form>
        </div>
    );
};

export default AddInstructor;
