import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduleService } from './schedule.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly _scheduleService: ScheduleService) {}
}
