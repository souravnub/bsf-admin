import {
    MdSupervisedUserCircle,
    MdAttachMoney,
    MdLibraryBooks,
} from "react-icons/md";
import styles from "./card.module.css";

interface CardProps {
    title: string;
    count: number;
}

const Card = ({ title, count }: CardProps) => {
    return (
        <div className={styles.container}>
            {title === "Total Students" ? (
                <MdSupervisedUserCircle size={24} />
            ) : title === "Revenue" ? (
                <MdAttachMoney size={24} />
            ) : (
                <MdLibraryBooks size={24} />
            )}

            <div className={styles.texts}>
                <span className={styles.title}>{title}</span>
                <span className={styles.number}>{count}</span>
            </div>
        </div>
    );
};

export default Card;
