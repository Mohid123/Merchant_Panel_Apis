import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivityDto } from '../../dto/activity/activity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
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

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getActivityByMerchant')
  getActivityByMerchant(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.activityService.getActivitiesByMerchant(req, offset, limit);
  }
}
