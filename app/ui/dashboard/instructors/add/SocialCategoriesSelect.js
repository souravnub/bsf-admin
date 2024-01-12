"use client";
import React, { useRef, useState } from "react";
import AddSocialCategoryModal from "./AddSocialCategoryModal";

const SocialCategoriesSelect = ({ categories, ...props }) => {
    const [newCategory, setNewCategory] = useState(categories[0]);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef();

    const handleOptionChange = (e) => {
        if (e.target.value === "new") {
            setIsOpen(true);
        }
    };

    return (
        <>
            <select
                ref={selectRef}
                {...props}
                value={newCategory}
                onChange={handleOptionChange}
            >
                {JSON.parse(categories)?.map(({ _id, category }) => (
                    <option key={String(_id)} value={category}>
                        {category}
                    </option>
                ))}
                <option value={"new"}>Add new</option>
            </select>

            {isOpen && (
                <AddSocialCategoryModal
                    setIsOpen={setIsOpen}
                    setNewCategory={setNewCategory}
                />
            )}
        </>
    );
};

export default SocialCategoriesSelect;
