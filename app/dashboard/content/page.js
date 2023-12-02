import {
    addUrlToGallery,
    deleteUrlFromGallery,
    fetchVideoGalleryTabs,
} from "@/app/lib/actions";
import React from "react";
import { AddUrlForm, DeleteButton } from "./ClientComponents";

const ContentPage = async () => {
    const tabs = await fetchVideoGalleryTabs();

    return (
        <div>
            {tabs &&
                tabs.length > 0 &&
                tabs.map(({ _id, category, url }) => (
                    <div key={_id}>
                        <h2>{category}</h2>
                        <ol>
                            {url.map((url) => (
                                <li key={url}>
                                    <span>{url}</span>
                                    <DeleteButton
                                        onClick={deleteUrlFromGallery.bind(
                                            null,
                                            _id,
                                            url
                                        )}
                                    />
                                </li>
                            ))}
                        </ol>
                        <AddUrlForm _id={_id} />
                    </div>
                ))}
        </div>
    );
};

export default ContentPage;
