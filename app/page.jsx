import styles from "@/app/ui/home/home.module.css";

import Link from "next/link";

const Homepage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.heading}>BSF Systems Admin Dashboard</h1>
            </header>

            <main className={styles.main}>
                <Link href={"/login"} className={styles.link}>
                    Proceed to login
                </Link>
            </main>
        </div>
    );
};

export default Homepage;
