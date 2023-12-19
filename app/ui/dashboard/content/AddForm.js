"use client";
import React, { useEffect, useState, useTransition } from "react";

export const AddForm = ({
    allUrls,
    extraProps = {},
    action,
    inputPlaceholder = "",
    inputLabel = "",
    inputId,
    ...props
}) => {
    const [pending, startTransition] = useTransition(false);
    const [value, setValue] = useState("");
    useEffect(() => {
        setValue("");
    }, [pending]);
    return (
        <form
            {...props}
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
            <label htmlFor={inputId}>{inputLabel}</label>
            <input
                id={inputId}
                placeholder={inputPlaceholder}
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button disabled={pending}>add</button>
        </form>
    );
};
