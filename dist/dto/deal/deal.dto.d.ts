import { MedialUrl, VoucherInterface } from '../../interface/deal/deal.interface';
export declare class DealDto {
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
    aboutThisDeal: string;
    soldVouchers: number;
    availableVouchers: number;
    dealStatus: string;
    deletedCheck: boolean;
    readMore: string;
    finePrints: string;
    pageNumber: string;
    isCollapsed: boolean;
}
