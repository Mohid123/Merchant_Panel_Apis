import { VoucherInterface } from 'src/interface/deal/deal.interface';
export declare class DealDto {
    title: string;
    subTitle: string;
    description: string;
    categoryType: string;
    mediaUrl: [string];
    startDate: Date;
    endDate: Date;
    vouchers: VoucherInterface[];
    termsAndCondition: string;
    merchantId: string;
    dealStatus: string;
    deletedCheck: boolean;
}
