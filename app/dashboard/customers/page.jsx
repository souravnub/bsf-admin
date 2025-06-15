import { fetchCategories, fetchCustomers } from "@/app/lib/data";

import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/customers/customers.module.css";
import Link from "next/link";
import EmailModal from "@/app/ui/dashboard/email-modal/EmailModal";

const Customers = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const { customers } = await fetchCustomers(q);
    const categories = await fetchCategories();

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
                        categories={JSON.stringify(categories)}
                    />
                </div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>No. of courses enrolled</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={JSON.stringify(customer._id)}>
                            <td>
                                <div className={styles.customer}>
                                    {customer.name}
                                </div>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.courses.length}</td>
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
        </div>
    );
};

export default Customers;
