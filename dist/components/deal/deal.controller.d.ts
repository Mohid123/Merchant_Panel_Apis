import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
export declare class DealController {
    private readonly dealService;
    constructor(dealService: DealService);
    createDeal(dealDto: DealDto): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    getDeal(id: string): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    getDealByMerchant(merchantId: string): Promise<(import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    })[]>;
    getAllDeals(): Promise<(import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    })[]>;
}
