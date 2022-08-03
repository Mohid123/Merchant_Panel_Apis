"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.SubscribeSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    email: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
}, {
    collection: 'subscribe'
});
mongoose.model('subscribe', exports.SubscribeSchema);
exports.SubscribeSchema.set('timestamps', true);
exports.SubscribeSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=subscribe.schema.js.map