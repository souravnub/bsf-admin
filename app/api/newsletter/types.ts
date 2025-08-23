export enum NewsletterActions {
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
}

export interface RequestBody {
    name: string;
    email: string;
}
