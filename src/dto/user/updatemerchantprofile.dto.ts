import { ApiProperty } from "@nestjs/swagger";
import { Gallery } from "src/interface/user/users.interface";

export class UpdateMerchantProfileDto {
    // @ApiProperty()
    // id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    legalName: string;
    
    @ApiProperty()
    streetAddress: string;

    @ApiProperty()
    zipCode: number;
    
    @ApiProperty()
    city: string;

    @ApiProperty()
    vatNumber: number;

    @ApiProperty()
    tradeName: string;

    @ApiProperty()
    googleMapPin: string;

    @ApiProperty()
    profilePicURL: string;

    @ApiProperty()
    profilePicBlurHash: string;

    @ApiProperty()
    website_socialAppLink: string;

    @ApiProperty({
        example: [
            {
                pictureUrl: '',
                pictureBlurHash: ''
            }
        ]
    })
    gallery: Gallery[];

    @ApiProperty()
    aboutUs: string;

    @ApiProperty()
    finePrint: string;
}