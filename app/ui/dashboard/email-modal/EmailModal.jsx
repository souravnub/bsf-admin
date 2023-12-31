"use client";

import { useState, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import styles from "./emailModal.module.css";
import { getCustomerCount, sendToAll, sendToSelected } from "@/app/lib/actions";

const EmailModal = ({ title, purpose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [state1, formAction1] = useFormState(sendToAll, undefined);
    const [state2, formAction2] = useFormState(sendToSelected, undefined);
    const totalCustomersRef = useRef(0);

    useEffect(() => {
        totalCustomersRef.current = getCustomerCount();
    }, []);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    if (purpose === "all") {
        return (
            <>
                <button className={`${styles.button}`} onClick={openModal}>
                    {title}
                </button>
                {isOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className="close" onClick={closeModal}>
                                <p>&times;</p>
                            </span>

                            <div className={styles.quote}>
                                <h2>Note:</h2>
                                <p>
                                    This email will be sent to all{" "}
                                    {totalCustomersRef.current} customers.
                                </p>
                            </div>

                            <form action={formAction1} className={styles.form}>
                                <label htmlFor="message">Email</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    className={styles.subject}
                                />
                                <textarea
                                    name="body"
                                    id="message"
                                    cols="30"
                                    rows="10"
                                    className={styles.textarea}
                                    placeholder="Body"
                                ></textarea>

                                <button className={styles.sendBtn}>Send</button>
                            </form>
                            <p className={styles.message}>{state1 && state1}</p>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <>
                <button className={`${styles.button}`} onClick={openModal}>
                    {title}
                </button>
                {isOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className="close" onClick={closeModal}>
                                <p>&times;</p>
                            </span>

                            <form action={formAction2} className={styles.form}>
                                <label htmlFor="message">
                                    Your message here for selected
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    cols="30"
                                    rows="10"
                                    className={styles.textarea}
                                    placeholder="Start typing..."
                                ></textarea>

                                <button className={styles.sendBtn}>Send</button>
                            </form>
                            <p className={styles.message}>{state2 && state2}</p>
                        </div>
                    </div>
                )}
            </>
        );
    }
};

export default EmailModal;
