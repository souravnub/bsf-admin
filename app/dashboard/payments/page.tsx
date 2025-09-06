import { fetchPayments } from "@/app/lib/data";
import { convertToDollars } from "@/app/lib/utils";
import styles from "@/app/ui/dashboard/courses/courses.module.css";
import Link from "next/link";

const PaymentsPage = async () => {
    const payments = await fetchPayments();

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>customer</td>
                        <td>course</td>
                        <td>amount paid</td>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => {
                        const { _id, courseId, customerId, amountPaidCents } =
                            payment;
                        return (
                            <tr key={String(_id)}>
                                <td>
                                    <Link
                                        className="underline! text-blue-400!"
                                        href={`/dashboard/customers/${customerId._id.toString()}`}
                                    >
                                        {customerId.name}
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        className="underline! text-blue-400!"
                                        href={`/dashboard/courses/${courseId._id.toString()}`}
                                    >
                                        {courseId.name}
                                    </Link>
                                </td>
                                <td>${convertToDollars(amountPaidCents)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsPage;
