export interface ReviewTextInterface {
    _id: string;
    reviewID: string;
    merchantMongoID: string;
    merchantID: string;
    voucherMongoID: string;
    voucherID: string;
    // merchantName: string;
    // legalName: string;
    // merchantProfilePicURL: string;
    merchantReplyText: string
    deletedCheck: boolean;
}