"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import styles from "./replyModal.module.css";
import { sendReply } from "@/app/lib/actions";

const ReplyModal = ({ message, firstName, lastName, email, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useFormState(sendReply, undefined);

    const objectId = JSON.parse(id);

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
                            <p>{message}</p>
                        </div>

                        <form action={formAction} className={styles.form}>
                            <input
                                type="hidden"
                                name="firstName"
                                defaultValue={firstName}
                            />
                            <input
                                type="hidden"
                                name="lastName"
                                defaultValue={lastName}
                            />
                            <input
                                type="hidden"
                                name="email"
                                defaultValue={email}
                            />
                            <input
                                type="hidden"
                                name="message"
                                defaultValue={message}
                            />
                            <input
                                type="hidden"
                                name="id"
                                defaultValue={objectId}
                            />
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
