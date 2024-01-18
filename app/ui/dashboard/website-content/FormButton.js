"use client";
import React from "react";
import { useFormStatus } from "react-dom";

const FormButton = ({ children, disabledContent }) => {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending}>
            {pending ? disabledContent : children}
        </button>
    );
};

export default FormButton;
