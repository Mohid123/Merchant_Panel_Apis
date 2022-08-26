import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDealDto {
  scheduleDate: Date;
  status: number;
  type: string;
  dealID: string;
  deletedCheck: boolean;
}
