import { Model } from 'mongoose';
import { ReviewInterface } from '../../interface/review/review.interface';
export declare class ReviewService {
    private readonly reviewModel;
    constructor(reviewModel: Model<ReviewInterface>);
    createReview(reviewDto: any): Promise<ReviewInterface & {
        _id: any;
    }>;
    getAllReviews(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    updateReview(updateReviewDto: any): Promise<import("mongodb").UpdateResult>;
}
