import { ApiProperty } from '@nestjs/swagger';

export class VoucherDto {
  @ApiProperty()
  voucherID: string;

  @ApiProperty()
  voucherHeader: string;

  @ApiProperty()
  dealHeader: string;

  @ApiProperty()
  dealID: string;

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
  customerID: string;

  @ApiProperty()
  boughtDate: number;

  @ApiProperty()
  deletedCheck: boolean;
}
