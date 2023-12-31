import styles from "@/app/ui/dashboard/customers/customers.module.css";
import messageStyles from "@/app/ui/dashboard/messages/message.module.css";
import { fetchMessages } from "@/app/lib/data";
import { RxDotFilled } from "react-icons/rx";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Sort from "@/app/ui/dashboard/sort/sort";
import ReplyModal from "@/app/ui/dashboard/reply-modal/replyModal";

import { deleteMessage } from "@/app/lib/actions";

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
                        replied,
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
                                    <form action={deleteMessage}>
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
                                            message={message}
                                            firstName={firstName}
                                            lastName={lastName}
                                            email={email}
                                            id={JSON.stringify(_id)}
                                        />
                                    )}
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
