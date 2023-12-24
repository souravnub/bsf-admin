import ForgotPasswordForm from "../ui/login/ForgotPasswordForm/ForgotPasswordForm";
import styles from "../ui/login/ForgotPasswordForm/ForgotPasswordForm.module.css";

const ForgotPassword = () => {
    return (
        <div className={styles.container}>
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPassword;
