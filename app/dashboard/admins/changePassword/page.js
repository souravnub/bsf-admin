"use client";
import { checkAdminPassword, updateAdmin } from "@/app/lib/actions";
import React, { useRef, useState } from "react";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";

const ChangePassword = () => {
    const [isOldPassValid, setIsOldPasswordValid] = useState(null);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const usernameRef = useRef();
    const oldPassRef = useRef();
    const newPassRef = useRef();
    const confPassRef = useRef();

    const checkPassMatch = () => {
        if (newPassRef.current.value === confPassRef.current.value) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
        if (
            newPassRef.current.value.trim() === "" ||
            oldPassRef.current.value.trim() === ""
        ) {
            setPasswordsMatch(false);
        }
    };

    return (
        <>
            <form className={`${styles.form} ${styles.mt}`}>
                <label htmlFor='username'>User name</label>
                <input
                    ref={usernameRef}
                    type='text'
                    required
                    onChange={() => setIsOldPasswordValid(null)}
                    id='username'
                    disabled={isOldPassValid}
                />

                <label htmlFor='oldPass'>Old password</label>
                <input
                    ref={oldPassRef}
                    type='password'
                    id='oldPass'
                    required
                    onChange={() => setIsOldPasswordValid(null)}
                    disabled={isOldPassValid}
                />

                <button
                    className={styles.button}
                    type='button'
                    disabled={isOldPassValid}
                    onClick={async () => {
                        const isPassCorrect = await checkAdminPassword(
                            usernameRef.current.value,
                            oldPassRef.current.value
                        );
                        setIsOldPasswordValid(isPassCorrect);
                    }}
                >
                    check
                </button>

                {isOldPassValid === false && (
                    <span className={styles.warning}>
                        username or password not correct...
                    </span>
                )}
            </form>

            {isOldPassValid && (
                <form
                    className={`${styles.form} ${styles.mt}`}
                    action={updateAdmin}
                >
                    <label htmlFor='newPass'>new password</label>
                    <input
                        name='username'
                        type='text'
                        hidden
                        value={usernameRef.current.value}
                    />
                    <input
                        name='password'
                        ref={newPassRef}
                        type='password'
                        id='newPass'
                        required
                        onChange={checkPassMatch}
                    />

                    <label htmlFor='confPass'>confirm new password</label>
                    <input
                        ref={confPassRef}
                        type='password'
                        id='confPass'
                        required
                        onChange={checkPassMatch}
                    />

                    <button
                        className={styles.button}
                        disabled={!passwordsMatch}
                    >
                        change password
                    </button>
                    <span className={styles.warning}>
                        {!passwordsMatch && "Passwords donnot match"}
                    </span>
                </form>
            )}
        </>
    );
};
export default ChangePassword;
