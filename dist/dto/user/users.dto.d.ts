import { businessHour } from "../../interface/user/users.interface";
export declare class UsersDto {
    id: string;
    userID: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    businessType: string[];
    legalName: string;
    streetAddress: string;
    zipCode: number;
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
}
