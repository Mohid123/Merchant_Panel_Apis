import { Model } from 'mongoose';
import { VoucherInterface } from '../../interface/deal/deal.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
export declare class VouchersService {
    private readonly voucherModel;
    private readonly voucherCounterModel;
    constructor(voucherModel: Model<VoucherInterface>, voucherCounterModel: Model<VoucherCounterInterface>);
    generateVoucherId(sequenceName: any): Promise<0>;
    createVoucher(voucherDto: any): Promise<import("mongoose").Document<unknown, any, VoucherInterface> & VoucherInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    searchByVoucherId(voucherId: any): Promise<(import("mongoose").Document<unknown, any, VoucherInterface> & VoucherInterface & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getAllVouchersByMerchantID(deal: any, amount: any, fee: any, net: any, status: any, paymentStatus: any, dateFrom: any, dateTo: any, merchantId: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
