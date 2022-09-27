import { Model } from 'mongoose';
import { DealInterface } from '../../interface/deal/deal.interface';
import { UsersInterface } from '../../interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';
import { ReviewTextInterface } from 'src/interface/review/merchantreviewreply.interface';
import { VoucherInterface } from 'src/interface/vouchers/vouchers.interface';
export declare class ReviewService {
    private readonly reviewModel;
    private readonly reviewTextModel;
    private readonly dealModel;
    private readonly userModel;
    private readonly voucherModel;
    constructor(reviewModel: Model<ReviewInterface>, reviewTextModel: Model<ReviewTextInterface>, dealModel: Model<DealInterface>, userModel: Model<UsersInterface>, voucherModel: Model<VoucherInterface>);
    createReview(reviewDto: any, req: any): Promise<ReviewInterface & {
        _id: string;
    }>;
    getReviewforCustomerProfile(voucherID: any): Promise<any>;
    createReviewReply(reviewTextDto: any): Promise<any>;
    getMerchantReply(merchantID: any, reviewID: any): Promise<any[]>;
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
    updateReviewViewState(id: any): Promise<import("mongodb").UpdateResult>;
    getNewReviewsForMerchant(merchantId: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
