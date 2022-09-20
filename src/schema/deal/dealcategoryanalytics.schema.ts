import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { DealCategoryAnalyticsInterface } from 'src/interface/deal/dealcategoryanalytics.interface';

export const DealCategoryAnalyticsSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        customerID: { type: String, default: '' },
        categoryName: { type: String, default: '' },
        count: { type: Number, default: 0 },
    },
    {
        collection: 'categories-Analytics'
    }
);

DealCategoryAnalyticsSchema.set('timestamps', true);
DealCategoryAnalyticsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('categories-Analytics', DealCategoryAnalyticsSchema);

DealCategoryAnalyticsSchema.pre<DealCategoryAnalyticsInterface>('save', async function (next) {
  next();
});