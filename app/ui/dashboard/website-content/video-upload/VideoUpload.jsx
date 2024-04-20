"use client";

import { uploadFile } from "@/app/lib/actions";
import styles from "./videoUpload.module.css";
import imgUploadStyles from "@/app/ui/dashboard/courses/addCourseForm/imageUpload/imageUpload.module.css";
import React, { useRef, useState } from "react";

const VideoUpload = ({ requiredInput, index = 0, source }) => {
    const vidInputRef = useRef();
    const [videoFile, setVideoFile] = useState(null);
    const [uploadedFileKey, setUploadedFileKey] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);

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

            // Read the file and display preview
            const reader = new FileReader();
            reader.onload = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setVideoFile(file);
        }
        setIsVideoUploaded(false);
    };

    const handleVideoUpload = async () => {
        const formData = new FormData();
        formData.append("file", videoFile);
        try {
            setIsVideoUploading(true);
            const { success, fileKey } = await uploadFile(formData);
            setIsVideoUploading(false);
            if (success) {
                setIsVideoUploaded(true);
                setUploadedFileKey(fileKey);
            } else {
                setIsVideoUploading(false);
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            setIsVideoUploading(false);
        }
    };

    return (
        <div style={{ marginTop: "1.5rem" }}>
            <label htmlFor="video">Upload Video*</label>

            <input
                type="text"
                name={`video${index + 1}`}
                value={uploadedFileKey || ""}
                hidden
            />

            <input
                ref={vidInputRef}
                type="file"
                id="video"
                accept=".mp4, .webm, .ogg"
                multiple={false}
                onChange={handleOnChange}
                required={requiredInput ? true : false}
            />
            <button
                type="button"
                className={styles.uploadBtn}
                disabled={videoFile === null}
                onClick={handleVideoUpload}
            >
                {isVideoUploading
                    ? "uploading..."
                    : isVideoUploaded
                    ? "uploaded!"
                    : "Upload Video"}
            </button>

            <div className={imgUploadStyles.imgContainer}>
                {source && (
                    <div>
                        <p>Current Video</p>
                        <video
                            controls
                            width={312}
                            height={312}
                            style={{
                                maxWidth: "312px",
                                marginBlock: "30px",
                                height: "fit-content",
                                width: "auto",
                                opacity: videoPreview ? "0.4" : "1",
                            }}
                        >
                            <source src={source} />
                        </video>
                    </div>
                )}
                {videoPreview && (
                    <div>
                        <div className={imgUploadStyles.flex}>
                            <p>New Video</p>
                            <button
                                disabled={isVideoUploaded}
                                type="button"
                                onClick={() => {
                                    setVideoPreview(null);
                                    setVideoFile(null);
                                    vidInputRef.current.value = "";
                                }}
                            >
                                undo
                            </button>
                        </div>
                        <video
                            controls
                            width={312}
                            height={312}
                            style={{
                                maxWidth: "312px",
                                marginBlock: "30px",
                                height: "fit-content",
                                width: "auto",
                            }}
                        >
                            <source src={videoPreview} />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUpload;
