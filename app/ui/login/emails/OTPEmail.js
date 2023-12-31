import React from "react";

import { Html, Button } from "@react-email/components";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

export default function OTPEmail({ name, OTP }) {
    return (
        <Html>
            <Heading as="h2">Hello {name}</Heading>
            <Text>
                We received a verification request for this email. If it&apos;s
                not you then please ignore this email.
            </Text>

            <Heading as="h1">{OTP}</Heading>

            <Hr />

            <Heading as="h3">Regards</Heading>
            <Text>BSF Systems</Text>
        </Html>
    );
}
