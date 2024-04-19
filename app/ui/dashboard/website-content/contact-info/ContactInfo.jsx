"use client";
import React from "react";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import FormButton from "../FormButton";
import { updateContactInfo } from "@/app/lib/actions";
import { useFormState } from "react-dom";

const ContactInfo = ({ data }) => {
    const [actionData, updateContactInfoAction] = useFormState(
        updateContactInfo,
        {
            success: null,
        }
    );

    return (
        <div className={styles.container}>
            <h3>Contact Information</h3>

            <form
                className={`${styles.form}`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                }}
                action={updateContactInfoAction}
            >
                <div>
                    <label htmlFor="msgEmail">Email for messages</label>
                    <input
                        name="msgEmail"
                        type="email"
                        defaultValue={data.msgEmail}
                        id="msgEmail"
                    />
                </div>

                <div>
                    <label htmlFor="supportEmail">Email for support</label>
                    <input
                        name="supportEmail"
                        type="email"
                        id="supportEmail"
                        defaultValue={data.supportEmail}
                    />
                </div>

                <div>
                    <label htmlFor="phone">Phone</label>
                    <input
                        name="phone"
                        type="text"
                        id="phone"
                        defaultValue={data.phone}
                    />
                </div>

                <FormButton
                    style={{ maxWidth: "fit-content" }}
                    disabledContent={"Updating info..."}
                >
                    {actionData.success === true || actionData.success === null
                        ? "Update Info"
                        : "Failed to Update!"}
                </FormButton>

                <p
                    style={{
                        fontSize: ".8rem",
                        marginTop: "1rem",
                        color: actionData.success ? "green" : "red",
                    }}
                >
                    {actionData.success === false &&
                        "Something went wrong while updating info!"}
                    {actionData.success === true &&
                        "Content updated successfully"}
                </p>
            </form>
        </div>
    );
};

export default ContactInfo;
