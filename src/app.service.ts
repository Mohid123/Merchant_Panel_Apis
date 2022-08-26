import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScheduleService } from './components/schedule/schedule.service';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private _scheduleService: ScheduleService) {}

  onModuleInit() {
    console.log('Schedule Module Initialize');

    const dir = 'mediaFiles/NFT/qr';
    let exist = fs.existsSync(dir);

    if (!exist) {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          return console.log('err');
        }
      });
    }

    this._scheduleService.retrieveJobs();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
