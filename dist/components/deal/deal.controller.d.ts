import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';
import { SORT } from 'src/enum/sort/sort.enum';
export declare class DealController {
    private readonly dealService;
    constructor(dealService: DealService);
    createDeal(dealDto: DealDto, req: any): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    approveRejectDeal(dealID: string, dealStatusDto: DealStatusDto): Promise<import("mongodb").UpdateResult>;
    getDeal(id: string): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    getDealsReviewStatsByMerchant(merchantId: string, offset?: number, limit?: number): Promise<{
        totalDeals: number;
        totalMerchantReviews: any;
        data: any[];
    }>;
    getAllDeals(offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDeals(title: SORT, price: SORT, startDate: SORT, endDate: SORT, dateFrom: number, dateTo: number, offset: number, limit: number, req: any): Promise<{
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
    getDealReviews(id: string, offset?: number, limit?: number): Promise<any[]>;
    getTopRatedDeals(merchantId: string): Promise<any[]>;
}
