import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScheduleService } from './components/schedule/schedule.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private _scheduleService: ScheduleService) {}

  onModuleInit() {
    console.log('Schedule Module Initialize');
    this._scheduleService.retrieveJobs();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
