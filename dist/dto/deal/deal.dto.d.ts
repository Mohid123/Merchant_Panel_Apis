import { VoucherInterface } from '../../interface/deal/deal.interface';
export declare class DealDto {
    dealID: number;
    title: string;
    subTitle: string;
    description: string;
    categoryType: string;
    mediaUrl: [string];
    startDate: Date;
    endDate: Date;
    vouchers: VoucherInterface[];
    termsAndCondition: number;
    soldVouchers: number;
    numberOfVouchers: string;
    merchantId: string;
    dealStatus: string;
    deletedCheck: boolean;
}
