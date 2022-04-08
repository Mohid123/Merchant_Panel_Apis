import { Model } from 'mongoose';
import { ReviewInterface } from '../../interface/review/review.interface';
export declare class ReviewService {
    private readonly reviewModel;
    constructor(reviewModel: Model<ReviewInterface>);
    createReview(reviewDto: any): Promise<ReviewInterface & {
        _id: any;
    }>;
    getAll(): Promise<(ReviewInterface & {
        _id: any;
    })[]>;
    updateReview(updateReviewDto: any, id: any): Promise<any>;
}
