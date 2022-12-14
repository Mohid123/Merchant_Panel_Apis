import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { ScheduleService } from '../schedule/schedule.service';
import { Schedule } from 'src/interface/schedule/schedule.interface';
import { StripeService } from '../stripe/stripe.service';
import { VouchersService } from '../vouchers/vouchers.service';
import { EmailDTO } from 'src/dto/email/email.dto';
import { ViewsService } from '../views/views.service';
import { ViewsInterface } from 'src/interface/views/views.interface';
import { PreComputedDealInteface } from 'src/interface/deal/preComputedDeal.interface';
import { Cache } from 'cache-manager';
import { ReviewInterface } from 'src/interface/review/review.interface';
import { DealCategoryAnalyticsInterface } from 'src/interface/deal/dealcategoryanalytics.interface';
import { CampaignInterface } from 'src/interface/campaign/campaign.interfce';
export declare class DealService implements OnModuleInit {
    private readonly dealModel;
    private readonly preComputedDealModel;
    private cacheManager;
    private readonly categorymodel;
    private readonly voucherCounterModel;
    private readonly subCategoryModel;
    private readonly _userModel;
    private _scheduleModel;
    private _viewsModel;
    private readonly reviewModel;
    private readonly categoryAnalyticsModel;
    private readonly campaignModel;
    private _scheduleService;
    private _stripeService;
    private _voucherService;
    private viewsService;
    constructor(dealModel: Model<DealInterface>, preComputedDealModel: Model<PreComputedDealInteface>, cacheManager: Cache, categorymodel: Model<CategoryInterface>, voucherCounterModel: Model<VoucherCounterInterface>, subCategoryModel: Model<SubCategoryInterface>, _userModel: Model<UsersInterface>, _scheduleModel: Model<Schedule>, _viewsModel: Model<ViewsInterface>, reviewModel: Model<ReviewInterface>, categoryAnalyticsModel: Model<DealCategoryAnalyticsInterface>, campaignModel: Model<CampaignInterface>, _scheduleService: ScheduleService, _stripeService: StripeService, _voucherService: VouchersService, viewsService: ViewsService);
    onModuleInit(): void;
    generateVoucherId(sequenceName: any): Promise<string>;
    createDeal(dealDto: any, req: any): Promise<DealInterface & {
        _id: any;
    }>;
    getDealByID(dealID: any): Promise<any>;
    updateDealByID(updateDealDto: any): Promise<{
        message: string;
    }>;
    updateDeal(updateDealDto: any, dealID: any): Promise<{
        message: string;
    }>;
    approveRejectDeal(dealID: any, dealStatusDto: any): Promise<import("mongodb").UpdateResult>;
    getAllDeals(req: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDeal(id: any, req: any): Promise<any>;
    getDealForMerchantPanel(dealMongoID: any): Promise<any>;
    getDealReviews(offset: any, limit: any, rating: any, id: any, createdAt: any, totalRating: any): Promise<{
        totalReviewsCount: number;
        deal: any;
    }>;
    deleteDeal(dealID: any): Promise<{
        status: string;
        message: string;
    }>;
    getDealsReviewStatsByMerchant(id: any, dealID: any, offset: any, limit: any, multipleReviewsDto: any): Promise<{
        totalDeals: number;
        filteredDealCount: number;
        overallRating: number;
        totalMerchantReviews: any;
        data: any[];
    }>;
    getDealsByMerchantID(merchantID: any, dealHeader: any, price: any, startDate: any, endDate: any, availableVoucher: any, soldVoucher: any, status: any, dateFrom: any, dateTo: any, dealID: any, header: any, dealStatus: any, offset: any, limit: any, multipleDealsDto: any): Promise<{
        totalDeals: number;
        filteredCount: number;
        data: any[];
    }>;
    getDealsByMerchantIDForCustomerPanel(merchantID: any, lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getTopRatedDeals(merchantID: any): Promise<any[]>;
    getLowPriceDeals(price: any, lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        filterValue: any;
        totalCount: any;
        data: any[];
    }>;
    getLowPriceDealsDynamically(lat: any, lng: any, distance: any, price: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getNewDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNewDealsDynamically(lat: any, lng: any, distance: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getDiscountedDeals(percentage: any, lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        filterValue: any;
        totalCount: any;
        data: any[];
    }>;
    getDiscountedDealsDynamically(lat: any, lng: any, distance: any, percentage: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getHotDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getHotDealsDynamically(lat: any, lng: any, distance: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getSpecialOfferDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getSpecialOfferDealsDynamically(lat: any, lng: any, distance: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getNewFavouriteDeal(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNewFavouriteDealDynamically(lat: any, lng: any, distance: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getNearByDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<any[]>;
    getNearByDealsDynamically(lat: any, lng: any, distance: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    searchDeals(lat: any, lng: any, distance: any, searchBar: any, header: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getDealsByCategories(lat: any, lng: any, distance: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, sorting: any, offset: any, limit: any, filterCategoriesApiDto: any, req: any): Promise<any>;
    getWishListDeals(offset: any, limit: any, req: any): Promise<{
        totalCount: any;
        data: any[];
    }>;
    getRecommendedForYouDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getTrendingDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalDeals: number;
        data: any[];
    }>;
    getSimilarDeals(categoryName: any, subCategoryName: any, lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        deals: any[];
    }>;
    getRecentlyViewedDeals(offset: any, limit: any, req: any): Promise<{
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
    changeMediaURL(): Promise<void>;
    buyNow(buyNowDto: any, req: any): Promise<{
        message: string;
    }>;
    sendMail(emailDto: EmailDTO): Promise<void>;
    getPublishedDealsForMerchant(req: any, offset: any, limit: any): Promise<{
        totalCount: number;
        deals: any[];
    }>;
}
