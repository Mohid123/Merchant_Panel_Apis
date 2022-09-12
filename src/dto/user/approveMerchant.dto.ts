/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApproveMerchantDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  categoryType: string[];

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  vatNumber: string;

  @ApiProperty()
  website_socialAppLink: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  leadSource: string;

  @ApiProperty()
  platformPercentage: number;
}
