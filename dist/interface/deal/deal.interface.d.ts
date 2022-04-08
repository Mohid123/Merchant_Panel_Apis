import { Document } from 'mongoose';
export interface DealInterface extends Document {
    id: string;
    title: string;
    subTitle: string;
    description: string;
    categoryType: string;
    categoryName: string;
    mediaUrl: [string];
    startDate: Date;
    endDate: Date;
    vouchers: [object];
    termsAndCondition: string;
    merchantId: string;
}
