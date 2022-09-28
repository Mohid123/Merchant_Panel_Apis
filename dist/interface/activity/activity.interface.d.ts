import { Document } from 'mongoose';
export interface ActivityInterface extends Document {
    id: string;
    activityType: string;
    activityTime: number;
    merchantID: string;
    merchantMongoID: string;
    message: string;
    deletedCheck: boolean;
}
