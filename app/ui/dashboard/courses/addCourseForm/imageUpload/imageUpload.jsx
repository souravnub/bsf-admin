"use client";

import { uploadFile } from "@/app/lib/actions";
import styles from "./imageUpload.module.css";
import Image from "next/image";
import React, { useRef, useState } from "react";

const ImageUpload = ({ index = 0, requiredInput, source }) => {
    const imgInputRef = useRef();
    const [imageFile, setImageFile] = useState(null);
    const [uploadedFileKey, setUploadedFileKey] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const handleOnChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file) {
            // Check if the selected file type is allowed
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                alert("Please select a valid image file (PNG, JPG, JPEG).");
                e.target.value = null; // Clear the file input
                return;
            }

            // Read the file and display preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
        setIsImageUploaded(false);
    };

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append("file", imageFile);
        try {
            setIsImageUploading(true);
            const { success, fileKey } = await uploadFile(formData);
            setIsImageUploading(false);
            if (success) {
                setIsImageUploaded(true);
                setUploadedFileKey(fileKey);
            } else {
                setIsImageUploading(false);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setIsImageUploading(false);
        }
    };

    return (
        <div>
            <label htmlFor="image">Upload Image (312px x 312px)*</label>

            <input
                type="text"
                name={`image${index + 1}`}
                value={uploadedFileKey || ""}
                hidden
            />
            <input
                ref={imgInputRef}
                type="file"
                id="image"
                accept=".png, .jpg, .jpeg"
                onChange={handleOnChange}
                required={requiredInput ? true : false}
                multiple={false}
            />

            <button
                type="button"
                className={styles.uploadBtn}
                disabled={imageFile === null}
                onClick={handleImageUpload}
            >
                {isImageUploading
                    ? "uploading..."
                    : isImageUploaded
                    ? "uploaded!"
                    : "Upload Image"}
            </button>

            <div className={styles.imgContainer}>
                {source && (
                    <div>
                        <p>Current Image</p>
                        <Image
                            src={source}
                            width={312}
                            height={312}
                            alt="Image Preview"
                            style={{
                                maxWidth: "312px",
                                marginBottom: "30px",
                                height: "312px",
                                width: "auto",
                                opacity: imagePreview ? "0.4" : "1",
                            }}
                        />
                    </div>
                )}
                {imagePreview && (
                    <div>
                        <div className={styles.flex}>
                            <p>New Image</p>
                            <button
                                disabled={isImageUploaded}
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    imgInputRef.current.value = "";
                                }}
                            >
                                undo
                            </button>
                        </div>
                        <Image
                            src={imagePreview || ""}
                            width={312}
                            height={312}
                            alt="Image Preview"
                            style={{
                                maxWidth: "312px",
                                marginBottom: "30px",
                                height: "312px",
                                width: "auto",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
