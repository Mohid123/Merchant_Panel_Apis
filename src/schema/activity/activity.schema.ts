import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { ActivityInterface } from 'src/interface/activity/activity.interface';
export const ActivitySchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    activityType: { type: String, default: '' },
    activityTime: { type: Number },
    merchantID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    dealID: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
  },
  {
    collection: 'activities',
  },
);

ActivitySchema.set('timestamps', true);
ActivitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Activity', ActivitySchema);
ActivitySchema.pre<ActivityInterface>('save', async function (next) {
  next();
});
