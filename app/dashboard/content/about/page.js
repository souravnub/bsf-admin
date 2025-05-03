import React from "react";
import { fetchAboutContent } from "@/app/lib/data";
import EditAboutContent from "@/app/ui/dashboard/website-content/about-content/EditAboutContent";

const AboutPageContent = async () => {
    const { title, description, video, vission, mission, strategy } =
        await fetchAboutContent();

    return (
        <EditAboutContent
            Title={title}
            Description={description}
            video={video}
            Vission={vission}
            Mission={mission}
            Strategy={strategy}
        />
    );
};

export default AboutPageContent;
