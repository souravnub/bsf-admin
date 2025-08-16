import Link from "next/link";
import styles from "@/app/ui/dashboard/courses/courses.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { fetchCourses } from "@/app/lib/data";
import { deleteCourse } from "@/app/lib/actions";
import { convertToDollars } from "@/app/lib/utils";
import { FaCircle } from "react-icons/fa";

const CoursesPage = async ({ searchParams }) => {
    const q = searchParams?.q || "";
    const page = searchParams?.page || 1;
    const { count, courses } = await fetchCourses(q, page);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Search placeholder="Search for a course..." />
                <Link href="/dashboard/courses/add">
                    <button className={styles.addButton}>Add New</button>
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>is Shown</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Students Enrolled</td>
                        <td>Category</td>
                        <td>Created On</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={JSON.stringify(course._id)}>
                            <td>
                                <FaCircle
                                    className={` text-xs ${
                                        course.isVisibleToCustomers
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                ></FaCircle>
                            </td>
                            <td>
                                <div className={styles.product}>
                                    {course.name}
                                </div>
                            </td>
                            <td>${convertToDollars(course.price)}</td>

                            <td>{course.customers.length}</td>
                            <td>{course.category.category}</td>
                            <td>{course.createdAt?.toString().slice(4, 16)}</td>
                            <td>
                                <div className={styles.buttons}>
                                    <Link
                                        href={`/dashboard/courses/${course._id}`}
                                    >
                                        <button
                                            className={`${styles.button} ${styles.view}`}
                                        >
                                            View
                                        </button>
                                    </Link>
                                    <Link
                                        href={`/dashboard/courses/${course._id}/customers`}
                                    >
                                        <button
                                            className={`${styles.button} ${styles.customer}`}
                                        >
                                            Customers
                                        </button>
                                    </Link>
                                    <form action={deleteCourse}>
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={course._id}
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

export default CoursesPage;
