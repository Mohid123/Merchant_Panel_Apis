import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';

export const ScheduleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    scheduleDate: { type: Date },
    status: { type: Number, default: 0 }, //0 for queue , -1 for unPublish, 1 for published
    type: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false },
  },
  {
    collection: 'schedule',
    timestamps: true,
  },
);

mongoose.model('schedule', ScheduleSchema);

ScheduleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
