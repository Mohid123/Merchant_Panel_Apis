import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { CampaignInterface } from 'src/interface/campaign/campaign.interfce';

export const CampaignSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        affiliateMongoID: { type: String, default: '' },
        affiliateID: { type: String, default: '' },
        title: { type: String, default: '' },
        fundingGoals: { type: Number, default: 0 },
        collectedAmount: { type: Number, default: 0 },
        details: { type: String, default: '' },
        startDate: { type: Number },
        endDate: { type: Number },
        deletedCheck: { type: Boolean, default: false }
    },
    {
        collection: 'campaigns'
    }
);

CampaignSchema.set('timestamps', true);
CampaignSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Campaign', CampaignSchema);

CampaignSchema.pre<CampaignInterface>('save', async function (next) {
  next();
});