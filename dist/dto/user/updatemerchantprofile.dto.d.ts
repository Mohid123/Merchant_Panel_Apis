import { Gallery } from "src/interface/user/users.interface";
export declare class UpdateMerchantProfileDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    legalName: string;
    streetAddress: string;
    zipCode: number;
    city: string;
    vatNumber: number;
    tradeName: string;
    googleMapPin: string;
    profilePicURL: string;
    profilePicBlurHash: string;
    website_socialAppLink: string;
    gallery: Gallery[];
    aboutUs: string;
    finePrint: string;
}
