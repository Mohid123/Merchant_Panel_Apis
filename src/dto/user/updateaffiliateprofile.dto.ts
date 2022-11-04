import { ApiProperty } from "@nestjs/swagger";
import { Gallery } from "src/interface/user/users.interface";

export class UpdateAffiliateProfileDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty({
      example: [
        {
          affiliateCategoryName: '',
          affiliateSubCategoryName: ''
        }
      ]
    })
    businessType: string[];

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    streetAddress: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    tradeName: string;

    @ApiProperty()
    profilePicURL: string;

    @ApiProperty()
    website_socialAppLink: string;

    @ApiProperty({
        example: [
          {
            type: '',
            captureFileURL: '',
            path: '',
            thumbnailURL: '',
            thumbnailPath: '',
            blurHash:'',
            backgroundColorHex:'',
          }
        ],
      })
      gallery: Gallery[];

    @ApiProperty()
    karibuURL: string;

    @ApiProperty()
    aboutUs: string;

}