import { NextResponse } from "next/server";
import { handleNewsletterSubscribe } from "@/app/lib/actions";
import { validateSubscriptionRequest } from "../schema-validations";

export async function POST(request: Request) {
    const requestBody = await request.json();

    const validationRes = validateSubscriptionRequest({
        requestBody,
    });

    if ("error" in validationRes) {
        return NextResponse.json(
            {
                success: false,
                message: "error while validating request",
                error: validationRes.error,
            },
            { status: 404 }
        );
    }

    const { name, email } = validationRes;

    const newsletterResponse = await handleNewsletterSubscribe({
        data: { name, email },
    });

    if (!newsletterResponse.success) {
        return NextResponse.json(newsletterResponse, { status: 500 });
    }

    return NextResponse.json(newsletterResponse);
}
