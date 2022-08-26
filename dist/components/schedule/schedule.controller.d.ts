import { ScheduleService } from './schedule.service';
export declare class ScheduleController {
    private readonly _scheduleService;
    constructor(_scheduleService: ScheduleService);
    getQueuedSchedules(): Promise<(import("../../interface/schedule/schedule.interface").Schedule & {
        _id: string;
    })[]>;
    cancelJob(jobId: string): Promise<import("mongodb").UpdateResult>;
}
