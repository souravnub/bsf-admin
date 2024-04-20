"use client";

import { useState } from "react";
import { authenticate } from "@/app/lib/actions";
import styles from "./loginForm.module.css";
import { useFormState } from "react-dom";
import Link from "next/link";
import { MdRemoveRedEye } from "react-icons/md";
import { IoEyeOffSharp } from "react-icons/io5";

const LoginForm = () => {
    const [state, formAction] = useFormState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form action={formAction} className={styles.form}>
            <h1>Login</h1>
            <input type="text" placeholder="Username" name="username" />
            <div className={styles.passwordInput}>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                />
                <div className={styles.showBtn}>
                    {showPassword ? (
                        <IoEyeOffSharp
                            className={`${styles.passwordIcon} ${styles.eyeIcon}`}
                            onClick={togglePasswordVisibility}
                        />
                    ) : (
                        <MdRemoveRedEye
                            className={`${styles.passwordIcon} ${styles.eyeIcon}`}
                            onClick={togglePasswordVisibility}
                        />
                    )}
                </div>
            </div>
            <button>Login</button>
            <Link href="/forgot-password" className={styles.forgot}>
                Forgot Password?
            </Link>
            {state && state}
        </form>
    );
};

export default LoginForm;
