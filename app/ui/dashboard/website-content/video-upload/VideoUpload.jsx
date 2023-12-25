"use client";

import styles from "./videoUpload.module.css";
import React, { useState } from "react";

const VideoUpload = ({ url, requiredInput, index, source }) => {
    const [videoPreview, setVideoPreview] = useState(source || null);
    const [videoFile, setVideoFile] = useState("");
    const [message, setMessage] = useState("Waiting...");

    const handleOnChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file) {
            // Check if the selected file type is allowed
            const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
            if (!allowedTypes.includes(file.type)) {
                alert("Please select a valid video file (MP4, WebM, OGG).");
                e.target.value = null; // Clear the file input
                return;
            }

            // Check if the user has selected multiple files
            if (e.target.files.length > 1) {
                alert("Please upload only one video.");
                e.target.value = null; // Clear the file input
                return;
            }

            // Read the file and display preview
            const reader = new FileReader();
            reader.onload = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            setVideoFile(file);
        }
    };

    const handleOnSubmit = async () => {
        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("upload_preset", "my-uploads");
        formData.append("public_id", videoFile.name);

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dmssr3ii7/video/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMessage("Uploaded successfully!");
            } else {
                console.error("Video upload failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div style={{ marginTop: "1.5rem" }}>
            <label htmlFor="video">Upload Video*</label>

            <input
                type="file"
                name={`video${index}`}
                id="video"
                accept=".mp4, .webm, .ogg"
                onChange={handleOnChange}
                required={requiredInput ? true : false}
            />
            <div className={styles.uploadBtn} onClick={handleOnSubmit}>
                <p>Upload Video</p>
            </div>

            {videoPreview && (
                <div>
                    <p>{source ? "Current Video" : `Preview ${message}`}</p>
                    <video
                        controls
                        width={312}
                        height={312}
                        style={{
                            maxWidth: "312px",
                            marginBottom: "30px",
                        }}
                    >
                        <source src={videoPreview} type={videoFile.type} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            {url && (
                <div>
                    <p>Current video</p>
                    <video
                        controls
                        width={312}
                        height={312}
                        style={{
                            maxWidth: "312px",
                            marginBottom: "30px",
                        }}
                    >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
