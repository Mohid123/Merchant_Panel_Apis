/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { businessHour } from 'src/interface/lead/lead.interface';

export class LeadDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

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
  legalName: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  zipCode: number;

  @ApiProperty()
  city: string;

  @ApiProperty()
  vatNumber: string;

  // @ApiProperty()
  // iban: string;

  // @ApiProperty()
  // bankName: string;

  // @ApiProperty()
  // kycStatus: boolean;

  @ApiProperty()
  province: string;

  @ApiProperty()
  website_socialAppLink: string;

  @ApiProperty()
  googleMapPin: string;

  @ApiProperty({
    example: [
      {
        day: 'MN',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
      {
        day: 'TU',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
      {
        day: 'WD',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
      {
        day: 'TH',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
      {
        day: 'FR',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
      {
        day: 'SA',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
      {
        day: 'SU',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
      },
    ],
  })
  businessHours: businessHour[];

  @ApiProperty()
  finePrint: string;

  @ApiProperty()
  aboutUs: string;

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
