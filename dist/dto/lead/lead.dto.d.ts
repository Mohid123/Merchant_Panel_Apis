import { businessHour } from 'src/interface/lead/lead.interface';
export declare class LeadDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    businessType: string[];
    legalName: string;
    companyName: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    vatNumber: string;
    province: string;
    website_socialAppLink: string;
    googleMapPin: string;
    businessHours: businessHour[];
    finePrint: string;
    aboutUs: string;
    profilePicURL: string;
    profilePicBlurHash: string;
    deletedCheck: boolean;
    status: string;
    countryCode: string;
    leadSource: string;
}
