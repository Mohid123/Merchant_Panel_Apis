import { Document } from 'mongoose';
export interface VoucherInterface {
    id: string;
    subTitle: string;
    originalPrice: number;
    dealPrice: number;
    discountPercentage: number;
    soldVouchers: number;
    numberOfVouchers: number;
    grossEarning: number;
    netEarning: number;
    voucherValidity: number;
    voucherStartDate: Date;
    voucherEndDate: Date;
}
export interface MedialUrl {
    merdiaUrl: string;
    type: string;
}
export interface DealInterface extends Document {
    id: string;
    dealID: string;
    merchantID: string;
    dealHeader: string;
    subTitle: string;
    highlights: string;
    categoryID: string;
    categoryName: string;
    subCategoryID: string;
    subCategory: string;
    mediaUrl: MedialUrl[];
    startDate: Date;
    endDate: Date;
    vouchers: VoucherInterface[];
    availableVouchers: number;
    soldVouchers: number;
    aboutThisDeal: string;
    readMore: string;
    finePrints: string;
    dealStatus: string;
    netEarnings: number;
    deletedCheck: boolean;
    pageNumber: number;
    isCollapsed: boolean;
    isDuplicate: boolean;
    isSpecialOffer: boolean;
    dealPreviewURL: string;
}
