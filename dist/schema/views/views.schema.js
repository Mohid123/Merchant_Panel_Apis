"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewsSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.ViewsSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    dealMongoID: { type: String, default: '' },
    dealID: { type: String, default: '' },
    customerMongoID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    viewedTime: { type: Number },
}, {
    collection: 'views'
});
exports.ViewsSchema.set('timestamps', true);
exports.ViewsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('views', exports.ViewsSchema);
exports.ViewsSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=views.schema.js.map