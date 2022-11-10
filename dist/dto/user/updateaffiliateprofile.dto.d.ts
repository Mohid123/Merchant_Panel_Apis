import { Gallery } from "src/interface/user/users.interface";
export declare class UpdateAffiliateProfileDto {
    firstName: string;
    lastName: string;
    businessType: string[];
    phoneNumber: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    tradeName: string;
    profilePicURL: string;
    website_socialAppLink: string;
    gallery: Gallery[];
    karibuURL: string;
    aboutUs: string;
}
