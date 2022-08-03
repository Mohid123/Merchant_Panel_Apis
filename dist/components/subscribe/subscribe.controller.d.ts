/// <reference types="mongoose" />
import { SubscribeDTO } from 'src/dto/subscribe/subscribe.dto';
import { SubscribeService } from './subscribe.service';
export declare class SubscribeController {
    private readonly _subscribeService;
    constructor(_subscribeService: SubscribeService);
    addSubscribe(subscribeDto: SubscribeDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/subscribe/subscribe.interface").SubscribeInterface> & import("../../interface/subscribe/subscribe.interface").SubscribeInterface & {
        _id: string;
    }>;
    deleteSubscription(id: string): Promise<{
        message: string;
    }>;
    getSubscription(email: string): Promise<import("mongoose").Document<unknown, any, import("../../interface/subscribe/subscribe.interface").SubscribeInterface> & import("../../interface/subscribe/subscribe.interface").SubscribeInterface & {
        _id: string;
    }>;
    getAllSubscriptions(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
