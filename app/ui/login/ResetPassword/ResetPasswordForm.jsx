"use client";

import { useFormState } from "react-dom";
import styles from "./resetPassword.module.css";
import { resetPassword } from "@/app/lib/actions";

import { useSearchParams, useParams } from "next/navigation";

const ResetPasswordForm = () => {
    const [state, formAction] = useFormState(resetPassword, undefined);

    const searchParams = useSearchParams();
    const params = useParams();

    const signature = searchParams.get("signature");

    return (
        <>
            <div className={styles.forgotPasswordContainer}>
                <h1>Reset Password </h1>
                <form action={formAction} className={styles.sendCodeForm}>
                    <input type="hidden" name="email" value={params.email} />
                    <input type="hidden" name="signature" value={signature} />
                    <div>
                        <label htmlFor="pwd1">Enter new password</label>
                        <input type="password" name="password" id="pwd1" />
                    </div>

                    <div>
                        <label htmlFor="pwd">Re-enter</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="pwd"
                        />
                    </div>

                    <div className={styles.sendCodeBtnContainer}>
                        <button>Reset</button>
                        <p className={styles.formMessage}>{state && state}</p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ResetPasswordForm;
