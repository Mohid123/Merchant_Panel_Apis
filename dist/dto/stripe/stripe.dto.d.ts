declare class CardDTO {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: number;
}
export declare class StripePaymentDTO {
    card: CardDTO;
    payment: string;
    description: string;
    userId: string;
}
export {};
