import { Model } from 'mongoose';
import { ScheduleDealDto } from 'src/dto/schedule/scheduleDeal.dto';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { Schedule } from 'src/interface/schedule/schedule.interface';
import { VoucherInterface } from 'src/interface/vouchers/vouchers.interface';
export declare class ScheduleService {
    private _scheduleModel;
    private _dealModel;
    private readonly _voucherModel;
    constructor(_scheduleModel: Model<Schedule>, _dealModel: Model<DealInterface>, _voucherModel: Model<VoucherInterface>);
    retrieveJobs(): Promise<void>;
    runUpdateStatusSchedule(): Promise<void>;
    updateStatusSchedule(): Promise<void>;
    scheduleVocuher(scheduleVocuherDto: ScheduleDealDto): Promise<void>;
    scheduleDeal(scheduleDealDto: ScheduleDealDto): Promise<void>;
    scheduleDealsFromDatabase(id: any, dealID: any, scheduleDate: any, status: any, type: any): Promise<void>;
    cancelJob(jobId: any): Promise<import("mongodb").UpdateResult>;
    getQueuedSchedules(): Promise<(Schedule & {
        _id: string;
    })[]>;
}
