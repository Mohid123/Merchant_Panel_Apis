import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from 'src/interface/schedule/schedule.interface';

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(
    @InjectModel('Schedule') private _scheduleModel: Model<Schedule>,
  ) {}

  onModuleInit() {
    console.log('Schedule Module Initialized');
  }
}
