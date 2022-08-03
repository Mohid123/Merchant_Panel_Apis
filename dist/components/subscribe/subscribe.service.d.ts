import { Model } from 'mongoose';
import { SubscribeInterface } from 'src/interface/subscribe/subscribe.interface';
export declare class SubscribeService {
    private readonly _subscribeModel;
    constructor(_subscribeModel: Model<SubscribeInterface>);
    addSubscription(subscribeDto: any): Promise<import("mongoose").Document<unknown, any, SubscribeInterface> & SubscribeInterface & {
        _id: string;
    }>;
    deleteSubscription(id: any): Promise<{
        message: string;
    }>;
    getSubscription(email: any): Promise<import("mongoose").Document<unknown, any, SubscribeInterface> & SubscribeInterface & {
        _id: string;
    }>;
    getAllSubscriptions(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
