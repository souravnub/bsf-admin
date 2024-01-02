"use client";

import React, { useRef, useState } from "react";
import styles from "./multipleImageUpload.module.css";
import webContentStyles from "../website-content.css.module.css";

const MultipleImageUpload = ({ images }) => {
    const inputRef = useRef();
    const [imageFiles, setImageFiles] = useState(images || []);

    const handleImageInput = (e) => {
        const files = e.target.files;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageFiles((prev) => [...prev, reader.result]);
            };
        });
    };

    const handleRemoveImg = (image) => {
        setImageFiles((prev) => prev.filter((img) => img !== image));
    };
    const handleRemoveAllImg = () => {
        const res = window.confirm("Are you sure to remove all images");

        if (res === true) {
            setImageFiles([]);
            inputRef.current.value = "";
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            {imageFiles.length > 0 && (
                <ul className={styles.mainImgContainer}>
                    {imageFiles.map((image) => (
                        <div className={styles.imgContainer}>
                            <img src={image} />
                            <button
                                type="button"
                                className={webContentStyles.removeButton}
                                onClick={() => handleRemoveImg(image)}
                            >
                                remove
                            </button>
                        </div>
                    ))}
                </ul>
            )}

            <label htmlFor="files">Upload all image files</label>

            <input
                ref={inputRef}
                id="files"
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageInput}
                multiple={true}
            />
            {imageFiles.length !== 0 && (
                <div className={styles.btnContainer}>
                    <button
                        type="button"
                        onClick={handleRemoveAllImg}
                        className={webContentStyles.removeButton}
                    >
                        Remove All
                    </button>
                    <button>Upload All</button>
                </div>
            )}
        </div>
    );
};

export default MultipleImageUpload;
