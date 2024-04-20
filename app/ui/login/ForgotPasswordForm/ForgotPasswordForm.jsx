"use client";

import { useFormState } from "react-dom";
import styles from "./ForgotPasswordForm.module.css";
import { sendLink } from "@/app/lib/actions";

const ForgotPasswordForm = () => {
    const [sendLinkFormState, sendLinkFormAction] = useFormState(
        sendLink,
        undefined
    );

    return (
        <>
            <div className={styles.forgotPasswordContainer}>
                <h1>Forgot password?</h1>
                <p>No worries! Let&apos;s help you reset your password.</p>
                <form
                    action={sendLinkFormAction}
                    className={styles.sendCodeForm}
                >
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" />
                    </div>

                    <div className={styles.sendCodeBtnContainer}>
                        <button>Send Code</button>
                        <p className={styles.formMessage}>
                            {sendLinkFormState && sendLinkFormState}
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ForgotPasswordForm;
