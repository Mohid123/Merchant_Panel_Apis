import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealForCRMDTO {
  @ApiProperty()
  dealID: string;
  @ApiProperty()
  subDealID: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  quantityAvailable: number;
  @ApiProperty()
  availabilityFromDate: number;
  @ApiProperty()
  availabilityToDate: number;
  @ApiProperty()
  availabilityDays: number;
}
