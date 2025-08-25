import React from "react";

import { Html } from "@react-email/components";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

export default function EmailToAll({ message }) {
    return (
        <Html>
            <Heading as="h2">
                Fellow BSF Systems users, we got something for you...
            </Heading>
            <Text>This email is for all.</Text>

            <Text>{message}</Text>

            <Hr />

            <Heading as="h3">Regards</Heading>
            <Text>BSF Systems</Text>
        </Html>
    );
}
