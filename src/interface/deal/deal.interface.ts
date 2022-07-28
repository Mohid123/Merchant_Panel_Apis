import { Document } from 'mongoose';

export interface VoucherInterface {
  id: string;
  subTitle: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  // details: string;
  soldVouchers: number;
  numberOfVouchers: number;
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
  deletedCheck: boolean;
  pageNumber: number;
  isCollapsed: boolean;
  isDuplicate: boolean;
}
