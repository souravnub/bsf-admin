import Link from "next/link";
import styles from "@/app/ui/dashboard/courses/courses.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { fetchAdmins } from "@/app/lib/data";
import { deleteAdmin } from "@/app/lib/actions";

/*

    TODO-

    ✅ Being able to add a new category on selecting "Create new category"
    ✅ Upload images element
    ✅ Fix courses add function and courses category population
    ✅ Make new courses through the form
    ✅ Remove unnecessary stuff from the ui.
    ✅ Delete a course
    ✅ Edit & view course details
    ✅ Display total users, total courses and total revenue on the dashboard home page
    -> View customers
    -> Send email to all customers at once
    -> Send email to all customers of a particular course all at once.
    -> Display the graph based on the revenue and time
*/

const AdminsPage = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const { count, admins } = await fetchAdmins(q, page);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder='Search' />
                <Link href='/dashboard/courses/add'>
                    <button className={styles.addButton}>Add New</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Username</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin._id}>
                            <td>{admin.username}</td>
                            <td>
                                <div className={styles.buttons}>
                                    <Link
                                        href={`/dashboard/admins/${admin._id}`}
                                    >
                                        <button
                                            className={`${styles.button} ${styles.view}`}
                                        >
                                            View
                                        </button>
                                    </Link>
                                    <form action={deleteAdmin}>
                                        <input
                                            type='hidden'
                                            name='id'
                                            value={admin._id}
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

export default AdminsPage;
