export interface ReviewTextInterface {
    _id: string,
    reviewID: string,
    merchantID: string;
    voucherID: string;
    merchantName: string;
    legalName: string;
    profilePicURL: string;
    merchantReplyText: string
    deletedCheck: boolean;
}