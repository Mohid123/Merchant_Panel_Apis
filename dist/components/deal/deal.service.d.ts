import { Model } from 'mongoose';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
export declare class DealService {
    private readonly dealModel;
    private categorymodel;
    constructor(dealModel: Model<DealInterface>, categorymodel: Model<CategoryInterface>);
    createDeal(dealDto: any, req: any): Promise<DealInterface & {
        _id: any;
    }>;
    approveRejectDeal(dealID: any, dealStatusDto: any): Promise<import("mongodb").UpdateResult>;
    getAllDeals(req: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDeal(id: any): Promise<DealInterface & {
        _id: any;
    }>;
    getDealByMerchant(id: any): Promise<DealInterface & {
        _id: any;
    }>;
    getDeals(title: any, price: any, startDate: any, endDate: any, dateFrom: any, dateTo: any, offset: any, limit: any, req: any): Promise<{
        totalDeals: number;
        deals: any[];
    }>;
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
