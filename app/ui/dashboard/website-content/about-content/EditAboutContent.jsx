"use client";

import { useState } from "react";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import CharacterCountInput from "../home-content/CharacterCountInput";
import { updateAboutContent } from "@/app/lib/actions";
import FormButton from "../FormButton";
import { useFormState } from "react-dom";

function EditAboutContent({
    Title,
    Description,
    Yt,
    Vission,
    Mission,
    Strategy,
}) {
    const [title, setTitle] = useState(Title);
    const [description, setDescription] = useState(Description);
    const [yt, setYt] = useState(Yt);
    const [vission, setVission] = useState(Vission);
    const [mission, setMission] = useState(Mission);
    const [strategy, setStrategy] = useState(Strategy);
    const [data, formAction] = useFormState(updateAboutContent, {
        success: null,
    });

    return (
        <div className={styles.container}>
            <h3>Change content of the About page</h3>

            <form
                action={formAction}
                className={`${styles.form} ${styles.form}`}
            >
                <CharacterCountInput
                    label="Heading*"
                    name={"title"}
                    value={title}
                    onChange={setTitle}
                    maxLength={250}
                />

                <CharacterCountInput
                    label="Description*"
                    name={"description"}
                    value={description}
                    onChange={setDescription}
                    maxLength={450}
                />

                <div className={styles.inputContainer}>
                    <label htmlFor="yt-video">Video URL</label>
                    <input
                        defaultValue={yt}
                        onChange={(e) => setYt(e.target.value)}
                        type="text"
                        id="yt-video"
                        name="yt"
                    />
                </div>

                <h3 style={{ marginTop: "2rem" }}>Cards</h3>

                <CharacterCountInput
                    label="Vission*"
                    name={"vission"}
                    value={vission}
                    onChange={setVission}
                    maxLength={150}
                />

                <CharacterCountInput
                    label="Mission*"
                    name={"mission"}
                    value={mission}
                    onChange={setMission}
                    maxLength={150}
                />

                <CharacterCountInput
                    label="Strategy*"
                    name={"strategy"}
                    value={strategy}
                    onChange={setStrategy}
                    maxLength={150}
                />

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

export default EditAboutContent;
