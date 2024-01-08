import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import {
    MdDashboard,
    MdSupervisedUserCircle,
    MdWork,
    MdLogout,
    MdAdminPanelSettings,
    MdLibraryBooks,
    MdChat,
    MdRateReview,
} from "react-icons/md";
import { auth, signOut } from "@/app/auth";

const menuItems = [
    {
        title: "General",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <MdDashboard />,
            },
            {
                title: "Customers",
                path: "/dashboard/customers",
                icon: <MdSupervisedUserCircle />,
            },
            {
                title: "Admins",
                path: "/dashboard/admins",
                icon: <MdAdminPanelSettings />,
            },
            {
                title: "Courses",
                path: "/dashboard/courses",
                icon: <MdLibraryBooks />,
            },
            {
                title: "Reviews",
                path: "/dashboard/course-reviews",
                icon: <MdRateReview />,
            },
        ],
    },
    {
        title: "Website",
        list: [
            {
                title: "Home page Content",
                path: "/dashboard/content/home",
                icon: <MdWork />,
            },
            {
                title: "About page Content",
                path: "/dashboard/content/about",
                icon: <MdWork />,
            },
            {
                title: "Messages",
                path: "/dashboard/messages",
                icon: <MdChat />,
            },
        ],
    },
];

const Sidebar = async () => {
    const { user } = await auth();
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <div className={styles.userDetail}>
                    <span className={styles.username}>
                        Hello,{" "}
                        {user.username.charAt(0).toUpperCase() +
                            user.username.slice(1)}
                    </span>
                    <span className={styles.userTitle}>Administrator</span>
                </div>
            </div>
            <ul className={styles.list}>
                {menuItems.map((cat) => (
                    <li key={cat.title}>
                        <span className={styles.cat}>{cat.title}</span>
                        {cat.list.map((item) => (
                            <MenuLink item={item} key={item.title} />
                        ))}
                    </li>
                ))}
            </ul>
            <form
                action={async () => {
                    "use server";
                    await signOut();
                }}
            >
                <button className={styles.logout}>
                    <MdLogout />
                    Logout
                </button>
            </form>
        </div>
    );
};

export default Sidebar;
