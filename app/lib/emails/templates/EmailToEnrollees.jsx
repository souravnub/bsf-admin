import React from "react";

import { Html } from "@react-email/components";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

export default function EmailToEnrollees({ message, category }) {
    return (
        <Html>
            <Heading as="h2">
                All {category} students, we&apos;ve got some news for you!
            </Heading>
            <Text>Message-</Text>

            <Text>{message}</Text>

            <Hr />

            <Heading as="h3">Regards</Heading>
            <Text>BSF Systems</Text>
        </Html>
    );
}
