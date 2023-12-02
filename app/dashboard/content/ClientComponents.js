"use client";
import { addUrlToGallery } from "@/app/lib/actions";
import React, { useEffect, useState, useTransition } from "react";
import { TiDelete } from "react-icons/ti";

export const AddUrlForm = ({ _id }) => {
    const [pending, startTransition] = useTransition(false);
    const [value, setValue] = useState("");
    useEffect(() => {
        setValue("");
    }, [pending]);
    return (
        <form
            action={() => {
                startTransition(async () => {
                    await addUrlToGallery.bind(null, _id, value)();
                });
            }}>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <button disabled={pending}>add</button>
        </form>
    );
};

export const DeleteButton = ({ onClick }) => {
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
            <TiDelete />
        </button>
    );
};
