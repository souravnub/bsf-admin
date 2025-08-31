import z from "zod";
import { SubscribeRequestBody, UnsubscribeRequestBody } from "./types";

const newsletterSubscribeRequestBodySchema = z.object({
    name: z.string().min(3, "name should be atleast 3 characters long"),
    email: z.email(),
});
const newsletterUnsubscribeRequestBodySchemea = z.object({
    encryptedEmail: z.string(),
});

type ValidateSubscribeRequestRes =
    | { name?: string; email: string }
    | { error: any };

export function validateSubscriptionRequest({
    requestBody,
}: {
    requestBody: SubscribeRequestBody;
}): ValidateSubscribeRequestRes {
    const validationRes =
        newsletterSubscribeRequestBodySchema.safeParse(requestBody);

    if (!validationRes.success) {
        return { error: validationRes.error };
    }

    return { ...validationRes.data };
}

export function validateUnsubscribeRequest({
    requestBody,
}: {
    requestBody: UnsubscribeRequestBody;
}) {
    const validationRes =
        newsletterUnsubscribeRequestBodySchemea.safeParse(requestBody);

    if (!validationRes.success) {
        return { error: validationRes.error };
    }

    return { ...validationRes.data };
}
