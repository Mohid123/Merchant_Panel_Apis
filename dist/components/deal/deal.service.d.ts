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
    getAllDeals(): Promise<(DealInterface & {
        _id: any;
    })[]>;
    getDeal(id: any): Promise<DealInterface & {
        _id: any;
    }>;
    getDealByMerchant(id: any): Promise<(DealInterface & {
        _id: any;
    })[]>;
}
