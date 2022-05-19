import { businessHour } from "../../interface/user/users.interface";
export declare class SignUpDTO {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    status: string;
    businessType: string;
    companyName: string;
    streetAddress: string;
    zipCode: number;
    city: string;
    province: string;
    website_socialAppLink: string;
    newUser: boolean;
    businessHours: businessHour[];
}
