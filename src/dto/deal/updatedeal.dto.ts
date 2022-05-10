import { ApiProperty } from '@nestjs/swagger';
import { VoucherInterface } from 'src/interface/deal/deal.interface';

export class UpdateDealDto {
  @ApiProperty()
  endDate: Date;
  @ApiProperty({
    example: [
      {
        voucherID: '',
        soldVouchers: 0,
        numberOfVouchers: 0,
      },
    ],
  })
  vouchers: [];
}
