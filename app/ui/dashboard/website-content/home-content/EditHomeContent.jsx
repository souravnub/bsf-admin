"use client";

import { updateHomeContent } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import CharacterCountInput from "./CharacterCountInput";
import { useState } from "react";
import ImageUpload from "../../courses/addCourseForm/imageUpload/imageUpload";
import VideoUpload from "../video-upload/VideoUpload";
import FormButton from "../FormButton";
import { useFormState } from "react-dom";

function EditHomeContent({ heroText, smallHeading, bigHeading, cards }) {
    const [heroTxt, setHeroTxt] = useState(heroText);
    const [smallHding, setSmallHding] = useState(smallHeading);
    const [bigHding, setBigHding] = useState(bigHeading);

    const [data, formAction] = useFormState(updateHomeContent, {
        success: null,
    });

    return (
        <div className={styles.container}>
            <h3>Change content of the home page</h3>

            <form
                action={formAction}
                className={`${styles.form} ${styles.EditHomeContentForm}`}
            >
                <CharacterCountInput
                    label="Hero section text*"
                    name={"heroText"}
                    value={heroTxt}
                    onChange={setHeroTxt}
                    maxLength={800}
                />

                <CharacterCountInput
                    label="Small heading*"
                    name={"smallHeading"}
                    value={smallHding}
                    onChange={setSmallHding}
                    maxLength={100}
                />

                <CharacterCountInput
                    label="Big heading*"
                    name={"bigHeading"}
                    value={bigHding}
                    onChange={setBigHding}
                    maxLength={100}
                />

                <div className={styles.cardContainer}>
                    {cards.map((card, index) => (
                        <div
                            key={`card-${index}`}
                            style={{ marginTop: "1rem" }}
                        >
                            <h3>Card {index + 1}</h3>
                            <ImageUpload
                                index={index}
                                source={card.bannerImage}
                            />
                            <CharacterCountInput
                                label={`Description*`}
                                name={`description${index + 1}`}
                                value={card.description}
                                maxLength={800}
                            />
                            <VideoUpload index={index} source={card.video} />
                        </div>
                    ))}
                </div>

                <FormButton
                    className={`${styles.button} ${styles.editHomeContentBtn}`}
                    disabledContent={"Updating Info..."}
                >
                    {data.success === true || data.success === null
                        ? "Update Info"
                        : "Failed to Update!"}
                </FormButton>
                <p
                    style={{
                        fontSize: ".8rem",
                        marginTop: "1rem",
                        color: data.success ? "green" : "red",
                    }}
                >
                    {data.success === false &&
                        "Something went wrong while updating info!"}
                    {data.success === true && "Content updated successfully"}
                </p>
            </form>
        </div>
    );
}

export default EditHomeContent;
