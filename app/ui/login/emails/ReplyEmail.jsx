import React from "react";

import { Html } from "@react-email/components";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

export default function ReplyEmail({ message, reply, firstName, lastName }) {
    return (
        <Html>
            <Heading as="h2">Request to Response</Heading>
            <Text>
                Hello {firstName + " " + lastName}, thanks for contacting BSF
                Systems.
            </Text>

            <Text>Your message: {message}</Text>

            <Text>{reply}</Text>

            <Hr />

            <Heading as="h3">Regards</Heading>
            <Text>BSF Systems</Text>
        </Html>
    );
}
