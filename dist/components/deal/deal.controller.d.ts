import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';
import { SORT } from '../../enum/sort/sort.enum';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { UpdateDealDto } from '../../dto/deal/updatedeal.dto';
import { MultipleDealsDto } from 'src/dto/deal/multipledeals.dto';
import { MultipleReviewsDto } from 'src/dto/review/multiplereviews.dto';
export declare class DealController {
    private readonly dealService;
    constructor(dealService: DealService);
    createDeal(dealDto: DealDto, req: any): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    updateDeal(dealID: string, updateDealDto: UpdateDealDto): Promise<{
        message: string;
    }>;
    deleteDeal(dealID: string): Promise<{
        status: string;
        message: string;
    }>;
    approveRejectDeal(dealID: string, dealStatusDto: DealStatusDto): Promise<import("mongodb").UpdateResult>;
    getDeal(id: string): Promise<import("../../interface/deal/deal.interface").DealInterface & {
        _id: any;
    }>;
    getDealsReviewStatsByMerchant(merchantID: string, dealID: string, offset: number, limit: number, multipleReviewsDto: MultipleReviewsDto): Promise<{
        overallRating: number;
        totalMerchantReviews: any;
        data: any[];
    }>;
    getAllDeals(offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDealsByMerchantID(merchantID: string, dealHeader: SORT, price: SORT, startDate: SORT, endDate: SORT, availableVoucher: SORT, soldVoucher: SORT, status: DEALSTATUS, dateFrom: number, dateTo: number, dealID: string, header: string, dealStatus: string, offset: number, limit: number, multipleDealsDto: MultipleDealsDto): Promise<{
        totalDeals: number;
        data: any[];
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
    getDealReviews(dealID: string, rating: number, offset?: number, limit?: number): Promise<any>;
    getTopRatedDeals(merchantID: string): Promise<any[]>;
}
