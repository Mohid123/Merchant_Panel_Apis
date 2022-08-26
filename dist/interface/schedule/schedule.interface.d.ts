import { Document } from 'mongoose';
export interface Schedule extends Document {
    _id: string;
    scheduleDate: Date;
    status: number;
    type: string;
    dealID: string;
    deletedCheck: boolean;
}
