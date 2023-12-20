import { fetchVideoGalleryTabs } from "@/app/lib/actions";
import { fetchHomeContent } from "@/app/lib/data";
import EditHomeContent from "@/app/ui/dashboard/website-content/home-content/EditHomeContent";

import WatchDemo from "@/app/ui/dashboard/website-content/watch-demo/WatchDemo";

const ContentPage = async () => {
    const tabs = await fetchVideoGalleryTabs();
    const allUrls = tabs.map((tab) => tab.url).flat();
    const { homeContent } = await fetchHomeContent();

    return (
        <>
            <WatchDemo tabs={tabs} allUrls={allUrls} />
            <EditHomeContent
                heroText={homeContent[0].heroText}
                smallHeading={homeContent[0].section.smallHeading}
                bigHeading={homeContent[0].section.bigHeading}
            />
        </>
    );
};

export default ContentPage;
