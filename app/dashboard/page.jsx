import moment from "moment";
import { dashboardData, getDashboardChartData } from "../lib/data";
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import styles from "../ui/dashboard/dashboard.module.css";
import Transactions from "../ui/dashboard/transactions/transactions";

const Dashboard = async () => {
    const { studentsCount, revenue, totalCoursesSold, latestPayments } =
        await dashboardData();
    const chartData = await getDashboardChartData();

    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.cards}>
                    <Card title="Total Students" count={studentsCount} />
                    <Card title="Revenue" count={revenue} />
                    <Card title="Courses sold" count={totalCoursesSold} />
                </div>
                <Transactions transactions={latestPayments} />
                <Chart data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;
