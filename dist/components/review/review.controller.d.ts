/// <reference types="mongoose" />
import { ReviewTextDto } from 'src/dto/review/merchantreviewreply.dto';
import { ReviewDto } from '../../dto/review/review.dto';
import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(revieDto: ReviewDto): Promise<import("../../interface/review/review.interface").ReviewInterface & {
        _id: string;
    }>;
    createReviewReply(reviewTextDto: ReviewTextDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/review/merchantreviewreply.interface").ReviewTextInterface> & import("../../interface/review/merchantreviewreply.interface").ReviewTextInterface & {
        _id: string;
    }>;
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
}
