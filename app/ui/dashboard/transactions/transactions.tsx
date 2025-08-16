import styles from "./transactions.module.css";

const Transactions = async ({
    transactions,
}: {
    transactions: {
        customer: string;
        course: string;
        date: string;
        amountPaid: number;
    }[];
}) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>3 Latest Transactions</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Course</td>
                        <td>transaction Date</td>
                        <td>Amount</td>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, idx) => {
                        const { customer, course, date, amountPaid } =
                            transaction;

                        return (
                            <tr key={idx}>
                                <td>
                                    <div className={styles.user}>
                                        {customer}
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={`${styles.status} ${styles.pending}`}
                                    >
                                        {course}
                                    </span>
                                </td>
                                <td>{date}</td>
                                <td>${amountPaid}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
