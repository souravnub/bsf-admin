import {
    MdSupervisedUserCircle,
    MdAttachMoney,
    MdLibraryBooks,
} from "react-icons/md";
import styles from "./card.module.css";

const Card = ({ item }) => {
    return (
        <div className={styles.container}>
            {item.title === "Total Students" ? (
                <MdSupervisedUserCircle size={24} />
            ) : item.title === "Revenue" ? (
                <MdAttachMoney size={24} />
            ) : (
                <MdLibraryBooks size={24} />
            )}

            <div className={styles.texts}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.number}>{item.number}</span>
            </div>
        </div>
    );
};

export default Card;
