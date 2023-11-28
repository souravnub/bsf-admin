"use client";

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

/*
  Write a function in data.js that queries all the top 3 courses sold in a particular month and returns it in the format the data object is.
*/

const data = [
    {
        name: "Jan",
        course1: 2400,
        course2: 1234,
        course3: 8904,
    },
    {
        name: "Feb",
        course1: 1398,
        course2: 5443,
        course3: 43,
    },
    {
        name: "Mar",
        course1: 3800,
        course2: 654,
        course3: 6543,
    },
    {
        name: "Apr",
        course1: 3908,
        course2: 2346,
        course3: 5436,
    },
    {
        name: "May",
        course1: 4800,
        course2: 7465,
        course3: 8904,
    },
    {
        name: "Jun",
        course1: 3800,
        course2: 2344,
        course3: 423,
    },
    {
        name: "July",
        course1: 4300,
        course2: 9000,
        course3: 7090,
    },
    {
        name: "Aug",
        course1: 4300,
        course2: 6262,
        course3: 9873,
    },
    {
        name: "Sept",
        course1: 4300,
        course2: 2320,
        course3: 2300,
    },
    {
        name: "Oct",
        course1: 4300,
        course2: 1378,
        course3: 1321,
    },
    {
        name: "Nov",
        course1: 4300,
        course2: 7951,
        course3: 1322,
    },
    {
        name: "Dec",
        course1: 4300,
        course2: 8976,
        course3: 2135,
    },
];

const Chart = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quick Overview</h2>
            <p className={styles.subtext}>Top 3 most selling courses</p>
            <ResponsiveContainer width='100%' height='90%'>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ background: "#151c2c", border: "none" }}
                    />
                    <Legend />
                    <Line
                        type='monotone'
                        dataKey='course1'
                        stroke='#8884d8' // Blue
                        strokeDasharray='5 5'
                    />
                    <Line
                        type='monotone'
                        dataKey='course2'
                        stroke='#82ca9d' // Green
                        strokeDasharray='3 4 5 2'
                    />
                    <Line
                        type='monotone'
                        dataKey='course3'
                        stroke='#ffc658' // Yellow
                        strokeDasharray='3 4 5 2'
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
