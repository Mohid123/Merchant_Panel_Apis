import { ApiProperty } from '@nestjs/swagger';

export class VoucherDto {
  @ApiProperty()
  voucherID: string;

  @ApiProperty()
  dealName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  fee: number;

  @ApiProperty()
  net: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty()
  merchantID: string;

  @ApiProperty()
  dealId: string;

  @ApiProperty()
  boughtDate: Date;

  @ApiProperty()
  deletedCheck: boolean;
}
