import { OnModuleInit } from '@nestjs/common';
import { ScheduleService } from './components/schedule/schedule.service';
export declare class AppService implements OnModuleInit {
    private _scheduleService;
    constructor(_scheduleService: ScheduleService);
    onModuleInit(): void;
    getHello(): string;
}
