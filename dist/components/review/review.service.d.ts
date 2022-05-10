import { Model } from 'mongoose';
import { DealInterface } from '../../interface/deal/deal.interface';
import { UsersInterface } from '../../interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';
export declare class ReviewService {
    private readonly reviewModel;
    private readonly dealModel;
    private readonly userModel;
    constructor(reviewModel: Model<ReviewInterface>, dealModel: Model<DealInterface>, userModel: Model<UsersInterface>);
    createReview(reviewDto: any): Promise<ReviewInterface & {
        _id: any;
    }>;
    deleteReview(id: any): Promise<ReviewInterface & {
        _id: any;
    }>;
    getAllReviews(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getReviewsByMerchant(merchantId: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
