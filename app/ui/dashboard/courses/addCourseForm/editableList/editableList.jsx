"use client";

import { useState } from "react";
import styles from "./editableList.module.css";

const EditableList = ({ list, title, name }) => {
    const [featuresInput, setFeaturesInput] = useState(
        list && list.length > 0 ? list : [""]
    );

    const handleFeatureChange = (e, index) => {
        const updatedFeatures = [...featuresInput];
        updatedFeatures[index] = e.target.value;
        setFeaturesInput(updatedFeatures);
    };

    const addFeature = () => {
        setFeaturesInput([...featuresInput, " "]);
    };

    const removeFeature = (index) => {
        if (index === 0) {
            return; // Prevent removing the first feature
        }
        const updatedFeatures = [...featuresInput];
        updatedFeatures.splice(index, 1);
        setFeaturesInput(updatedFeatures);
    };

    return (
        <div>
            <label htmlFor="features">{title}</label>
            {featuresInput.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                    <input
                        type="text"
                        name={name}
                        value={feature}
                        onChange={(e) => handleFeatureChange(e, index)}
                        required
                    />
                    {index !== 0 && (
                        <button
                            type="button"
                            className={styles.removeFeatureBtn}
                            onClick={() => removeFeature(index)}>
                            &#10006;
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addFeature}
                className={styles.addFeatureBtn}>
                Add
            </button>
        </div>
    );
};

export default EditableList;
