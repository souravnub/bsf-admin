import { updateAdmin } from "@/app/lib/actions";
import { fetchAdmin } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";
import Link from "next/link";

const SingleAdminPage = async ({ params }) => {
    const { id } = params;
    const admin = await fetchAdmin(id);

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={updateAdmin} className={styles.form}>
                    <input
                        type="hidden"
                        name="id"
                        defaultValue={String(admin._id)}
                    />
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        defaultValue={admin.username}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        value={admin.email}
                        id="email"
                        name="email"
                        readOnly
                    />
                    <Link
                        href="/dashboard/admins/changePassword"
                        className={styles.forgot}
                    >
                        Change Password
                    </Link>

                    <button className={styles.actionButton}>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleAdminPage;
