export interface businessHour {
    day: string;
    firstStartTime: string;
    firstEndTime: string;
    secondStartTime: string;
    secondEndTime: string;
}
export interface UsersInterface {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    businessType: string;
    companyName: string;
    streetAddress: string;
    zipCode: number;
    city: string;
    vatNumber: number;
    iban: string;
    bankName: string;
    kycStatus: boolean;
    province: string;
    website_socialAppLink: string;
    googleMapPin: string;
    businessHours: businessHour[];
    aboutStore: string;
    generalTermsAgreements: string;
    profilePicURL: string;
    profilePicBlurHash: string;
    deletedCheck: boolean;
    status: string;
    totalVoucherSales: number;
    redeemedVouchers: number;
    purchasedVouchers: number;
    totalEarnings: number;
    paidEarnings: number;
    pendingEarnings: number;
    totalDeals: number;
    scheduledDeals: number;
    pendingDeals: number;
    soldDeals: number;
}
