import { ApiProperty } from '@nestjs/swagger';
import { Gallery } from 'src/interface/user/users.interface';

export class UpdateMerchantProfileDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

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
  legalName: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  vatNumber: string;

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
  aboutUs: string;

  @ApiProperty()
  finePrint: string;
}
