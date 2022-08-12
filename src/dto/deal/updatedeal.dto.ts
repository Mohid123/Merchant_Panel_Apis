import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealDto {

  @ApiProperty({
    example:
      {
        voucherID: '',
        title: '',
        originalPrice: 0,
        dealPrice: 0,
        numberOfVouchers: 0,
      },
  })
  subDeals: any;
}
