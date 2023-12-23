import ResetPasswordForm from "@/app/ui/login/ResetPassword/ResetPasswordForm";
import styles from "@/app/ui/login/ResetPassword/resetPassword.module.css";

const ResetPassword = () => {
    return (
        <div className={styles.container}>
            <ResetPasswordForm />
        </div>
    );
};

export default ResetPassword;
