import { Model } from 'mongoose';
import { VoucherInterface } from 'src/interface/vouchers/vouchers.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
export declare class VouchersService {
    private readonly voucherModel;
    private readonly voucherCounterModel;
    constructor(voucherModel: Model<VoucherInterface>, voucherCounterModel: Model<VoucherCounterInterface>);
    generateVoucherId(sequenceName: any): Promise<string>;
    createVoucher(voucherDto: any): Promise<VoucherInterface & {
        _id: string;
    }>;
    searchByVoucherId(voucherId: any): Promise<(VoucherInterface & {
        _id: string;
    })[]>;
    getAllVouchersByMerchantID(deal: any, voucher: any, amount: any, fee: any, net: any, status: any, paymentStatus: any, dateFrom: any, dateTo: any, merchantId: any, voucherID: any, dealHeader: any, voucherHeader: any, voucherStatus: any, invoiceStatus: any, offset: any, limit: any, multipleVouchersDto: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
}
