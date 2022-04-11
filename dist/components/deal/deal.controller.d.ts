import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';
export declare class DealController {
    private readonly dealService;
    constructor(dealService: DealService);
    createDeal(dealDto: DealDto): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    approveRejectDeal(dealID: string, dealStatusDto: DealStatusDto): Promise<import("mongodb").UpdateResult>;
    getDeal(id: string): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    getDealByMerchant(merchantId: string): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    getAllDeals(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
