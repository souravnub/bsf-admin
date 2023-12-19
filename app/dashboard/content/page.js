import { fetchVideoGalleryTabs } from "@/app/lib/actions";

import WatchDemo from "@/app/ui/dashboard/website-content/watch-demo/WatchDemo";

const ContentPage = async () => {
    const tabs = await fetchVideoGalleryTabs();
    const allUrls = tabs.map((tab) => tab.url).flat();

    return (
        <>
            <WatchDemo tabs={tabs} allUrls={allUrls} />
            {/* <EditHomeContent /> */}
            {/* Make component for editing content on the home page. */}
        </>
    );
};

export default ContentPage;
