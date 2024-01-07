"use client";
import React from "react";
import { useFormStatus } from "react-dom";

const Button = ({ children, disabledContent }) => {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending}>
            {pending ? disabledContent : children}
        </button>
    );
};

export default Button;
