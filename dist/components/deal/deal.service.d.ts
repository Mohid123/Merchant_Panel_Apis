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
export declare class DealService implements OnModuleInit {
    private readonly dealModel;
    private readonly categorymodel;
    private readonly voucherCounterModel;
    private readonly subCategoryModel;
    private readonly _userModel;
    private _scheduleModel;
    private _viewsModel;
    private _scheduleService;
    private _stripeService;
    private _voucherService;
    private viewsService;
    constructor(dealModel: Model<DealInterface>, categorymodel: Model<CategoryInterface>, voucherCounterModel: Model<VoucherCounterInterface>, subCategoryModel: Model<SubCategoryInterface>, _userModel: Model<UsersInterface>, _scheduleModel: Model<Schedule>, _viewsModel: Model<ViewsInterface>, _scheduleService: ScheduleService, _stripeService: StripeService, _voucherService: VouchersService, viewsService: ViewsService);
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
    getDealReviews(offset: any, limit: any, rating: any, id: any, createdAt: any, totalRating: any): Promise<any>;
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
        data: any[];
    }>;
    getDealsByMerchantIDForCustomerPanel(merchantID: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getTopRatedDeals(merchantID: any): Promise<any[]>;
    getLowPriceDeals(price: any, offset: any, limit: any, req: any): Promise<{
        filterValue: any;
        totalCount: any;
        data: any[];
    }>;
    getNewDeals(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getDiscountedDeals(percentage: any, offset: any, limit: any, req: any): Promise<{
        filterValue: any;
        totalCount: any;
        data: any[];
    }>;
    getHotDeals(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getSpecialOfferDeals(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNewFavouriteDeal(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getNearByDeals(lat: any, lng: any, distance: any, offset: any, limit: any, req: any): Promise<any>;
    searchDeals(header: any, categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, offset: any, limit: any, req: any): Promise<{
        totalDeals: number;
        filteredDeals: number;
        data: any[];
    }>;
    getDealsByCategories(categoryName: any, subCategoryName: any, fromPrice: any, toPrice: any, reviewRating: any, price: any, ratingSort: any, createdAt: any, offset: any, limit: any, req: any): Promise<{
        totalDeals: number;
        filteredDeals: number;
        data: any[];
    }>;
    getTrendingDeals(offset: any, limit: any, req: any): Promise<{
        totalDeals: number;
        data: any[];
    }>;
    getSimilarDeals(categoryName: any, subCategoryName: any, offset: any, limit: any, req: any): Promise<{
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
}
