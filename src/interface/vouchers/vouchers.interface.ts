import { Document } from 'mongoose';

export interface VoucherInterface extends Document {
  _id: string;
  voucherID: string;
  voucherHeader: string;
  dealHeader: string;
  dealID: string;
  merchantID: string;
  affiliateID: string;
  merchantMongoID: string;
  customerID: string;
  amount: number;
  fee: number;
  net: number;
  status: string;
  paymentStatus: string;
  boughtDate: number;
  expiryDate: number;
  imageURL: object;
  dealPrice: number;
  originalPrice: number;
  discountedPercentage: number;
  deletedCheck: boolean;
}
