import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduleService } from './schedule.service';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly _scheduleService: ScheduleService) {}

  @Get('getQueuedSchedules')
  getQueuedSchedules() {
    return this._scheduleService.getQueuedSchedules();
  }

  @Get('cancelJob/:jobId')
  cancelJob(@Param('jobId') jobId: string) {
    return this._scheduleService.cancelJob(jobId);
  }
}
