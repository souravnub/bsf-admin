import React from "react";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import { fetchInstructor, fetchSocialCategories } from "@/app/lib/data";
import DynamicSocialsList from "@/app/ui/dashboard/instructors/add/DynamicSocialsList";
import { updateInstructor } from "@/app/lib/actions";

const UpdateInstructor = async ({ params }) => {
    const categories = await fetchSocialCategories();
    const { id } = params;
    const instructor = await fetchInstructor(id);

    return (
        <div className={styles.container}>
            <form className={styles.form} action={updateInstructor}>
                <ImageUpload source={instructor.imgUrl} />

                <input type="text" hidden name="id" defaultValue={id} />

                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        defaultValue={instructor.name}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        defaultValue={instructor.email}
                    />
                </div>
                <div>
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        required
                        defaultValue={instructor.role}
                    />
                </div>
                <div>
                    <label htmlFor="categories">Socials</label>

                    <DynamicSocialsList
                        socialsList={JSON.stringify(instructor.socials)}
                        categories={JSON.stringify(categories)}
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>

                    <textarea id="description" name="description"></textarea>
                </div>

                <button
                    className={styles.button}
                    style={{
                        padding: "10px 20px",
                        width: "auto",
                        marginTop: "1.3rem",
                    }}
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateInstructor;
