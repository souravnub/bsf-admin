import { AddForm } from "../AddForm";
import styles from "@/app/ui/dashboard/website-content/website-content.css.module.css";
import {
    addUrlToGallery,
    addVideoGalleryCategory,
    deleteUrlFromGallery,
    deleteVideoGalleryCategory,
    fetchVideoGalleryTabs,
} from "@/app/lib/actions";
import { Button } from "../Button";
import { TiDelete } from "react-icons/ti";

const WatchDemo = async () => {
    const tabs = await fetchVideoGalleryTabs();

    return (
        <div className={styles.container}>
            <h3 className={styles.sectionHeading}>
                Manage videos in the demo modal
            </h3>

            <AddForm
                action={addVideoGalleryCategory}
                inputPlaceholder="New Category"
                inputId="addCategory"
                inputLabel="New Category"
                className={styles.form}
            />
            {tabs &&
                tabs.length > 0 &&
                tabs.map(({ _id, name, videos }) => (
                    <div key={_id} className={styles.tabContainer}>
                        <div>
                            <h2>{name}</h2>
                            <Button
                                type="button"
                                className={`${styles.button} ${styles.removeButton}`}
                                onClick={deleteVideoGalleryCategory.bind(
                                    null,
                                    _id
                                )}
                            >
                                Remove Category
                            </Button>
                        </div>
                        {videos.length > 0 && (
                            <ol>
                                {videos?.map((url) => (
                                    <li key={url}>
                                        <span>{url}</span>
                                        <Button
                                            type="button"
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
                        )}
                        <AddForm
                            extraProps={{ _id }}
                            action={addUrlToGallery}
                            inputId="urlInput"
                            inputPlaceholder="Add url"
                            className={styles.form}
                        />
                    </div>
                ))}
        </div>
    );
};

export default WatchDemo;
