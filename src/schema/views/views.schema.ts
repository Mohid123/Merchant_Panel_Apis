import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { ViewsInterface } from 'src/interface/views/views.interface';

export const ViewsSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        dealMongoID: { type: String, default: '' },
        dealID: { type: String, default: '' },
        customerMongoID: { type: String, default: '' },
        customerID: { type: String, default: '' },
        viewedTime: { type: Number },
    },
    {
        collection: 'views'
    }
);

ViewsSchema.set('timestamps', true);
ViewsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('views', ViewsSchema);

ViewsSchema.pre<ViewsInterface>('save', async function (next) {
  next();
});