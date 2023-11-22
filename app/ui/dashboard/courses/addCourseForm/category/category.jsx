"use client";

import { useState } from "react";

const Category = ({ categories }) => {
    const [newCategory, setNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleSelectChange = (e) => {
        if (e.target.value === "newCategory") {
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
                <option value='null'>Choose a Category</option>
                {categories.map((category) => (
                    <option value={category.category} key={category.id}>
                        {category.category}
                    </option>
                ))}
                <option value='newCategory'>Create New</option>
            </select>

            {newCategory && (
                <>
                    <input
                        type='text'
                        placeholder='New Category Name'
                        value={newCategoryName}
                        onChange={handleNewCategoryNameChange}
                    />
                </>
            )}
        </>
    );
};

export default Category;
