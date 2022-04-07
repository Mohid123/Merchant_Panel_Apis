import { ApiProperty } from "@nestjs/swagger";

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
    businessType: string;

    @ApiProperty()
    companyName: string;
    
    @ApiProperty()
    streetAddress: string;

    @ApiProperty()
    zipCode: number;
    
    @ApiProperty()
    city: string;

    @ApiProperty()
    province: string;

    @ApiProperty()
    website_socialAppLink: string;

    @ApiProperty()
    googleMapPin: string;

    @ApiProperty()
    aboutStore: string;

    @ApiProperty()
    terms_agreements: string;

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
