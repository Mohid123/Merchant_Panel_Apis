import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Schedule } from 'src/interface/schedule/schedule.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { VoucherInterface } from 'src/interface/vouchers/vouchers.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
import { ScheduleService } from '../schedule/schedule.service';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { ActivityService } from '../activity/activity.service';
export declare class VouchersService implements OnModuleInit {
    private readonly voucherModel;
    private readonly voucherCounterModel;
    private readonly userModel;
    private _scheduleModel;
    private _scheduleService;
    private _activityService;
    private readonly dealModel;
    constructor(voucherModel: Model<VoucherInterface>, voucherCounterModel: Model<VoucherCounterInterface>, userModel: Model<UsersInterface>, _scheduleModel: Model<Schedule>, _scheduleService: ScheduleService, _activityService: ActivityService, dealModel: Model<DealInterface>);
    onModuleInit(): void;
    generateVoucherId(sequenceName: any): Promise<string>;
    createVoucher(voucherDto: any): Promise<void>;
    updateVoucherByID(voucherID: any, updateVoucherForCRMDto: any): Promise<{
        message: string;
    }>;
    getVoucherByID(voucherID: any): Promise<any>;
    generateQRCode(qrUrl: any): Promise<string>;
    searchByVoucherId(merchantID: any, voucherId: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllVouchersByMerchantID(deal: any, voucher: any, amount: any, fee: any, net: any, status: any, paymentStatus: any, dateFrom: any, dateTo: any, merchantId: any, voucherID: any, dealHeader: any, voucherHeader: any, voucherStatus: any, invoiceStatus: any, offset: any, limit: any, multipleVouchersDto: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getVouchersByAffiliateID(affiliateMongoID: any, voucherID: any, multipleVouchersAffiliateDto: any, offset: any, limit: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getVouchersByCustomerID(customerID: any, searchVoucher: any, voucherStatus: any, offset: any, limit: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    redeemVoucher(voucherId: any, req: any): Promise<{
        status: string;
        message: any;
        voucher: VoucherInterface & {
            _id: string;
        };
    }>;
    getVoucherByMongoId(id: any): Promise<any>;
    redeemVoucherByMerchantPin(redeemVoucherDto: any): Promise<{
        status: string;
        message: any;
        voucher: VoucherInterface & {
            _id: string;
        };
    }>;
    getVoucherSoldPerDay(numberOfDays: any, req: any): Promise<{
        maxCount: number;
        counts: any[];
    }>;
    getNetRevenue(req: any): Promise<{
        totalDeals: number;
        totalVouchersSold: number;
        overallRating: number;
        netRevenue: number;
        from: string;
        to: string;
        yearlyRevenue: number;
        maxRevenueForMonth: number;
        vouchers: any[];
    }>;
    getVoucherSoldPerDayForAffiliates(numberOfDays: any, req: any): Promise<{
        maxCount: number;
        counts: any[];
    }>;
    getCustomerRanking(affiliateMongoID: any, byMonthYearQuarter: any, dateFrom: any, dateTo: any, totalVouchers: any, totalEarnings: any, offset: any, limit: any): Promise<{
        totalCount: any;
        data: any[];
    }>;
    getCustomerRankingCSV(affiliateMongoID: any, byMonthYearQuarter: any, dateFrom: any, dateTo: any, totalVouchers: any, totalEarnings: any): Promise<{
        url: string;
    }>;
}
