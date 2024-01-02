import { fetchVideoGalleryTabs } from "@/app/lib/actions";
import { fetchHomeContent } from "@/app/lib/data";
import EditHomeContent from "@/app/ui/dashboard/website-content/home-content/EditHomeContent";

import WatchDemo from "@/app/ui/dashboard/website-content/watch-demo/WatchDemo";

const HomePageContent = async () => {
    const tabs = await fetchVideoGalleryTabs();
    const allUrls = tabs.map((tab) => tab.url).flat();
    const { homeContent } = await fetchHomeContent();
    const cards = JSON.parse(JSON.stringify(homeContent[0].section.cards));

    return (
        <>
            <WatchDemo tabs={tabs} allUrls={allUrls} />
            <EditHomeContent
                heroText={homeContent[0].heroText}
                smallHeading={homeContent[0].section.smallHeading}
                bigHeading={homeContent[0].section.bigHeading}
                cards={cards}
            />
        </>
    );
};

export default HomePageContent;
