import Link from "next/link";
import { fetchCustomer } from "../../../lib/data";
import styles from "@/app/ui/dashboard/customers/singleUser/singleUser.module.css";

const CustomerInfo = async ({ params }) => {
    const { id } = params;
    const information = await fetchCustomer(id);

    return (
        <div className={styles.container}>
            <h2>{information.name}</h2>
            <p>{information.email}</p>
            <h3>Courses enrolled in:</h3>

            {information.courses.map((course) => (
                <Link
                    key={JSON.stringify(course._id)}
                    href={`/dashboard/courses/${course.course._id}`}
                >
                    {course.course.name}
                </Link>
            ))}
        </div>
    );
};

export default CustomerInfo;
