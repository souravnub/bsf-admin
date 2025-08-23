import { NextResponse } from "next/server";
import { validateRequest } from "../schema-validations";
import { NewsletterActions } from "../types";
import { handleNewsletterRequest } from "@/app/lib/actions";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ action: NewsletterActions }> }
) {
    const { action } = await params;
    const requestBody = await request.json();

    const validationRes = validateRequest({ action, requestBody });

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

    const newsletterResponse = await handleNewsletterRequest({
        action,
        data: { name, email },
    });

    if (!newsletterResponse.success) {
        return NextResponse.json(newsletterResponse, { status: 500 });
    }

    return NextResponse.json(newsletterResponse);
}
