import { ApiProperty } from '@nestjs/swagger';

export class ActivityDto {
  @ApiProperty()
  activityType: string;
  @ApiProperty()
  activityTime: number;
  @ApiProperty()
  merchantID: string;
  @ApiProperty()
  merchantMongoID: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  deletedCheck: boolean;
}
