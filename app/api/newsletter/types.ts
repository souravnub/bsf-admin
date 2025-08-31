export interface SubscribeRequestBody {
    name: string;
    email: string;
}

export interface UnsubscribeRequestBody {
    encryptedEmail: string;
}
