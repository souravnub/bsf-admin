"use client";

import React, { useRef, useState } from "react";
import styles from "./multipleImageUpload.module.css";
import webContentStyles from "../website-content.css.module.css";
import { uploadFiles } from "@/app/lib/actions";

const MultipleImageUpload = ({ images }) => {
    const inputRef = useRef();

    const [newFiles, setNewFiles] = useState([]);
    const [dataUrlFiles, setDataUrlFiles] = useState(images || []);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFileUrls, setUploadedFileUrls] = useState([]);

    const handleImageInput = (e) => {
        const files = e.target.files;
        setNewFiles(files);

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setDataUrlFiles((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImg = (image) => {
        setDataUrlFiles((prev) => prev.filter((img) => img !== image));
    };
    const handleRemoveAllImg = () => {
        const res = window.confirm("Are you sure to remove all images");

        if (res === true) {
            setDataUrlFiles([]);
            inputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        try {
            setIsLoading(true);
            Array.from(newFiles).forEach((file, idx) => {
                formData.append(`files[${idx}]`, file);
            });
            setUploadedFileUrls(await uploadFiles(formData));
            setIsLoading(false);
        } catch (err) {
            console.error("Error uploading files: ", err);
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            {dataUrlFiles.length > 0 && (
                <ul className={styles.mainImgContainer}>
                    {dataUrlFiles.map((image) => (
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

            {images.concat(uploadedFileUrls).map((url, idx) => (
                <input type="text" name={`image${idx}`} hidden value={url} />
            ))}

            <input
                ref={inputRef}
                id="files"
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageInput}
                multiple={true}
            />
            {dataUrlFiles.length !== 0 && (
                <div className={styles.btnContainer}>
                    <button
                        type="button"
                        onClick={handleRemoveAllImg}
                        className={webContentStyles.removeButton}
                        disabled={isLoading}
                    >
                        Remove All
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        Upload All
                    </button>
                </div>
            )}
        </div>
    );
};

export default MultipleImageUpload;
