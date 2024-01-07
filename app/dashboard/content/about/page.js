import React from "react";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import ImageUpload from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload";
import { fetchAboutContent } from "@/app/lib/data";
import { updateAboutContent } from "@/app/lib/actions";
import Button from "@/app/ui/dashboard/about-content/Button";

const AboutPageContent = async () => {
    const content = await fetchAboutContent();

    return (
        <div className={styles.container}>
            <h3>Change content of About page</h3>

            <form action={updateAboutContent} className={`${styles.form}`}>
                <div className={styles.inputContainer}>
                    <label htmlFor="title">Title*</label>
                    <input
                        defaultValue={content?.title}
                        type="text"
                        id="title"
                        name="title"
                    />
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="desc">Description*</label>
                    <textarea
                        defaultValue={content?.description}
                        rows={8}
                        id="desc"
                        name="description"
                    />
                </div>

                <h3 style={{ marginTop: "2rem" }}>Section</h3>
                <div className={styles.inputContainer}>
                    <label htmlFor="slogan">Title*</label>
                    <input
                        defaultValue={content?.sectionTitle}
                        id="slogan"
                        name="sectionTitle"
                    />
                </div>

                <ImageUpload index={0} source={content?.image1} />
                <ImageUpload index={1} source={content?.image2} />
                <ImageUpload index={2} source={content?.image3} />

                <h3 style={{ marginTop: "2rem" }}>Cards</h3>
                <div className={styles.inputContainer}>
                    <label htmlFor="vission">Vission*</label>
                    <input
                        defaultValue={content?.vission}
                        id="vission"
                        name="vission"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="mission">Mission*</label>
                    <input
                        defaultValue={content?.mission}
                        id="mission"
                        name="mission"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="strategy">Strategy*</label>
                    <input
                        defaultValue={content?.strategy}
                        id="strategy"
                        name="strategy"
                    />
                </div>

                <Button disabledContent="saving....">save</Button>
            </form>
        </div>
    );
};

export default AboutPageContent;
