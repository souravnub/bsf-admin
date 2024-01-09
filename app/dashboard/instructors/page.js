import React from "react";
import styles from "@/app/ui/dashboard/courses/courses.module.css";
import Link from "next/link";
import { fetchInstructors } from "@/app/lib/data";
import Image from "next/image";
import instructorStyles from "@/app/ui/dashboard/instructors/instructors.module.css";
import { deleteInstructor } from "@/app/lib/actions";

const Instructors = async () => {
    const instructors = await fetchInstructors();
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div></div>
                <Link
                    className={styles.addButton}
                    href="/dashboard/instructors/add"
                >
                    Add New
                </Link>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Image</td>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Role</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {instructors.map(({ _id, name, email, role, imgUrl }) => {
                        return (
                            <tr key={String(_id)}>
                                <td>
                                    <Image
                                        alt={name}
                                        src={imgUrl}
                                        width={50}
                                        height={50}
                                        className={instructorStyles.profileImg}
                                    />
                                </td>
                                <td>{name}</td>
                                <td>{email}</td>
                                <td>{role}</td>
                                <td>
                                    <div className={styles.buttons}>
                                        <Link
                                            href={`/dashboard/instructors/${_id}`}
                                            className={`${styles.button} ${styles.view}`}
                                            style={{
                                                fontSize: ".9rem",
                                                display: "grid",
                                                placeContent: "center",
                                            }}
                                        >
                                            View
                                        </Link>

                                        <form action={deleteInstructor}>
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={String(_id)}
                                            />
                                            <button
                                                className={`${styles.button} ${styles.delete}`}
                                                style={{
                                                    paddingBlock: ".5rem",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Instructors;
