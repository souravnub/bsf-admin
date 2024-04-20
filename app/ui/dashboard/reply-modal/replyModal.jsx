"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import styles from "./replyModal.module.css";

const ReplyModal = ({ formValues, action, replyingTo }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [state, formAction] = useFormState(action, undefined);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                className={`${styles.button} ${styles.view}`}
                onClick={openModal}
            >
                Reply
            </button>
            {isOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className="close" onClick={closeModal}>
                            <p>&times;</p>
                        </span>
                        <div className={styles.quote}>
                            <h2>Replying to:</h2>
                            <p>{replyingTo}</p>
                        </div>

                        <form action={formAction} className={styles.form}>
                            {Object.keys(formValues).map((key) => {
                                return (
                                    <input
                                        key={key}
                                        type="hidden"
                                        name={key}
                                        defaultValue={formValues[key]}
                                    />
                                );
                            })}
                            <label htmlFor="reply">Your message here</label>
                            <textarea
                                name="reply"
                                id="reply"
                                cols="30"
                                rows="10"
                                className={styles.textarea}
                                placeholder="Start typing..."
                            ></textarea>

                            <button className={styles.sendBtn}>Send</button>
                        </form>
                        <p className={styles.message}>{state && state}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReplyModal;
