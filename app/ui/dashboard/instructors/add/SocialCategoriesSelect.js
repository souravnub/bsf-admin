import { fetchSocialCategories } from "@/app/lib/data";
import React from "react";
import AddSocialCategoryModal from "./AddSocialCategoryModal";

const SocialCategoriesSelect = async ({ ...props }) => {
    const categories = await fetchSocialCategories();

    return (
        <>
            <select {...props}>
                {categories.map(({ _id, category }) => (
                    <option key={String(_id)} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <AddSocialCategoryModal />
        </>
    );
};

export default SocialCategoriesSelect;
