"use client";
import React, { useEffect, useState, useTransition } from "react";

export const Button = ({ onClick, children, ...props }) => {
    const [pending, startTransition] = useTransition(false);

    return (
        <button
            {...props}
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
