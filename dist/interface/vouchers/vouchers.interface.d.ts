import { Document } from 'mongoose';
export interface VoucherInterface extends Document {
    id: string;
    voucherID: number;
    dealName: string;
    dealId: string;
    merchantID: string;
    amount: number;
    fee: number;
    net: number;
    status: string;
    paymentStatus: string;
    boughtDate: number;
    deletedCheck: boolean;
}
