"use client";

import { useState } from "react";
import styles from "./prerequisites.module.css";

const Prerequisites = () => {
    const [prerequisitesInput, setPrerequisitesInput] = useState([]);

    const handlePrerequisiteChange = (e, index) => {
        const updatedPrerequisites = [...prerequisitesInput];
        updatedPrerequisites[index] = e.target.value;
        setPrerequisitesInput(updatedPrerequisites);
    };

    const addPrerequisite = () => {
        setPrerequisitesInput([...prerequisitesInput, ""]);
    };

    const removePrerequisite = (index) => {
        const updatedPrerequisites = [...prerequisitesInput];
        updatedPrerequisites.splice(index, 1);
        setPrerequisitesInput(updatedPrerequisites);
    };

    return (
        <div>
            <label htmlFor='prerequisites'>Prerequisites (optional)</label>
            {prerequisitesInput.map((prerequisite, index) => (
                <div key={index} className={styles.prerequisiteItem}>
                    <input
                        type='text'
                        placeholder='prerequisite'
                        onChange={(e) => handlePrerequisiteChange(e, index)}
                    />
                    <div
                        className={styles.removePrereqBtn}
                        onClick={() => removePrerequisite(index)}
                    >
                        &#10006;
                    </div>
                </div>
            ))}
            <div onClick={addPrerequisite} className={styles.addPrereqBtn}>
                Add Prerequisite
            </div>
        </div>
    );
};

export default Prerequisites;
