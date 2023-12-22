"use client";

import { authenticate } from "@/app/lib/actions";
import styles from "./loginForm.module.css";
import { useFormState } from "react-dom";
import Link from "next/link";

const LoginForm = () => {
    const [state, formAction] = useFormState(authenticate, undefined);

    return (
        <form action={formAction} className={styles.form}>
            <h1>Login</h1>
            <input type="text" placeholder="Username" name="username" />
            <input type="password" placeholder="Password" name="password" />
            <button>Login</button>
            <Link href="/verify" className={styles.forgot}>
                Forgot Password?
            </Link>
            {state && state}
        </form>
    );
};

export default LoginForm;
