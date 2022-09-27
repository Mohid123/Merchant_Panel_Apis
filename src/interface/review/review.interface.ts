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
  dealID: string;
  dealHeader: string;
  subDealHeader: string;
  voucherMongoID: string;
  voucherID: string;
  customerMongoID: string;
  customerID: string;
  merchantMongoID: string;
  merchantID: string;
  text: string;
  mediaUrl: MedialUrl[];
  totalRating: number;
  multipleRating: multipleRatings[];
  // customerEmail: string;
  // customerName: string;
  // customerProfilePicURL: string;
  voucherRedeemedDate: number;
  isViewed: boolean;
}
