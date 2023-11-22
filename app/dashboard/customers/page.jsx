import { deleteUser } from "@/app/lib/actions";
import { fetchCustomers, fetchAdmins } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/customers/customers.module.css";
import Image from "next/image";
import Link from "next/link";

const customersPage = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const { count, customers } = await fetchCustomers(q, page);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder='Search for a customer...' />
                <Link href='/dashboard/customers/add'>
                    <button className={styles.addButton}>Add New</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Created At</td>
                        <td>Role</td>
                        <td>Status</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>
                                <div className={styles.customer}>
                                    <Image
                                        src={customer.img || "/noavatar.png"}
                                        alt=''
                                        width={40}
                                        height={40}
                                        className={styles.userImage}
                                    />
                                    {customer.username}
                                </div>
                            </td>
                            <td>{customer.email}</td>
                            <td>
                                {customer.createdAt?.toString().slice(4, 16)}
                            </td>
                            <td>{customer.isAdmin ? "Admin" : "Client"}</td>
                            <td>{customer.isActive ? "active" : "passive"}</td>
                            <td>
                                <div className={styles.buttons}>
                                    <Link
                                        href={`/dashboard/customers/${user.id}`}
                                    >
                                        <button
                                            className={`${styles.button} ${styles.view}`}
                                        >
                                            View
                                        </button>
                                    </Link>
                                    <form action={deleteUser}>
                                        <input
                                            type='hidden'
                                            name='id'
                                            value={customer.id}
                                        />
                                        <button
                                            className={`${styles.button} ${styles.delete}`}
                                        >
                                            Delete
                                        </button>
                                    </form>
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

export default customersPage;
