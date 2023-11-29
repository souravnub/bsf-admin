"use client";

import { useState } from "react";
import styles from "./features.module.css";

const Features = ({ features }) => {
    const [featuresInput, setFeaturesInput] = useState(features);

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

    if (features.length > 0) {
        return (
            <div>
                <label htmlFor='features'>Features*</label>
                {featuresInput.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                        <input
                            type='text'
                            name='feature'
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
    } else {
        return (
            <div>
                <label htmlFor='features'>Features*</label>
                {featuresInput.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                        <input
                            type='text'
                            name='feature'
                            placeholder={`Feature ${index + 1}`}
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
    }
};

export default Features;
