import { NextResponse } from "next/server";
import { handleNewsletterUnsubscribe } from "@/app/lib/actions";
import { validateUnsubscribeRequest } from "../schema-validations";

export async function POST(request: Request) {
    const requestBody = await request.json();

    const validationRes = validateUnsubscribeRequest({
        requestBody,
    });

    if ("error" in validationRes) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Error while verifying the inputs. Check your input and try again.",
                error: validationRes.error,
            },
            { status: 404 }
        );
    }

    const { encryptedEmail } = validationRes;

    const newsletterResponse = await handleNewsletterUnsubscribe({
        encryptedEmail,
    });

    if (!newsletterResponse.success) {
        return NextResponse.json(newsletterResponse, { status: 500 });
    }

    return NextResponse.json(newsletterResponse);
}
