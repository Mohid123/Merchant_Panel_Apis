import { Document } from 'mongoose';

export interface Schedule extends Document {
  _id: string;
  scheduleDate: Date;
  status: number; //0 for queue , -1 for unPublish, 1 for published
  type: string;
  deletedCheck: boolean;
}
