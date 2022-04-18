import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivityDto } from 'src/dto/activity/activity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivityService } from './activity.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('createActivity')
  createActivity(@Body() activityDto: ActivityDto) {
    return this.activityService.createActivity(activityDto);
  }

  @Get('getActivity/:id')
  getActivity(@Param('id') id: string) {
    return this.activityService.getActivity(id);
  }

  @Get('getAllActivities')
  getAllActivities(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.activityService.getAllActivities(offset, limit);
  }

  @Get('getActivityByMerchant/:id')
  getActivityByMerchant(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Param('id') id: string,
  ) {
    return this.activityService.getActivitiesByMerchant(id, offset, limit);
  }
}
