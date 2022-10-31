import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const affiliateSubCategoriesSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    affiliateSubCategoryName: { type: String, default: '' },
    affiliateCategoryID: { type: String, default: '' },
    affiliateCategoryName: { type: String, default: '' },
  },
  {
    collection: 'affiliateSubCategories',
  },
);

mongoose.model('affiliateSubCategories', affiliateSubCategoriesSchema);

affiliateSubCategoriesSchema.set('timestamps', true);

affiliateSubCategoriesSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

affiliateSubCategoriesSchema.index({ categoryID: 1 });
affiliateSubCategoriesSchema.index({ categoryName: 1 });
