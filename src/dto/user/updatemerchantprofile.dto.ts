import { ApiProperty } from '@nestjs/swagger';

export class UpdateMerchantProfileDto {
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

  @ApiProperty()
  gallery: [string];

  @ApiProperty()
  aboutUs: string;

  @ApiProperty()
  finePrint: string;
}
