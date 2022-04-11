import { Model } from 'mongoose';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
export declare class DealService {
    private readonly dealModel;
    private categorymodel;
    constructor(dealModel: Model<DealInterface>, categorymodel: Model<CategoryInterface>);
    createDeal(dealDto: any): Promise<DealInterface & {
        _id: any;
    }>;
    approveRejectDeal(dealID: any, dealStatusDto: any): Promise<import("mongodb").UpdateResult>;
    getAllDeals(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDeal(id: any): Promise<DealInterface & {
        _id: any;
    }>;
    getDealByMerchant(id: any): Promise<DealInterface & {
        _id: any;
    }>;
}
