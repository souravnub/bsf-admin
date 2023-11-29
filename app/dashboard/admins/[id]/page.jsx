import { updateCourse } from "@/app/lib/actions";
import { fetchAdmin } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";

const SingleAdminPage = async ({ params }) => {
    const { id } = params;
    const admin = await fetchAdmin(id);
    // TODO: Do the feature for changing password.
    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={updateCourse} className={styles.form}>
                    <div className={styles.infoContainer}>
                        Showing information for username- {admin.username}
                    </div>
                    <input
                        type='hidden'
                        name='id'
                        defaultValue={String(admin._id)}
                    />
                    <label>Username</label>
                    <input
                        type='text'
                        name='username'
                        defaultValue={admin.username}
                    />
                    <label>Password</label>
                    <input
                        type='text'
                        name='password'
                        defaultValue={admin.password}
                    />
                    <button>Update</button>
                </form>
            </div>
        </div>
    );
};

export default SingleAdminPage;
