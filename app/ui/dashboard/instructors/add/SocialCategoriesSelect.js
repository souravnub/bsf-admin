"use client";
import React, { useEffect, useRef, useState } from "react";
import AddSocialCategoryModal from "./AddSocialCategoryModal";

const SocialCategoriesSelect = ({
    value,
    uniqueCategories,
    categories,
    onChange,
    ...props
}) => {
    const [category, setCategory] = useState(value || categories[0]);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef();

    const handleOptionChange = (e) => {
        if (e.target.value === "new") {
            setIsOpen(true);
        } else {
            setCategory(e.target.value);
        }
    };

    useEffect(() => {
        onChange(selectRef.current.name, category);
    }, [category]);

    return (
        <>
            <select
                ref={selectRef}
                {...props}
                value={category}
                onChange={handleOptionChange}
            >
                {JSON.parse(categories)?.map(({ _id, category }) => (
                    <option
                        disabled={!uniqueCategories.includes(category)}
                        key={String(_id)}
                        value={category}
                    >
                        {category}
                    </option>
                ))}
                <option value={"new"}>Add new</option>
            </select>

            {isOpen && (
                <AddSocialCategoryModal
                    setIsOpen={setIsOpen}
                    setCategory={setCategory}
                />
            )}
        </>
    );
};

export default SocialCategoriesSelect;
