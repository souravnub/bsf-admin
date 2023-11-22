"use client";

import { useState } from "react";
import styles from "./features.module.css";

const Features = () => {
    const [featuresInput, setFeaturesInput] = useState([""]);

    const handleFeatureChange = (e, index) => {
        const updatedFeatures = [...featuresInput];
        updatedFeatures[index] = e.target.value;
        setFeaturesInput(updatedFeatures);
    };

    const addFeature = () => {
        setFeaturesInput([...featuresInput, ""]);
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
            <label htmlFor='features'>Features*</label>
            {featuresInput.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                    <input
                        type='text'
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) => handleFeatureChange(e, index)}
                        required
                    />
                    {index !== 0 && (
                        <div
                            className={styles.removeFeatureBtn}
                            onClick={() => removeFeature(index)}
                        >
                            &#10006;
                        </div>
                    )}
                </div>
            ))}
            <div onClick={addFeature} className={styles.addFeatureBtn}>
                Add Feature
            </div>
        </div>
    );
};

export default Features;
