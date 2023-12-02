"use client";
import React, { useEffect, useState, useTransition } from "react";

export const AddForm = ({ allUrls, extraProps = {}, action }) => {
    const [pending, startTransition] = useTransition(false);
    const [value, setValue] = useState("");
    useEffect(() => {
        setValue("");
    }, [pending]);
    return (
        <form
            action={() => {
                startTransition(async () => {
                    if (allUrls && allUrls.includes(value)) {
                        window.alert(
                            "url already exists in one of the categories. Please enter a unique one."
                        );
                        return;
                    }

                    await action.bind(null, { ...extraProps, value })();
                });
            }}>
            <input
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button disabled={pending}>add</button>
        </form>
    );
};

export const Button = ({ onClick, children }) => {
    const [pending, startTransition] = useTransition(false);

    return (
        <button
            aria-disabled={pending}
            disabled={pending}
            onClick={() => {
                startTransition(async () => {
                    await onClick();
                });
            }}>
            {children}
        </button>
    );
};
