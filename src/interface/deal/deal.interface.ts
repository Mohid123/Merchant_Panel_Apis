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
  numberOfVouchers: number;
  soldVouchers: number;
  termsAndCondition: string;
  dealStatus: string;
  deletedCheck: boolean;
}
