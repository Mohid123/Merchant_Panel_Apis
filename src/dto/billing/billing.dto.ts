import { ApiProperty } from '@nestjs/swagger';

export class BillingDto {
  @ApiProperty()
  transactionID: number;
  @ApiProperty()
  transactionDate: number;
  @ApiProperty()
  paymentMethod: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  merchantID: string;
  @ApiProperty()
  deletedCheck: boolean;
}
