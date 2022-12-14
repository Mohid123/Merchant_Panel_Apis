import { MultipleVouchersDto } from 'src/dto/vouchers/multiplevouchers.dto';
import { MultipleVouchersAffiliateDto } from 'src/dto/vouchers/multiplevouchersaffiliate.dto';
import { RedeemVoucherDto } from 'src/dto/vouchers/redeemVoucher.dto';
import { UpdateVoucherForCRMDto } from 'src/dto/vouchers/updatevoucherforcrom.dto';
import { VoucherDto } from '../../dto/vouchers/vouchers.dto';
import { BILLINGSTATUS } from '../../enum/billing/billingStatus.enum';
import { SORT } from '../../enum/sort/sort.enum';
import { VOUCHERSTATUSENUM } from '../../enum/voucher/voucherstatus.enum';
import { VouchersService } from './vouchers.service';
export declare class VouchersController {
    private readonly voucherService;
    constructor(voucherService: VouchersService);
    createVoucher(voucherDto: VoucherDto): Promise<void>;
    getVoucherByID(voucherID: string): Promise<any>;
    updateVoucherByID(voucherID: string, updateVoucherForCRMDto: UpdateVoucherForCRMDto): Promise<{
        message: string;
    }>;
    getAllVouchers(merchantID: string, deal: SORT, voucher: SORT, amount: SORT, fee: SORT, net: SORT, status: VOUCHERSTATUSENUM, paymentStatus: BILLINGSTATUS, dateFrom: number, dateTo: number, voucherID: string, dealHeader: string, voucherHeader: string, voucherStatus: string, invoiceStatus: string, offset: number, limit: number, multipleVouchersDto: MultipleVouchersDto): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getVouchersByAffiliateID(affiliateMongoID: string, voucherID: string, offset: number, limit: number, multipleVouchersAffiliateDto: MultipleVouchersAffiliateDto): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getVouchersByCustomerID(customerID: string, searchVoucher: string, voucherStatus: VOUCHERSTATUSENUM, offset?: number, limit?: number): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    searchByVoucherId(merchantID: string, voucherId?: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    redeemVoucher(voucherId: string, req: any): Promise<{
        status: string;
        message: any;
        voucher: import("../../interface/vouchers/vouchers.interface").VoucherInterface & {
            _id: string;
        };
    }>;
    getVoucherByMongoId(voucherId: string): Promise<any>;
    redeemVoucherByMerchantPin(redeemVoucherDto: RedeemVoucherDto): Promise<{
        status: string;
        message: any;
        voucher: import("../../interface/vouchers/vouchers.interface").VoucherInterface & {
            _id: string;
        };
    }>;
    getVoucherSoldPerDay(days: number, req: any): Promise<{
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
    getVoucherSoldPerDayForAffiliates(days: number, req: any): Promise<{
        maxCount: number;
        counts: any[];
    }>;
    getCustomerRanking(affiliateMongoID: string, byMonthYearQuarter: string, dateFrom: number, dateTo: number, totalVouchers: SORT, totalEarnings: SORT, offset?: number, limit?: number): Promise<{
        totalCount: any;
        data: any[];
    }>;
    getCustomerRankingCSV(affiliateMongoID: string, byMonthYearQuarter: string, dateFrom: number, dateTo: number, totalVouchers: SORT, totalEarnings: SORT): Promise<{
        url: string;
    }>;
}
