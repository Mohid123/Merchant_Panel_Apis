import { Document } from 'mongoose';

export interface multipleRatings {
  ratingName: string;
  ratingScore: number;
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

export interface ReviewInterface extends Document {
  _id: string;
  dealMongoID: string;
  dealId: string;
  dealHeader: string;
  subDealHeader: string;
  voucherMongoID: string;
  voucherID: string;
  customerID: string;
  merchantMongoID: string;
  merchantID: string;
  text: string;
  mediaUrl: MedialUrl[];
  totalRating: number;
  multipleRating: multipleRatings[];
  customerEmail: string;
  customerName: string;
  profilePicURL: string;
  voucherRedeemedDate: number;
  isViewed: boolean;
}
