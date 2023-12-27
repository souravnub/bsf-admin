"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./sort.module.css";

const Sort = ({ options }) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSort = (e) => {
        const selectedOption = e.target.value
            .toLowerCase()
            .replace(/\s+/g, "_");

        const params = new URLSearchParams(searchParams);
        params.set("sort", selectedOption);

        replace(`${pathname}?${params}`);
    };
    return (
        <div>
            <select
                name="sortBy"
                className={styles.container}
                title="Sort By"
                onChange={handleSort}
            >
                {options.map((option, index) => (
                    <option
                        key={index}
                        value={option.toLowerCase().replace(/\s+/g, "_")}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Sort;
