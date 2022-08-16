import { MedialUrl, multipleRatings } from 'src/interface/review/review.interface';
export declare class ReviewDto {
    id: string;
    dealMongoID: string;
    dealID: string;
    dealHeader: string;
    subDealHeader: string;
    voucherMongoID: string;
    voucherID: string;
    customerID: string;
    merchantMongoID: string;
    merchantID: string;
    text: string;
    mediaUrl: MedialUrl[];
    totalRating: number;
    multipleRating: multipleRatings[];
    customerEmail: string;
    customerName: string;
    profilePicURL: string;
    voucherRedeemedDate: number;
    isViewed: boolean;
}
