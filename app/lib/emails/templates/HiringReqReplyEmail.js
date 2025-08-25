import React from "react";

import { Html } from "@react-email/components";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

export default function HiringReqReplyEmail({
    jobDesc,
    roleRequired,
    reply,
    name,
}) {
    return (
        <Html>
            <Heading as="h2">Response to hire alumni request</Heading>
            <Text>
                Hello {name}, Thank you for reaching out to BSF Systems.
            </Text>

            <Text>Your conditions:</Text>
            <Text>role : {roleRequired}</Text>
            <Text>job description: {jobDesc}</Text>

            <Text>Our Response:</Text>
            <Text>{reply}</Text>

            <Hr />

            <Heading as="h3">Regards</Heading>
            <Text>BSF Systems</Text>
        </Html>
    );
}
