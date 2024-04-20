import { fetchContactInfo } from "@/app/lib/data";
import ContactInfo from "@/app/ui/dashboard/website-content/contact-info/ContactInfo";
import React from "react";

const WebsiteContactInfo = async () => {
    const contactData = await fetchContactInfo();

    return <ContactInfo data={contactData} />;
};

export default WebsiteContactInfo;
