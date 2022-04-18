"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.ActivitySchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    activityType: { type: String, default: '' },
    activityTime: { type: Number },
    merchantID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    dealID: { type: String, default: '' },
}, {
    collection: 'activities',
});
exports.ActivitySchema.set('timestamps', true);
exports.ActivitySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Activity', exports.ActivitySchema);
exports.ActivitySchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=activity.schema.js.map