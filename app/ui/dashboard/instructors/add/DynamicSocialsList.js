"use client";
import React, { useEffect, useState } from "react";
import SocialCategoriesSelect from "./SocialCategoriesSelect";
import styles from "./addInstructors.module.css";

const DynamicSocialsList = ({ categories, socialsList = [] }) => {
    const [socials, setSocials] = useState(
        typeof socialsList === "string" ? JSON.parse(socialsList) : socialsList
    );
    const handleSelectChange = (name, value) => {
        setSocials(
            socials.map((social) => {
                if (social.name === name) {
                    social.name = value;
                }
                if (social.name === null) {
                    social.name = value;
                }
                return social;
            })
        );
    };

    useEffect(() => {
        console.log(socials);
    }, [socials]);

    const handleValChange = (e) => {
        setSocials(
            socials.map((social) => {
                if (social.name === e.target.name) {
                    social.href = e.target.value;
                }
                return social;
            })
        );
    };
    const handleRemoveSocial = (index) => {
        setSocials(
            socials.filter((social, i) => {
                if (!(i === index)) {
                    return social;
                }
            })
        );
    };

    const handleAddSocial = () =>
        setSocials((prev) => [...prev, { name: uniqueCategories[0] }]);

    const socialCategories = socials.map((social) => social.name);
    const uniqueCategories = JSON.parse(categories)
        .map((c) => c.category)
        .filter((c) => {
            if (!socialCategories.includes(c)) {
                return c;
            }
        });

    return (
        <div>
            {socials.map(({ name, href }, idx) => (
                <div key={name} className={styles.contentContainer}>
                    <SocialCategoriesSelect
                        uniqueCategories={uniqueCategories}
                        name={name}
                        value={name}
                        categories={categories}
                        id="categories"
                        onChange={handleSelectChange}
                    />
                    <input
                        type="text"
                        defaultValue={href}
                        name={name}
                        onChange={handleValChange}
                    />

                    <button
                        type="button"
                        className={`${styles.button} ${styles.removeButton}`}
                        onClick={() => handleRemoveSocial(idx)}
                    >
                        remove
                    </button>
                </div>
            ))}

            <button
                type="button"
                className={`${styles.addButton} ${styles.button}`}
                disabled={uniqueCategories.length === 0}
                onClick={handleAddSocial}
            >
                Add New Social
            </button>
        </div>
    );
};

export default DynamicSocialsList;
