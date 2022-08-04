/* eslint-disable prettier/prettier */
export interface businessHour {
  day: string;
  firstStartTime: string;
  firstEndTime: string;
  secondStartTime: string;
  secondEndTime: string;
}

export interface Gallery {
  pictureUrl: string;
  pictureBlurHash: string;
}

export interface LeadInterface {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  businessType: string[];
  legalName: string;
  tradeName: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  vatNumber: string;
  iban: string;
  bankName: string;
  kycStatus: boolean;
  province: string;
  website_socialAppLink: string;
  googleMapPin: string;
  businessHours: businessHour[];
  finePrint: string;
  aboutUs: string;
  profilePicURL: string;
  profilePicBlurHash: string;
  gallery: [string];
  voucherPinCode: number;
  deletedCheck: boolean;
  status: string;
  newUser: boolean;
  totalVoucherSales: number;
  redeemedVouchers: number;
  purchasedVouchers: number;
  expiredVouchers: number;
  totalEarnings: number;
  paidEarnings: number;
  pendingEarnings: number;
  totalDeals: number;
  scheduledDeals: number;
  pendingDeals: number;
  soldDeals: number;
  countryCode: string;
  leadSource: string;
  ratingsAverage: number;
  totalReviews: number;
  maxRating: number;
  minRating: number;
}
