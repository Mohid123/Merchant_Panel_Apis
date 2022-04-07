import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';
import { CategoryInterface } from '../../interface/category/category.interface';

export const CategorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    type: { type: String, default: '' },
  },
  {
    collection: 'categories',
  },
);

CategorySchema.set('timestamps', true);
CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Category', CategorySchema);

CategorySchema.pre<CategoryInterface>('save', async function (next) {
  next();
});
