/// <reference types="mongoose" />
import { VoucherDto } from 'src/dto/vouchers/vouchers.dto';
import { BILLINGSTATUS } from 'src/enum/billing/billingStatus.enum';
import { SORT } from 'src/enum/sort/sort.enum';
import { VOUCHERSTATUSENUM } from 'src/enum/voucher/voucherstatus.enum';
import { VouchersService } from './vouchers.service';
export declare class VouchersController {
    private readonly voucherService;
    constructor(voucherService: VouchersService);
    createVoucher(voucherDto: VoucherDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/deal/deal.interface").VoucherInterface> & import("../../interface/deal/deal.interface").VoucherInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllVouchers(merchantID: string, deal: SORT, amount: SORT, fee: SORT, net: SORT, status: VOUCHERSTATUSENUM, paymentStatus: BILLINGSTATUS, dateFrom: number, dateTo: number, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    searchByVoucherId(voucherId: number): Promise<import("mongoose").Document<unknown, any, import("../../interface/deal/deal.interface").VoucherInterface> & import("../../interface/deal/deal.interface").VoucherInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
