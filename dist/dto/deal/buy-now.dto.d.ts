declare class CardDTO {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: number;
}
export declare class BuyNowDTO {
    card: CardDTO;
    dealID: string;
    subDealID: string;
    affiliateID: string;
    quantity: number;
}
export {};
