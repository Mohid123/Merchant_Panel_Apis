import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealDto {
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  numberOfVouchers: number;
}
