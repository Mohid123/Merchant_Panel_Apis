import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealDto {
  @ApiProperty()
  endDate: Date;
  @ApiProperty({
    example: [
      {
        voucherID: '',
        // soldVouchers: 0,
        numberOfVouchers: 0,
      },
    ],
  })
  vouchers: [];
}
