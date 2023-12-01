import { sendVerificationCode } from "@/app/lib/actions";
import styles from "@/app/ui/dashboard/courses/singleCourse/singleCourse.module.css";

const SingleAdminPage = async () => {
    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form action={sendVerificationCode} className={styles.form}>
                    <div className={styles.infoContainer}>
                        Please enter the verification code sent to your email.
                    </div>
                    <input type='hidden' name='id' />
                    <label>Type in here</label>
                    <input type='text' name='verification-code' />
                    <button>Verify</button>
                </form>
            </div>
        </div>
    );
};

export default SingleAdminPage;
