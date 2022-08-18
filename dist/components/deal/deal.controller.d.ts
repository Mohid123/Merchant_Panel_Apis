import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';
import { SORT } from '../../enum/sort/sort.enum';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { UpdateDealDto } from '../../dto/deal/updatedeal.dto';
import { MultipleDealsDto } from 'src/dto/deal/multipledeals.dto';
import { MultipleReviewsDto } from 'src/dto/review/multiplereviews.dto';
import { UpdateDealForCRMDTO } from 'src/dto/deal/updateDealForCrm.dto';
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
        totalDeals: number;
        filteredDealCount: number;
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
    getDealsByMerchantIDForCustomerPanel(merchantID: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
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
    getDealReviews(dealID: string, createdAt: SORT, totalRating: SORT, rating: number, offset?: number, limit?: number): Promise<any>;
    getTopRatedDeals(merchantID: string): Promise<any[]>;
    getNewDeals(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getLowPriceDeals(price: number, offset?: number, limit?: number): Promise<{
        price: any;
        totalCount: any;
        data: any[];
    }>;
    getDiscountedDeals(percentage: number, offset?: number, limit?: number): Promise<{
        percentage: any;
        totalCount: any;
        data: any[];
    }>;
    getSpecialOfferDeals(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getHotDeals(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNewFavouriteDeal(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNearByDeals(lat: number, lng: number, distance: number, offset?: number, limit?: number): Promise<any[]>;
    searchDeals(header?: string, offset?: number, limit?: number): Promise<{
        totalDeals: number;
        data: any[];
    }>;
    getSimilarDeals(categoryName: string, subCategoryName: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        deals: any[];
    }>;
    getDealByID(dealID: string): Promise<any>;
    updateDealByID(updateDealDto: UpdateDealForCRMDTO): Promise<{
        message: string;
    }>;
}
