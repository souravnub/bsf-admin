"use client";

import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import { useState } from "react";

const CharacterCountInput = ({ label, name, value, onChange, maxLength }) => {
    const [charCount, setCharCount] = useState(value?.length);

    const handleInputChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxLength) {
            setCharCount(text.length);
            onChange && onChange(text); // Pass the updated text value to the parent component
        }
    };

    const isExceedingLimit = charCount > maxLength;

    return (
        <div className={styles.inputContainer}>
            <label>
                {label}
                <span
                    style={{
                        color: isExceedingLimit ? "red" : "var(--inputText)",
                        fontSize: "0.75rem",
                        float: "right",
                    }}
                >
                    ({charCount}/{maxLength})
                </span>
            </label>
            <input
                type="text"
                name={name}
                defaultValue={value}
                onChange={handleInputChange}
                maxLength={maxLength}
            />
        </div>
    );
};

export default CharacterCountInput;
