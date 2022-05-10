import { Model } from 'mongoose';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import { VoucherCounterInterface } from 'src/interface/vouchers/vouchersCounter.interface';
import { SubCategoryInterface } from 'src/interface/category/subcategory.interface';
export declare class DealService {
    private readonly dealModel;
    private readonly categorymodel;
    private readonly voucherCounterModel;
    private readonly subCategoryModel;
    constructor(dealModel: Model<DealInterface>, categorymodel: Model<CategoryInterface>, voucherCounterModel: Model<VoucherCounterInterface>, subCategoryModel: Model<SubCategoryInterface>);
    generateVoucherId(sequenceName: any): Promise<0>;
    createDeal(dealDto: any, req: any): Promise<DealInterface & {
        _id: any;
    }>;
    updateDeal(updateDealDto: any, dealID: any): Promise<{
        message: string;
    }>;
    approveRejectDeal(dealID: any, dealStatusDto: any): Promise<import("mongodb").UpdateResult>;
    getAllDeals(req: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDeal(id: any): Promise<DealInterface & {
        _id: any;
    }>;
    getDealReviews(offset: any, limit: any, rating: any, id: any): Promise<any>;
    getDealsReviewStatsByMerchant(id: any, offset: any, limit: any): Promise<{
        totalDeals: number;
        totalMerchantReviews: any;
        data: any[];
    }>;
    getDealsByMerchantID(merchantID: any, title: any, price: any, startDate: any, endDate: any, dateFrom: any, dateTo: any, offset: any, limit: any): Promise<{
        totalDeals: number;
        data: any[];
    }>;
    getTopRatedDeals(merchantID: any): Promise<any[]>;
    getSalesStatistics(req: any): Promise<{
        monthlyStats: {
            totalDeals: number;
            scheduledDeals: number;
            pendingDeals: number;
            publishedDeals: number;
        }[];
        yearlyStats: {
            totalDeals: number;
            scheduledDeals: number;
            pendingDeals: number;
            publishedDeals: number;
        };
        totalStats: {
            totalDeals: number;
            scheduledDeals: number;
            pendingDeals: number;
            publishedDeals: number;
        };
    }>;
}
