import React from "react";
import styles from "@/app/ui/dashboard/customers/customers.module.css";
import messageStyles from "@/app/ui/dashboard/messages/message.module.css";
import { RxDotFilled } from "react-icons/rx";
import ReplyModal from "@/app/ui/dashboard/reply-modal/replyModal";
import { sendReplyToHiringReq } from "@/app/lib/actions";
import { fetchHiringRequests } from "@/app/lib/data";

const HireAlumniPage = async () => {
    const hiringRequests = await fetchHiringRequests();
    return (
        <>
            <div className={`${styles.container} ${messageStyles.flex}`}>
                {hiringRequests.map(
                    ({
                        _id,
                        name,
                        email,
                        roleRequired,
                        createdAt,
                        experience,
                        jobDesc,
                        replied,
                        reply,
                    }) => {
                        return (
                            <div key={String(_id)}>
                                <div className={messageStyles.messageContainer}>
                                    <div
                                        className={
                                            messageStyles.contentContainer
                                        }
                                    >
                                        <div>
                                            <span
                                                className={messageStyles.name}
                                            >
                                                {name}
                                            </span>
                                            <RxDotFilled />
                                            <ul>
                                                <li
                                                    className={
                                                        messageStyles.category
                                                    }
                                                >
                                                    <span>
                                                        Role: {roleRequired}
                                                    </span>
                                                </li>
                                                <li
                                                    className={
                                                        messageStyles.category
                                                    }
                                                >
                                                    <span>
                                                        Experience: {experience}{" "}
                                                        {experience === 1
                                                            ? "year"
                                                            : "years"}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <span> {email}</span>
                                        <p>
                                            {replied && <span>Message: </span>}
                                            {jobDesc}
                                        </p>
                                        {replied && (
                                            <p>
                                                <span>Reply: </span>
                                                {reply}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className={
                                            messageStyles.dateTimeContainer
                                        }
                                    >
                                        <span>{createdAt}</span>
                                    </div>
                                </div>
                                <div
                                    className={`${messageStyles.container} ${messageStyles.btnContainer}`}
                                >
                                    <form>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={JSON.stringify(_id)}
                                        />
                                        <button
                                            className={`${styles.button} ${styles.delete}`}
                                        >
                                            Delete
                                        </button>
                                    </form>
                                    {replied === true ? (
                                        <p
                                            className={`${styles.button} ${styles.replied}`}
                                        >
                                            Replied
                                        </p>
                                    ) : (
                                        <ReplyModal
                                            formValues={{
                                                id: JSON.stringify(_id),
                                                jobDesc,
                                                name,
                                                email,
                                                roleRequired,
                                            }}
                                            replyingTo={jobDesc}
                                            action={sendReplyToHiringReq}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </>
    );
};

export default HireAlumniPage;
