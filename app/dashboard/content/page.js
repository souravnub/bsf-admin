import {
    addUrlToGallery,
    addVideoGalleryCategory,
    deleteUrlFromGallery,
    deleteVideoGalleryCategory,
    fetchVideoGalleryTabs,
} from "@/app/lib/actions";
import React from "react";
import { TiDelete } from "react-icons/ti";
import { AddForm, Button } from "./ClientComponents";

const ContentPage = async () => {
    const tabs = await fetchVideoGalleryTabs();
    const allUrls = tabs.map((tab) => tab.url).flat();

    return (
        <div>
            <AddForm action={addVideoGalleryCategory} />
            {tabs &&
                tabs.length > 0 &&
                tabs.map(({ _id, category, url }) => (
                    <div key={_id}>
                        <div>
                            <h2>{category}</h2>
                            <Button
                                onClick={deleteVideoGalleryCategory.bind(
                                    null,
                                    _id
                                )}>
                                Remove Category
                            </Button>
                        </div>
                        <ol>
                            {url.map((url) => (
                                <li key={url}>
                                    <span>{url}</span>
                                    <Button
                                        onClick={deleteUrlFromGallery.bind(
                                            null,
                                            _id,
                                            url
                                        )}>
                                        <TiDelete />
                                    </Button>
                                </li>
                            ))}
                        </ol>
                        <AddForm
                            allUrls={allUrls}
                            extraProps={{ _id }}
                            action={addUrlToGallery}
                        />
                    </div>
                ))}
        </div>
    );
};

export default ContentPage;
