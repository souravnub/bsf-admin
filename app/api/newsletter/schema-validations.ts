import z from "zod";
import { NewsletterActions, RequestBody } from "./types";

const newsletterSubscribeRequestBodySchema = z.object({
    name: z.string().min(3, "name should be atleast 3 characters long"),
    email: z.email(),
});
const newsletterUnsubscribeRequestBodySchemea = z.object({
    email: z.email(),
});

type ValidateRequestRes =
    | { action: NewsletterActions; name?: string; email: string }
    | { error: any };

export function validateRequest({
    action,
    requestBody,
}: {
    action: NewsletterActions;
    requestBody: RequestBody;
}): ValidateRequestRes {
    if (!Object.values(NewsletterActions).includes(action)) {
        return { error: "invalid action" };
    }

    let validationRes:
        | z.ZodSafeParseResult<{ name: string; email: string }>
        | z.ZodSafeParseResult<{ email: string }>;

    if (action === NewsletterActions.subscribe) {
        validationRes =
            newsletterSubscribeRequestBodySchema.safeParse(requestBody);
    } else {
        validationRes =
            newsletterUnsubscribeRequestBodySchemea.safeParse(requestBody);
    }

    if (!validationRes.success) {
        return { error: validationRes.error };
    }

    return { action, ...validationRes.data };
}
