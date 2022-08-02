import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const BlogSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        title: { type: String, default: '' },
        text: { type: String, default: '' },
        media: { type: Array },
        deletedCheck: { type: Boolean, default: false }
    },
    {
        collection: 'blog'
    }
);

mongoose.model('blog', BlogSchema);

BlogSchema.set('timestamps', true);

BlogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});