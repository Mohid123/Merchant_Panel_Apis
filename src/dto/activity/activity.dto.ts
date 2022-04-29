import { ApiProperty } from '@nestjs/swagger';

export class ActivityDto {
  @ApiProperty()
  activityType: string;
  @ApiProperty()
  activityTime: number;
  @ApiProperty()
  merchantID: string;
  @ApiProperty()
  customerID: string;
  @ApiProperty()
  dealID: string;
  @ApiProperty()
  deletedCheck: boolean;
}
