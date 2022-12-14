import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';
import { SORT } from '../../enum/sort/sort.enum';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { UpdateDealDto } from '../../dto/deal/updatedeal.dto';
import { MultipleDealsDto } from 'src/dto/deal/multipledeals.dto';
import { MultipleReviewsDto } from 'src/dto/review/multiplereviews.dto';
import { UpdateDealForCRMDTO } from 'src/dto/deal/updateDealForCrm.dto';
import { BuyNowDTO } from 'src/dto/deal/buy-now.dto';
import { FilterCategoriesApiDto } from 'src/dto/deal/filtercategoriesapi.dto';
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
    getDeal(id: string, req: any): Promise<any>;
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
        filteredCount: number;
        data: any[];
    }>;
    getDealsByMerchantIDForCustomerPanel(merchantID: string, lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
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
    getDealReviews(dealID: string, createdAt: SORT, totalRating: SORT, rating: number, offset?: number, limit?: number): Promise<{
        totalReviewsCount: number;
        deal: any;
    }>;
    getTopRatedDeals(merchantID: string): Promise<any[]>;
    getAllDynamicAPIs(apiName: string, price: number, percentage: number, lat: number, lng: number, distance: number, categoryName: string, subCategoryName: string, fromPrice: number, toPrice: number, reviewRating: number, sorting: SORT, offset: number, limit: number, filterCategoriesApiDto: FilterCategoriesApiDto, req: any): Promise<any>;
    getNewDeals(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getLowPriceDeals(price: number, lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        filterValue: any;
        totalCount: any;
        data: any[];
    }>;
    getDiscountedDeals(percentage: number, lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        filterValue: any;
        totalCount: any;
        data: any[];
    }>;
    getSpecialOfferDeals(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getHotDeals(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNewFavouriteDeal(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNearByDeals(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<any[]>;
    searchDeals(lat: number, lng: number, distance: number, searchBar: string, header: string, categoryName: string, subCategoryName: string, fromPrice: number, toPrice: number, reviewRating: number, offset: number, limit: number, filterCategoriesApiDto: FilterCategoriesApiDto, req: any): Promise<any>;
    getDealsByCategories(lat: number, lng: number, distance: number, categoryName: string, subCategoryName: string, fromPrice: number, toPrice: number, reviewRating: number, sorting: SORT, offset: number, limit: number, filterCategoriesApiDto: FilterCategoriesApiDto, req: any): Promise<any>;
    getWishListDeals(offset: number, limit: number, req: any): Promise<{
        totalCount: any;
        data: any[];
    }>;
    getTrendingDeals(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalDeals: number;
        data: any[];
    }>;
    getSimilarDeals(categoryName: string, subCategoryName: string, lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        deals: any[];
    }>;
    getRecentlyViewedDeals(offset: number, limit: number, req: any): Promise<{
        data: any[];
    }>;
    getRecommendedForYouDeals(lat: number, lng: number, distance: number, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDealByID(dealID: string): Promise<any>;
    updateDealByID(updateDealDto: UpdateDealForCRMDTO): Promise<{
        message: string;
    }>;
    buyNow(buyNowDto: BuyNowDTO, req: any): Promise<{
        message: string;
    }>;
    getPublishedDealsForMerchant(offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        deals: any[];
    }>;
}
