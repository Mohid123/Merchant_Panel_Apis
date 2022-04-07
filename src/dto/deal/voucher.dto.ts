import { ApiProperty } from '@nestjs/swagger';

export class VoucherDto {
  @ApiProperty()
  dealId: string;

  @ApiProperty()
  subTitle: string;

  @ApiProperty()
  originalPrice: number;

  @ApiProperty()
  dealPrice: number;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  details: string;

  @ApiProperty()
  numberOfVouchers: number;

  @ApiProperty()
  voucherValidity: number;

  @ApiProperty()
  voucherStartDate: Date;

  @ApiProperty()
  voucherEndDate: Date;
}
