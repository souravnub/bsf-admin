import React from "react";
import { AddForm } from "../../content/AddForm";
import styles from "@/app/ui/dashboard/content/manageContent.module.css";
import {
    addUrlToGallery,
    addVideoGalleryCategory,
    deleteUrlFromGallery,
    deleteVideoGalleryCategory,
} from "@/app/lib/actions";
import { Button } from "../../content/Button";
import { TiDelete } from "react-icons/ti";

function WatchDemo({ tabs, allUrls }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.sectionHeading}>
                Manage Videos in the Demo Modal
            </h2>
            <AddForm
                action={addVideoGalleryCategory}
                inputPlaceholder='New Category'
                inputId='addCategory'
                inputLabel='New Category'
                className={styles.form}
            />
            {tabs &&
                tabs.length > 0 &&
                tabs.map(({ _id, category, url }) => (
                    <div key={_id} className={styles.tabContainer}>
                        <div>
                            <h2>{category}</h2>
                            <Button
                                className={`${styles.button} ${styles.removeButton}`}
                                onClick={deleteVideoGalleryCategory.bind(
                                    null,
                                    _id
                                )}
                            >
                                Remove Category
                            </Button>
                        </div>
                        <ol>
                            {url.map((url) => (
                                <li key={url}>
                                    <span>{url}</span>
                                    <Button
                                        className={`${styles.deleteButton}`}
                                        onClick={deleteUrlFromGallery.bind(
                                            null,
                                            _id,
                                            url
                                        )}
                                    >
                                        <TiDelete />
                                    </Button>
                                </li>
                            ))}
                        </ol>
                        <AddForm
                            allUrls={allUrls}
                            extraProps={{ _id }}
                            action={addUrlToGallery}
                            inputId='urlInput'
                            inputPlaceholder='Add url'
                            className={styles.form}
                        />
                    </div>
                ))}
        </div>
    );
}

export default WatchDemo;
