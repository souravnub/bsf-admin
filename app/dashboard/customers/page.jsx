import { fetchCustomers } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/customers/customers.module.css";
import Link from "next/link";
import EmailModal from "@/app/ui/dashboard/email-modal/EmailModal";

const Customers = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const { count, customers } = await fetchCustomers(q, page);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search for a customer..." />
                <div className={styles.emailBtnContainer}>
                    <EmailModal
                        title={"Send Email to All Customers"}
                        purpose={"all"}
                    />
                    <EmailModal
                        title={"Send Email to Course Enrollees"}
                        purpose={"selected"}
                    />
                </div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer._id}>
                            <td>
                                <div className={styles.customer}>
                                    {customer.name}
                                </div>
                            </td>
                            <td>{customer.email}</td>
                            <td>
                                <div className={styles.buttons}>
                                    <Link
                                        href={`/dashboard/customers/${customer._id}`}
                                    >
                                        <button
                                            className={`${styles.button} ${styles.view}`}
                                        >
                                            View
                                        </button>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination count={count} />
        </div>
    );
};

export default Customers;
