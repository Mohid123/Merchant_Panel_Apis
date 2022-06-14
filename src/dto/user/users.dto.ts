/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { businessHour } from "src/interface/user/users.interface";

export class UsersDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    businessType: string[];

    @ApiProperty()
    companyName: string;
    
    @ApiProperty()
    streetAddress: string;

    @ApiProperty()
    zipCode: number;
    
    @ApiProperty()
    city: string;

    @ApiProperty()
    vatNumber: number;

    @ApiProperty()
    province: string;

    @ApiProperty()
    website_socialAppLink: string;

    @ApiProperty()
    googleMapPin: string;

    @ApiProperty({
        example: [
            {
                day: 'string',
                firstStartTime: 'string',
                firstEndTime: 'string',
                secondStartTime: 'string',
                secondEndTime: 'string'
            }
        ]
    })
    businessHours: businessHour[];

    @ApiProperty()
    aboutStore: string;

    @ApiProperty()
    generalTermsAgreements: string;

    @ApiProperty()
    profilePicURL: string;

    @ApiProperty()
    profilePicBlurHash: string;

    @ApiProperty()
    deletedCheck: boolean;

    @ApiProperty()
    status: string;

    // @ApiProperty()
    // totalVoucherSales: number;

    // @ApiProperty()
    // redeemedVouchers: number;

    // @ApiProperty()
    // purchasedVouchers: number;

    // @ApiProperty()
    // totalEarnings: number;

    // @ApiProperty()
    // paidEarnings: number;

    // @ApiProperty()
    // pendingEarnings: number;

    // @ApiProperty()
    // totalDeals: number;

    // @ApiProperty()
    // scheduledDeals: number;

    // @ApiProperty()
    // pendingDeals: number;

    // @ApiProperty()
    // soldDeals: number;
}
