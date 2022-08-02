import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const SubscribeSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        email: { type: String, default: '' },
        deletedCheck: { type: Boolean, default: false }
    },
    {
        collection: 'subscribe'
    }
);

mongoose.model('subscribe', SubscribeSchema);

SubscribeSchema.set('timestamps', true);

SubscribeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});