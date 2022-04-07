import { ApiProperty } from '@nestjs/swagger';

export class DealDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  subTitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  categoryType: string;

  @ApiProperty()
  mediaUrl: [string];

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    example: [
      {
        subTitle: '',
        originalPrice: 0,
        dealPrice: 0,
        discountPercentage: 0,
        details: '',
        numberOfVouchers: 0,
        voucherValidity: 0,
        voucherStartDate: Date(),
        voucherEndDate: Date(),
      },
    ],
  })
  vouchers: [object];

  @ApiProperty()
  termsAndCondition: string;

  @ApiProperty()
  merchantId: string;
}
