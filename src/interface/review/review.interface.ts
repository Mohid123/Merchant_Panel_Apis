import { Document } from 'mongoose';

export interface multipleRatings {
  ratingName: string;
  ratingScore: number;
}

export interface ReviewInterface extends Document {
  _id: string;
  dealMongoID: string;
  dealId: string;
  dealHeader: string;
  subDealHeader: string;
  voucherMongoID: string;
  voucherID: string;
  customerID: string;
  merchantID: string;
  text: string;
  totalRating: number;
  multipleRating: multipleRatings[];
  customerEmail: string;
  customerName: string;
  profilePicURL: string;
  voucherRedeemedDate: number;
  isViewed: boolean;
}
