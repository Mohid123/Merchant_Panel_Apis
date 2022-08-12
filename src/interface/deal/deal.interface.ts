import { Document } from 'mongoose';

export interface SubDealInterface {
  id: string;
  subDealID: string;
  title: string;
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
  type: string,
  captureFileURL: string,
  path: string,
  thumbnailURL: string,
  thumbnailPath: string,
  blurHash: string,
  backgroundColorHex: string,
}

export interface DealInterface extends Document {
  id: string;
  dealID: string;
  merchantMongoID: string;
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
  subDeals: SubDealInterface[];
  availableVouchers: number;
  soldVouchers: number;
  minDealPrice: number;
  minOriginalPrice: number;
  minDiscountPercentage: number;
  aboutThisDeal: string;
  readMore: string;
  finePrints: string;
  dealStatus: string;
  netEarnings: number;
  deletedCheck: boolean;
  reviewMediaUrl: MedialUrl[];
  pageNumber: number;
  isCollapsed: boolean;
  isDuplicate: boolean;
  isSpecialOffer: boolean;
  dealPreviewURL: string;
  editDealURL: string;
}
