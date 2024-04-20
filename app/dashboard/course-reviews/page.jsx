import styles from "@/app/ui/dashboard/customers/customers.module.css";
import { fetchReviews } from "@/app/lib/data";
import SyncedCheckbox from "@/app/ui/dashboard/course-review/SyncedCheckbox";
import ReviewModal from "@/app/ui/dashboard/course-review/ReviewModal";

const Reviews = async () => {
    const reviews = await fetchReviews();
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Show</td>
                        <td>Email</td>
                        <td>Rating</td>
                        <td>Course</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review._id}>
                            <td>
                                <SyncedCheckbox
                                    initialVal={review.isShown}
                                    reviewId={review._id.toString()}
                                />
                            </td>
                            <td>{review.customerEmail}</td>
                            <td>{review.rating}</td>
                            <td>{review.courseName}</td>
                            <td>
                                <ReviewModal
                                    reviewId={review._id.toString()}
                                    customerEmail={review.customerEmail}
                                    courseName={review.courseName}
                                    message={review.message}
                                    rating={review.rating}
                                    buttonTxt="View"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reviews;
