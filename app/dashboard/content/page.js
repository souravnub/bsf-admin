import { addUrlToGallery, fetchVideoGalleryTabs } from "@/app/lib/actions";
import React from "react";
import { TiDelete } from "react-icons/ti";

const ContentPage = async () => {
    const tabs = await fetchVideoGalleryTabs();

    return (
        <div>
            {tabs.map(({ _id, category, url }) => (
                <>
                    <h2>{category}</h2>
                    <ol>
                        {url.map((url) => (
                            <li>
                                <span>{url}</span>
                                <button>
                                    <TiDelete />
                                </button>
                            </li>
                        ))}
                    </ol>
                    <form action={addUrlToGallery.bind(null, _id)}>
                        <input name="newUrl" />
                        <button>add</button>
                    </form>
                </>
            ))}
        </div>
    );
};

export default ContentPage;
