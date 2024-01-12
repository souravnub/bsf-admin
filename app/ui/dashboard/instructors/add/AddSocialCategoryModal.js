"use client";

import React, { useRef, useState } from "react";
import styles from "@/app/ui/dashboard/reply-modal/replyModal.module.css";
import { addSocialCategory } from "@/app/lib/actions";

const AddSocialCategoryModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [msg, setMsg] = useState(null);

    const inputRef = useRef();

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleAddCategory = async () => {
        const res = await addSocialCategory(inputRef.current.value);
        if (res && res.success) {
            setMsg(res.msg);
        }
        setTimeout(() => {
            closeModal();
            setMsg(null);
        }, 1500);
    };

    return (
        <>
            <button
                type="button"
                className={`${styles.button} ${styles.view}`}
                onClick={openModal}
            >
                Add new
            </button>
            {isOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className="close" onClick={closeModal}>
                            <p>&times;</p>
                        </span>
                        <p className={styles.quote}>
                            Add a new social category
                        </p>

                        <div>
                            <label htmlFor="newCategory">New category: </label>
                            <input
                                ref={inputRef}
                                style={{ width: "100%", height: "auto" }}
                                name="newCategory"
                                id="newCategory"
                                className={styles.textarea}
                            ></input>

                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className={styles.sendBtn}
                            >
                                Add
                            </button>
                            <p className={styles.message}>{msg && msg}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddSocialCategoryModal;
