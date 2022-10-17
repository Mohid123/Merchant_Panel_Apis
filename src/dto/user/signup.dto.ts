/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignUpDTO {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  // Personal Details

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  // Business Details

  @ApiProperty()
  vatNumber: string;

  @ApiProperty()
  businessType: string[];

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  website_socialAppLink: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  leadSource: string;
}
