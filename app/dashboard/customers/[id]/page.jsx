import Link from "next/link";
import { fetchCustomer } from "../../../lib/data";
import styles from "@/app/ui/dashboard/customers/singleUser/singleUser.module.css";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

const CustomerInfo = async ({ params }) => {
    const { id } = params;
    const information = await fetchCustomer(id);

    return (
        <div className={styles.container}>
            <h2 className={styles.name}>{information.name}</h2>
            <p className={styles.email}>{information.email}</p>
            <h3 className={styles.title}>Courses enrolled in:</h3>

            {information.courses.map((course) => {
                if (!course.course)
                    return (
                        <div className="text-red-400">
                            This course was deleted
                        </div>
                    );

                return (
                    <div
                        key={JSON.stringify(course._id)}
                        className={styles.linksContainer}
                    >
                        <Link
                            href={`https://bsfsystems.com/courses/${course._id}`}
                            className={styles.link}
                            target="_blank"
                        >
                            {course.course.name}
                            <LiaExternalLinkAltSolid />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomerInfo;
