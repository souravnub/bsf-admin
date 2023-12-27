"use client";

import styles from "./replyModal.module.css";

const ReplyModal = ({ isOpen, closeModal }) => {
    return (
        <div className={styles.modal + ` ${isOpen ? "show" : ""}`}>
            <div className={styles.modalContent}>
                <span className="close" onClick={closeModal}>
                    &times;
                </span>
                <h2>Modal Title</h2>
                <p>Modal Content Goes Here</p>
            </div>
        </div>
    );
};

export default ReplyModal;
