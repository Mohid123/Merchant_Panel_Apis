import { Model } from 'mongoose';
import { ActivityInterface } from '../../interface/activity/activity.interface';
export declare class ActivityService {
    private readonly activityModel;
    constructor(activityModel: Model<ActivityInterface>);
    createActivity(activityDto: any): Promise<ActivityInterface & {
        _id: any;
    }>;
    getActivity(id: any): Promise<ActivityInterface & {
        _id: any;
    }>;
    getAllActivities(offset: any, limit: any): Promise<{
        totalActivities: number;
        data: any[];
    }>;
    getActivitiesByMerchant(req: any, offset: any, limit: any): Promise<{
        totalActivities: number;
        data: any[];
    }>;
}
