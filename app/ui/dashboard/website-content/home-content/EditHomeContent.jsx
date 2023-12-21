"use client";

import { updateHomeContent } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import CharacterCountInput from "./CharacterCountInput";
import { useState } from "react";
import ImageUpload from "../../courses/addCourseForm/imageUpload/imageUpload";
import VideoUpload from "../video-upload/VideoUpload";

function EditHomeContent({ heroText, smallHeading, bigHeading }) {
    const [heroTxt, setHeroTxt] = useState(heroText);
    const [smallHding, setSmallHding] = useState(smallHeading);
    const [bigHding, setBigHding] = useState(bigHeading);

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    return (
        <div className={styles.container}>
            <h3>Change content of the home page</h3>

            <form
                action={updateHomeContent}
                className={`${styles.form} ${styles.EditHomeContentForm}`}
            >
                <CharacterCountInput
                    label='Hero section text*'
                    name={"heroText"}
                    value={heroTxt}
                    onChange={handleInputChange(setHeroTxt)}
                    maxLength={250}
                />

                <CharacterCountInput
                    label='Small heading*'
                    name={"smallHeading"}
                    value={smallHding}
                    onChange={handleInputChange(setSmallHding)}
                    maxLength={20}
                />

                <CharacterCountInput
                    label='Big heading*'
                    name={"bigHeading"}
                    value={bigHding}
                    onChange={handleInputChange(setBigHding)}
                    maxLength={45}
                />

                <div className={styles.cardContainer}>
                    {[1, 2, 3].map((index) => (
                        <div
                            key={`card-${index}`}
                            style={{ marginTop: "1rem" }}
                        >
                            <h3>Card {index}</h3>
                            <ImageUpload index={index} />
                            <CharacterCountInput
                                label={`Description*`}
                                name={`description${index}`}
                                value={bigHding}
                                onChange={handleInputChange(setBigHding)}
                                maxLength={130}
                            />
                            <VideoUpload index={index} />
                        </div>
                    ))}
                </div>

                <button
                    type='submit'
                    className={`${styles.button} ${styles.editHomeContentBtn}`}
                >
                    Update Info
                </button>
            </form>
        </div>
    );
}

export default EditHomeContent;
