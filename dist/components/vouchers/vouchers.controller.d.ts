import { MultipleVouchersDto } from 'src/dto/vouchers/multiplevouchers.dto';
import { VoucherDto } from '../../dto/vouchers/vouchers.dto';
import { BILLINGSTATUS } from '../../enum/billing/billingStatus.enum';
import { SORT } from '../../enum/sort/sort.enum';
import { VOUCHERSTATUSENUM } from '../../enum/voucher/voucherstatus.enum';
import { VouchersService } from './vouchers.service';
export declare class VouchersController {
    private readonly voucherService;
    constructor(voucherService: VouchersService);
    createVoucher(voucherDto: VoucherDto): Promise<import("../../interface/vouchers/vouchers.interface").VoucherInterface & {
        _id: string;
    }>;
    getAllVouchers(merchantID: string, deal: SORT, voucher: SORT, amount: SORT, fee: SORT, net: SORT, status: VOUCHERSTATUSENUM, paymentStatus: BILLINGSTATUS, dateFrom: number, dateTo: number, voucherID: string, dealHeader: string, voucherHeader: string, voucherStatus: string, invoiceStatus: string, offset: number, limit: number, multipleVouchersDto: MultipleVouchersDto): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    searchByVoucherId(merchantID: string, voucherId?: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
