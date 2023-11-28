"use client";

import { useState } from "react";

const Category = ({ categories, selected }) => {
    const [newCategory, setNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState(
        "Enter a new category name"
    );

    const handleSelectChange = (e) => {
        if (e.target.value === "Enter a new category name") {
            setNewCategory(true);
        } else {
            setNewCategory(false);
            // Handle selecting existing category if needed
        }
    };

    const handleNewCategoryNameChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    return (
        <>
            <select name='category' id='cat' onChange={handleSelectChange}>
                {categories.map((category) => (
                    <option
                        value={category._id}
                        key={category._id}
                        selected={category === selected ? "selected" : ""}
                    >
                        {category.category}
                    </option>
                ))}
                <option value={newCategoryName} key='createNew'>
                    Create New
                </option>
            </select>

            {newCategory && (
                <>
                    <input
                        type='text'
                        placeholder='New Category Name'
                        value={newCategoryName}
                        onChange={(e) => handleNewCategoryNameChange(e)}
                    />
                </>
            )}
        </>
    );
};

export default Category;
