"use client";

import styles from "./imageUpload.module.css";
import Image from "next/image";
import React, { useState } from "react";

const ImageUpload = ({ url, requiredInput, index, source }) => {
    const [imagePreview, setImagePreview] = useState(source || null);
    const [imageFile, setImageFile] = useState("");
    const [message, setMessage] = useState("Waiting...");

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

            // Check if the user has selected multiple files
            if (e.target.files.length > 1) {
                alert("Please upload only one image.");
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
    };

    const handleOnSubmit = async () => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "my-uploads");
        formData.append("public_id", imageFile.name);

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dmssr3ii7/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMessage("Uploaded successfully!");
                console.log("Image uploaded successfully:", data);
            } else {
                console.error("Image upload failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div>
            <label htmlFor='image'>Upload Image (312px x 312px)*</label>

            <input
                type='file'
                name={index > 0 ? `image${index}` : "image"}
                id='image'
                accept='.png, .jpg, .jpeg'
                onChange={handleOnChange}
                required={requiredInput ? true : false}
            />
            <div className={styles.uploadBtn} onClick={handleOnSubmit}>
                <p>Upload Image</p>
            </div>

            {imagePreview && (
                <div>
                    <p>{source ? "Current Image" : `Preview ${message}`}</p>
                    <Image
                        src={imagePreview}
                        width={312}
                        height={312}
                        alt='Image Preview'
                        style={{
                            maxWidth: "312px",
                            marginBottom: "30px",
                            height: "312px",
                            width: "auto",
                        }}
                    />
                </div>
            )}

            {url && (
                <div>
                    <p>Current image</p>
                    <Image
                        src={url}
                        width={312}
                        height={312}
                        alt='Image Preview'
                        style={{
                            maxWidth: "312px",
                            marginBottom: "30px",
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
