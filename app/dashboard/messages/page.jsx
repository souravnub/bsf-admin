import React from "react";
import styles from "@/app/ui/dashboard/customers/customers.module.css";
import messageStyles from "@/app/ui/dashboard/messages/message.module.css";
import { fetchMessages } from "@/app/lib/data";
import { RxDotFilled } from "react-icons/rx";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Sort from "@/app/ui/dashboard/sort/sort";

const Messages = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const sortBy = searchParams?.sort || "newest_first";

    const { count, messages } = await fetchMessages(q, page, sortBy);
    return (
        <>
            <div className={`${styles.container} ${messageStyles.flex}`}>
                <div className={styles.top}>
                    <Search placeholder={"Search for a name..."} />
                    <Sort options={["Newest first", "Replied to", "Oldest"]} />
                </div>
                {messages.map(
                    ({
                        _id,
                        firstName,
                        lastName,
                        email,
                        interestCategories,
                        message,
                        createdAt,
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
                                                {firstName + " " + lastName}
                                            </span>
                                            <RxDotFilled />
                                            <ul>
                                                {interestCategories?.map(
                                                    (category) => (
                                                        <li
                                                            key={category}
                                                            className={
                                                                messageStyles.category
                                                            }
                                                        >
                                                            <span>
                                                                {category}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <span> {email}</span>
                                        <p>{message}</p>
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
                                            value={_id}
                                        />
                                        <button
                                            className={`${styles.button} ${styles.delete}`}
                                        >
                                            Delete
                                        </button>
                                    </form>

                                    <form>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={_id}
                                        />
                                        <input
                                            type="hidden"
                                            name="email"
                                            value={email}
                                        />
                                        <button
                                            className={`${styles.button} ${styles.view}`}
                                        >
                                            Reply
                                        </button>
                                    </form>
                                </div>
                            </div>
                        );
                    }
                )}
                <Pagination count={count} />
            </div>
        </>
    );
};

export default Messages;
