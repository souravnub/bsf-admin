"use client";
import { fetchVideoGalleryTabs } from "@/app/lib/actions";
import React, { useEffect, useState, useTransition } from "react";

export const AddForm = ({
    extraProps = {},
    action,
    inputPlaceholder = "",
    inputLabel = "",
    inputId,
    ...props
}) => {
    const [pending, startTransition] = useTransition(false);
    const [value, setValue] = useState("");
    const [allUrls, setAllUrls] = useState([]);

    useEffect(() => {
        async function fetchUrls() {
            const tabs = await fetchVideoGalleryTabs();
            setAllUrls(tabs.map((tab) => tab.url).flat());
        }
        fetchUrls();
    }, []);

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
