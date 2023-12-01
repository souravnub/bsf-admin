import styles from "./transactions.module.css";
import { getLatestTransactions } from "@/app/lib/data";

const Transactions = async () => {
    const transactions = await getLatestTransactions();
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Latest Transactions</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Course</td>
                        <td>Date</td>
                        <td>Amount</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className={styles.user}>John Doe</div>
                        </td>
                        <td>
                            <span
                                className={`${styles.status} ${styles.pending}`}
                            >
                                Pending
                            </span>
                        </td>
                        <td>14.02.2024</td>
                        <td>$3.200</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
