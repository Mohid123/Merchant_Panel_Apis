import { ReviewTextDto } from 'src/dto/review/merchantreviewreply.dto';
import { ReviewDto } from '../../dto/review/review.dto';
import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(revieDto: ReviewDto, req: any): Promise<import("../../interface/review/review.interface").ReviewInterface & {
        _id: string;
    }>;
    getReviewforCustomerProfile(voucherID: string): Promise<any>;
    createReviewReply(reviewTextDto: ReviewTextDto): Promise<any>;
    getMerchantReply(merchantID: string, reviewID: string): Promise<any[]>;
    deleteReview(reviewID: string): Promise<import("../../interface/review/review.interface").ReviewInterface & {
        _id: string;
    }>;
    getAllReviews(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getReviewsByMerchant(merchantId: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    updateReviewViewState(reviewID: string): Promise<import("mongodb").UpdateResult>;
    getNewReviewsForMerchant(merchantId: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
