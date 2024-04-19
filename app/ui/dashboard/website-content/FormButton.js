"use client";
import React from "react";
import { useFormStatus } from "react-dom";

const FormButton = ({ children, disabledContent, ...props }) => {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} {...props}>
            {pending ? disabledContent : children}
        </button>
    );
};

export default FormButton;
