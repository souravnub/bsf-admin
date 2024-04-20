import styles from "@/app/ui/dashboard/email-modal/emailModal.module.css";
import reviewModalStyles from "./review-modal.module.css";
import StarRatings from "react-star-ratings";
const ReviewModalBody = ({
    reviewId,
    customerEmail,
    courseName,
    message,
    closeModal,
    rating,
}) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button
                    type="button"
                    style={{ padding: ".1rem .3rem", fontSize: "1.4rem" }}
                    onClick={closeModal}
                >
                    &times;
                </button>

                <div className={reviewModalStyles.container}>
                    <h2>Review Id: {reviewId}</h2>
                    <p>{customerEmail}</p>
                    <p>{courseName}</p>
                    <div>
                        <StarRatings
                            rating={rating}
                            starRatedColor="yellow"
                            numberOfStars={5}
                            starDimension="1.4rem"
                            starSpacing="0"
                            name="rating"
                        />
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModalBody;
