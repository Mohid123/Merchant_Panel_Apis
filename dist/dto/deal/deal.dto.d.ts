import { VoucherInterface } from '../../interface/deal/deal.interface';
export declare class DealDto {
    dealID: number;
    merchantID: string;
    title: string;
    subTitle: string;
    description: string;
    categoryID: string;
    categoryName: string;
    subCategoryID: string;
    subCategory: string;
    mediaUrl: [string];
    startDate: Date;
    endDate: Date;
    vouchers: VoucherInterface[];
    termsAndCondition: string;
    soldVouchers: number;
    availableVouchers: number;
    dealStatus: string;
    deletedCheck: boolean;
}
