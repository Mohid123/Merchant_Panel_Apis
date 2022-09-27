import { MedialUrl, multipleRatings } from 'src/interface/review/review.interface';
export declare class ReviewDto {
    voucherMongoID: string;
    voucherID: string;
    text: string;
    mediaUrl: MedialUrl[];
    multipleRating: multipleRatings[];
    isViewed: boolean;
}
