import { ApiProperty } from '@nestjs/swagger';

export class AffiliateCategoryDto {
  @ApiProperty()
  affiliateCategoryName: string;

}
