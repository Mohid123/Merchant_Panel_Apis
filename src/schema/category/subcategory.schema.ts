import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const SubCategorySchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        subCategoryName: { type: String, default: '' },
        categoryID: { type: String, default: '' },
        categoryName: { type: String, default: '' }
    },
    {
        collection: 'subCategories'
    }
);

mongoose.model('SubCategory', SubCategorySchema);

SubCategorySchema.set('timestamps', true);

SubCategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});