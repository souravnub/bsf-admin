import React from "react";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import MultipleImageUpload from "@/app/ui/dashboard/website-content/multipleImageUpload/MultipleImageUpload";

const AboutPageContent = () => {
    return (
        <div className={styles.container}>
            <h3>Change content of About page</h3>

            <form className={`${styles.form}`}>
                <div className={styles.inputContainer}>
                    <label htmlFor="title">Title*</label>
                    <input type="text" id="title" name="title" />
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="desc">Description*</label>
                    <textarea rows={8} id="desc" name="description" />
                </div>

                <h3 style={{ marginTop: "2rem" }}>Section</h3>
                <div className={styles.inputContainer}>
                    <label htmlFor="slogan">Title*</label>
                    <input id="slogan" name="sectionTitle" />
                </div>

                <MultipleImageUpload />

                <h3 style={{ marginTop: "2rem" }}>Cards</h3>
                <div className={styles.inputContainer}>
                    <label htmlFor="vission">Vission*</label>
                    <input id="vission" name="vission" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="mission">Mission*</label>
                    <input id="mission" name="mission" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="strategy">Strategy*</label>
                    <input id="strategy" name="strategy" />
                </div>
            </form>
        </div>
    );
};

export default AboutPageContent;
