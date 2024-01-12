"use client";

import React, { useRef, useState } from "react";
import styles from "@/app/ui/dashboard/reply-modal/replyModal.module.css";
import { addSocialCategory } from "@/app/lib/actions";

const AddSocialCategoryModal = ({ setNewCategory, setIsOpen }) => {
    const [msg, setMsg] = useState(null);

    const inputRef = useRef();

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleAddCategory = async () => {
        const res = await addSocialCategory(inputRef.current.value);
        if (res && res.success) {
            setMsg(res.msg);
            setNewCategory(inputRef.current.value);
        }
        setTimeout(() => {
            closeModal();
            setMsg(null);
        }, 1500);
    };

    return (
        <>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <span className="close" onClick={closeModal}>
                        <p>&times;</p>
                    </span>
                    <p className={styles.quote}>Add a new social category</p>

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
        </>
    );
};

export default AddSocialCategoryModal;
