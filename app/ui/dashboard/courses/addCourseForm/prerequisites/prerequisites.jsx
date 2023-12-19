"use client";

import { useState } from "react";
import styles from "./prerequisites.module.css";

const Prerequisites = ({ prerequisites }) => {
    const [prerequisitesInput, setPrerequisitesInput] = useState(
        prerequisites || []
    );

    const handlePrerequisiteChange = (e, index) => {
        const updatedPrerequisites = [...prerequisitesInput];
        updatedPrerequisites[index] = e.target.value;
        setPrerequisitesInput(updatedPrerequisites);
    };

    const addPrerequisite = () => {
        setPrerequisitesInput([...prerequisitesInput, " "]);
    };

    const removePrerequisite = (index) => {
        const updatedPrerequisites = [...prerequisitesInput];
        updatedPrerequisites.splice(index, 1);
        setPrerequisitesInput(updatedPrerequisites);
    };

<<<<<<< HEAD
    if (prequisites && prequisites.length > 0) {
=======
    if (prerequisites?.length > 0) {
>>>>>>> origin/development
        return (
            <div>
                <label htmlFor="prerequisites">Prerequisites (optional)</label>
                {prerequisitesInput?.map((prerequisite, index) => (
                    <div key={index} className={styles.prerequisiteItem}>
                        <input
                            type="text"
                            name="prerequisite"
                            value={prerequisite}
                            onChange={(e) => handlePrerequisiteChange(e, index)}
                        />
                        <div
                            className={styles.removePrereqBtn}
                            onClick={() => removePrerequisite(index)}>
                            &#10006;
                        </div>
                    </div>
                ))}
                <div onClick={addPrerequisite} className={styles.addPrereqBtn}>
                    Add Prerequisite
                </div>
            </div>
        );
    } else {
        return (
            <div>
<<<<<<< HEAD
                <label htmlFor='prerequisites'>Prerequisites (optional)</label>
                <div className={styles.prerequisiteItem}>
                    <input
                        type='text'
                        name='prerequisite'
                        onChange={(e) => handlePrerequisiteChange(e, 0)}
                    />
                    <div
                        className={styles.removePrereqBtn}
                        onClick={() => removePrerequisite(0)}
                    >
                        &#10006;
=======
                <label htmlFor="prerequisites">Prerequisites (optional)</label>
                {prerequisitesInput?.map((prerequisite, index) => (
                    <div key={index} className={styles.prerequisiteItem}>
                        <input
                            type="text"
                            name="prerequisite"
                            onChange={(e) => handlePrerequisiteChange(e, index)}
                        />
                        <div
                            className={styles.removePrereqBtn}
                            onClick={() => removePrerequisite(index)}>
                            &#10006;
                        </div>
>>>>>>> origin/development
                    </div>
                </div>
                <div onClick={addPrerequisite} className={styles.addPrereqBtn}>
                    Add Prerequisite
                </div>
            </div>
        );
    }
};

export default Prerequisites;
