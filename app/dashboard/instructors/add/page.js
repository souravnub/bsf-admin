import React from "react";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import { fetchSocialCategories } from "@/app/lib/data";
import DynamicSocialsList from "@/app/ui/dashboard/instructors/add/DynamicSocialsList";

const AddInstructor = async () => {
    const categories = await fetchSocialCategories();

    return (
        <div className={styles.container}>
            <form className={styles.form}>
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

                    <DynamicSocialsList
                        categories={JSON.stringify(categories)}
                    />
                </div>

                <button
                    className={styles.button}
                    style={{
                        padding: "10px 20px",
                        width: "auto",
                        marginTop: "1.3rem",
                    }}
                >
                    submit
                </button>
            </form>
        </div>
    );
};

export default AddInstructor;
