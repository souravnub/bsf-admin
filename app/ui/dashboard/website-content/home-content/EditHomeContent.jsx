"use client";

import { updateHomeContent } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import CharacterCountInput from "./CharacterCountInput"; // Import the custom input component
import { useEffect, useState } from "react";

function EditHomeContent({ heroText, smallHeading, bigHeading }) {
    const [heroTxt, setHeroTxt] = useState(heroText);
    const [smallHding, setSmallHding] = useState(smallHeading);
    const [bigHding, setBigHding] = useState(bigHeading);

    useEffect(() => {
        console.log(heroText, smallHding, bigHding);
    }, []);

    return (
        <>
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
                        onChange={setHeroTxt}
                        maxLength={250}
                    />

                    <CharacterCountInput
                        label='Small heading*'
                        name={"smallHeading"}
                        value={smallHding}
                        onChange={setSmallHding}
                        maxLength={20}
                    />

                    <CharacterCountInput
                        label='Big heading*'
                        name={"bigHeading"}
                        value={bigHding}
                        onChange={setBigHding}
                        maxLength={45}
                    />

                    {/* Add more CharacterCountInput components here if needed */}

                    <button
                        type='submit'
                        className={`${styles.button} ${styles.editHomeContentBtn}`}
                    >
                        Update Info
                    </button>
                </form>
            </div>
        </>
    );
}

export default EditHomeContent;
