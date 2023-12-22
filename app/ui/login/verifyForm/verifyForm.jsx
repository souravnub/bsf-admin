"use client";

import { useFormState } from "react-dom";
import styles from "./verifyForm.module.css";
import { authenticate, sendCode } from "@/app/lib/actions";

const VerifyForm = () => {
    const [state, formAction] = useFormState(authenticate, undefined);
    const [sendCodeFormState, sendCodeFormAction] = useFormState(
        sendCode,
        undefined
    );

    return (
        <>
            <div className={styles.forgotPasswordContainer}>
                <h1>Forgot Password</h1>
                <form
                    action={sendCodeFormAction}
                    className={styles.sendCodeForm}
                >
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" />
                    </div>

                    <div className={styles.sendCodeBtnContainer}>
                        <button>Send Code</button>
                        <p className={styles.formMessage}>
                            {sendCodeFormState && sendCodeFormState}
                        </p>
                    </div>
                </form>

                <form action={formAction} className={styles.verifyCodeForm}>
                    <label htmlFor="code">Verification Code</label>
                    <input type="text" name="code" id="code" />
                    <button>Verify</button>
                    {state && state}
                </form>
            </div>
        </>
    );
};

export default VerifyForm;
