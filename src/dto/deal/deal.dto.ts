import { ApiProperty } from '@nestjs/swagger';
import { VoucherInterface } from '../../interface/deal/deal.interface';

export class DealDto {
  @ApiProperty()
  dealID: number;

  @ApiProperty()
  merchantID: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  subTitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  categoryID: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  subCategoryID: string;

  @ApiProperty()
  subCategory: string;

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
        voucherStartDate: new Date(),
        voucherEndDate: new Date(),
      },
    ],
  })
  vouchers: VoucherInterface[];

  @ApiProperty()
  termsAndCondition: string;

  @ApiProperty()
  soldVouchers: number;

  @ApiProperty()
  numberOfVouchers: number;

  @ApiProperty()
  dealStatus: string;

  @ApiProperty()
  deletedCheck: boolean;
}
