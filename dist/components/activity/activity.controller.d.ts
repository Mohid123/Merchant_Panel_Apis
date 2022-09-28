import { ActivityDto } from '../../dto/activity/activity.dto';
import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    createActivity(activityDto: ActivityDto): Promise<import("../../interface/activity/activity.interface").ActivityInterface & {
        _id: any;
    }>;
    getActivity(id: string): Promise<import("../../interface/activity/activity.interface").ActivityInterface & {
        _id: any;
    }>;
    getAllActivities(offset?: number, limit?: number): Promise<{
        totalActivities: number;
        data: any[];
    }>;
    getActivityByMerchant(offset: number, limit: number, req: any): Promise<{
        totalActivities: number;
        data: any[];
    }>;
}
