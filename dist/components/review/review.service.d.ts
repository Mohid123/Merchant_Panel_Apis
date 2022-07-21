import { Model } from 'mongoose';
import { DealInterface } from '../../interface/deal/deal.interface';
import { UsersInterface } from '../../interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';
import { ReviewTextInterface } from 'src/interface/review/merchantreviewreply.interface';
export declare class ReviewService {
    private readonly reviewModel;
    private readonly reviewTextModel;
    private readonly dealModel;
    private readonly userModel;
    constructor(reviewModel: Model<ReviewInterface>, reviewTextModel: Model<ReviewTextInterface>, dealModel: Model<DealInterface>, userModel: Model<UsersInterface>);
    createReview(reviewDto: any): Promise<ReviewInterface & {
        _id: string;
    }>;
    createReviewReply(reviewTextDto: any): Promise<import("mongoose").Document<unknown, any, ReviewTextInterface> & ReviewTextInterface & {
        _id: string;
    }>;
    getMerchantReply(merchantID: any, reviewID: any): Promise<any>;
    deleteReview(id: any): Promise<ReviewInterface & {
        _id: string;
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
