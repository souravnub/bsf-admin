"use client";

import { DashboardChartData } from "@/app/lib/data";
import styles from "./chart.module.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";
import { getRandomColor } from "@/app/lib/utils";

interface ChartProps {
    data: DashboardChartData;
}

const getCoursesFromChartData = (chartData: DashboardChartData): string[] => {
    return Object.keys(chartData[0]).filter((key) => key !== "month");
};

const Chart = ({ data }: ChartProps) => {
    const [filter, setFilter] = useState("all");

    const randomColorsForChartLines = useMemo(() => {
        const numberOfCourses = getCoursesFromChartData(data).length;
        const randomColors = [];

        for (let index = 0; index < numberOfCourses; index++) {
            randomColors.push(getRandomColor());
        }

        return randomColors;
    }, []);

    const filteredCourse = useMemo(() => {
        if (filter !== "all") {
            return data.map((dataObj) => {
                const obj = { month: dataObj.month };
                obj[filter] = dataObj[filter];

                return obj;
            });
        }
        return data;
    }, [data, filter]);

    const courses = getCoursesFromChartData(data);

    return (
        <div className={styles.container}>
            <div className="flex justify-between">
                <h2 className={styles.title}>Course Sales over the year</h2>

                <select
                    className="outline rounded-sm"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                >
                    <option value="all">All</option>
                    {courses.map((course) => {
                        return (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        );
                    })}
                </select>
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={500}
                    height={300}
                    data={filteredCourse}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis
                        dataKey="month"
                        tickFormatter={(tick: string) => tick.toUpperCase()}
                    />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ background: "#151c2c", border: "none" }}
                    />
                    <Legend
                        layout="vertical"
                        iconType="square"
                        iconSize={6}
                        align="left"
                        verticalAlign="top"
                    />

                    {Object.keys(data[0])
                        .filter((key) => key !== "month")
                        .map((courseName, idx) => {
                            return (
                                <Line
                                    key={courseName}
                                    type="monotone"
                                    dataKey={courseName}
                                    strokeWidth={2}
                                    stroke={randomColorsForChartLines[idx]}
                                />
                            );
                        })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
