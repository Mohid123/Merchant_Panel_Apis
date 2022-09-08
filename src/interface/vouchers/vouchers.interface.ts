import { Document } from 'mongoose';

export interface VoucherInterface extends Document {
  _id: string;
  voucherID: string;
  voucherHeader: string;
  dealHeader: string;
  dealID: string;
  dealMongoID: string;
  // subDealHeader: string;
  subDealID: string;
  subDealMongoID: string;
  merchantID: string;
  // affiliateName: string;
  affiliateID: string;
  affiliateMongoID: string;
  // affiliatePercentage: number;
  // affiliateFee: number;
  // affiliatePaymentStatus: string;
  merchantMongoID: string;
  customerID: string;
  customerMongoID: string;
  amount: number;
  // platformPercentage: number;
  fee: number;
  net: number;
  status: string;
  paymentStatus: string;
  boughtDate: number;
  redeemDate: number;
  expiryDate: number;
  imageURL: object;
  dealPrice: number;
  originalPrice: number;
  discountedPercentage: number;
  deletedCheck: boolean;
  redeemQR: string;
}
