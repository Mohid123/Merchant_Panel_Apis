export interface ReviewTextInterface {
    _id: string;
    reviewID: string;
    merchantMongoID: string;
    merchantID: string;
    voucherMongoID: string;
    voucherID: string;
    merchantReplyText: string;
    deletedCheck: boolean;
}
