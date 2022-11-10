"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.CampaignSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    affiliateMongoID: { type: String, default: '' },
    affiliateID: { type: String, default: '' },
    title: { type: String, default: '' },
    fundingGoals: { type: Number, default: 0 },
    collectedAmount: { type: Number, default: 0 },
    details: { type: String, default: '' },
    startDate: { type: Number },
    endDate: { type: Number },
    deletedCheck: { type: Boolean, default: false }
}, {
    collection: 'campaigns'
});
exports.CampaignSchema.set('timestamps', true);
exports.CampaignSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Campaign', exports.CampaignSchema);
exports.CampaignSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=campaign.schema.js.map