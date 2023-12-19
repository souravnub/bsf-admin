import React from "react";
import styles from "@/app/ui/dashboard/courses/addCourse/addCourse.module.css";
import addAdminStyles from "@/app/ui/dashboard/admins/addAdmin/addAdmin.module.css";

import { addAdmin } from "@/app/lib/actions";

const AddAdmin = () => {
    return (
        <div className={styles.container}>
            <form action={addAdmin} className={styles.form}>
                <div>
                    <label htmlFor="username">User name*</label>
                    <input type="text" name="username" id="username" required />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" required />
                </div>

                <div className={addAdminStyles.radioGroup}>
                    <span htmlFor="isAdmin">Is admin?</span>

                    <div>
                        <div>
                            <input
                                type="radio"
                                defaultChecked
                                name="isAdmin"
                                id="Yes"
                                value="true"
                            />
                            <label htmlFor="Yes">Yes</label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                value="false"
                                name="isAdmin"
                                id="No"
                            />
                            <label htmlFor="No">No</label>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="password">password*</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                    />
                </div>

                <button type="submit" style={{ width: "45%" }}>
                    Add
                </button>
            </form>
        </div>
    );
};

export default AddAdmin;
