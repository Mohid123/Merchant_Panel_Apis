import { ReviewDto } from '../../dto/review/review.dto';
import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(revieDto: ReviewDto): Promise<import("../../interface/review/review.interface").ReviewInterface & {
        _id: any;
    }>;
    deleteReview(reviewID: string): Promise<import("../../interface/review/review.interface").ReviewInterface & {
        _id: any;
    }>;
    getAllReviews(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getReviewsByMerchant(merchantId: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
