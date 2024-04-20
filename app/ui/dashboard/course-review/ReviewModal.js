"use client";

import { useState } from "react";
import styles from "@/app/ui/dashboard/email-modal/emailModal.module.css";
import ReviewModalBody from "./ReviewModalBody";

const ReviewModal = ({ buttonTxt, ...reviewProps }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button className={`${styles.button}`} onClick={openModal}>
                {buttonTxt}
            </button>
            {isOpen && (
                <ReviewModalBody closeModal={closeModal} {...reviewProps} />
            )}
        </>
    );
};

export default ReviewModal;
