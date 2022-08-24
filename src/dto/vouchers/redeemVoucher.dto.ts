import { ApiProperty } from '@nestjs/swagger';

export class RedeemVoucherDto {
  @ApiProperty()
  voucherID: string;

  @ApiProperty()
  pin: string;
}
