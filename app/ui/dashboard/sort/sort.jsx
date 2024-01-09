"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./sort.module.css";
import { useEffect, useState } from "react";

const Sort = ({ options }) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [selectedVal, setSelectedVal] = useState(null);

    useEffect(() => {
        const preSelectedVal = new URLSearchParams(searchParams).get("sort");
        setSelectedVal(preSelectedVal);
    }, [searchParams]);

    useEffect(() => {
        if (selectedVal) {
            const selectedOption = selectedVal
                .toLowerCase()
                .replace(/\s+/g, "_");
            const params = new URLSearchParams(searchParams);
            params.set("sort", selectedOption);
            replace(`${pathname}?${params}`);
        }
    }, [selectedVal]);

    const handleSort = (e) => {
        setSelectedVal(e.target.value);
    };
    return (
        <div>
            <select
                name="sortBy"
                className={styles.container}
                title="Sort By"
                onChange={handleSort}
                value={selectedVal?.toLowerCase().replace(/\s+/g, "_")}
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
