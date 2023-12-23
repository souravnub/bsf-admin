import React from "react";

import { Html, Button } from "@react-email/components";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

export default function ForgotPasswordEmail({ name, url }) {
    return (
        <Html>
            <Heading as="h2">Hello {name}</Heading>
            <Text>
                We received a password request. If it&apos;s not you then please
                ignore this email.
            </Text>
            <Button
                pX={20}
                pY={20}
                href={url}
                style={{ background: "#000", color: "#FFFFFF" }}
            >
                Reset Password
            </Button>

            <Hr />

            <Heading as="h3">Regards</Heading>
            <Text>BSF Systems</Text>
        </Html>
    );
}
