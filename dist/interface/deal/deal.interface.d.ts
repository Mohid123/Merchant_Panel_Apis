import { Document } from 'mongoose';
export interface VoucherInterface {
    id: string;
    subTitle: string;
    originalPrice: number;
    dealPrice: number;
    discountPercentage: number;
    details: string;
    soldVouchers: number;
    numberOfVouchers: number;
    voucherValidity: number;
    voucherStartDate: Date;
    voucherEndDate: Date;
}
export interface DealInterface extends Document {
    id: string;
    dealID: number;
    title: string;
    subTitle: string;
    description: string;
    categoryType: string;
    categoryName: string;
    mediaUrl: [string];
    startDate: Date;
    endDate: Date;
    vouchers: VoucherInterface[];
    numberOfVouchers: number;
    soldVouchers: number;
    termsAndCondition: string;
    merchantId: string;
    dealStatus: string;
    deletedCheck: boolean;
}
