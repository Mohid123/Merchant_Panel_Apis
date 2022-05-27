import { MedialUrl, VoucherInterface } from '../../interface/deal/deal.interface';
export declare class DealDto {
    dealID: number;
    merchantID: string;
    dealHeader: string;
    dealSubHeader: string;
    highlights: string;
    categoryID: string;
    categoryName: string;
    subCategoryID: string;
    subCategory: string;
    mediaUrl: MedialUrl[];
    startDate: Date;
    endDate: Date;
    vouchers: VoucherInterface[];
    aboutThisDeal: string;
    soldVouchers: number;
    availableVouchers: number;
    dealStatus: string;
    deletedCheck: boolean;
}
