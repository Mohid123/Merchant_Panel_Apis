import { ApiProperty } from '@nestjs/swagger';
import { VoucherInterface } from '../../interface/deal/deal.interface';

export class DealDto {
  @ApiProperty()
  dealID: number;

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
        soldVouchers: 0,
        numberOfVouchers: 0,
        voucherValidity: 0,
        voucherStartDate: Date(),
        voucherEndDate: Date(),
      },
    ],
  })
  vouchers: VoucherInterface[];

  @ApiProperty()
  termsAndCondition: number;

  @ApiProperty()
  soldVouchers: number;

  @ApiProperty()
  numberOfVouchers: string;

  @ApiProperty()
  merchantId: string;

  @ApiProperty()
  dealStatus: string;

  @ApiProperty()
  deletedCheck: boolean;
}
