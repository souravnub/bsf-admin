"use client";

import Image from "next/image";
import React, { useState } from "react";

const ImageUpload = () => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (e) => {
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
        }
    };

    return (
        <div>
            <label htmlFor='image'>Upload Image*</label>
            <input
                type='file'
                name='image'
                id='image'
                accept='.png, .jpg, .jpeg'
                required
                onChange={handleImageUpload}
            />
            {imagePreview && (
                <div>
                    <p>Preview:</p>
                    <Image
                        src={imagePreview}
                        width={200}
                        height={200}
                        alt='Image Preview'
                        style={{ maxWidth: "200px", marginBottom: "30px" }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
