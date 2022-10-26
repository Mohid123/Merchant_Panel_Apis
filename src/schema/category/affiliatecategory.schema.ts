import * as mongoose from 'mongoose';
import { affiliateCategoryInterface } from 'src/interface/category/affiliatecategory.interface';
import { generateStringId } from '../../components/file-management/utils/utils';

export const affiliateCategorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    categoryName: { type: String, default: '' },
  },
  {
    collection: 'affiliateCategories',
  },
);

affiliateCategorySchema.set('timestamps', true);
affiliateCategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('affiliateCategories', affiliateCategorySchema);

affiliateCategorySchema.pre<affiliateCategoryInterface>('save', async function (next) {
  next();
});

affiliateCategorySchema.index({ categoryName: 1 });
affiliateCategorySchema.index({ _id: 1 });
