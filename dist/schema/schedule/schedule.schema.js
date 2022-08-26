"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.ScheduleSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    scheduleDate: { type: Date },
    status: { type: Number, default: 0 },
    type: { type: String, default: '' },
    dealID: { type: String },
    deletedCheck: { type: Boolean, default: false },
}, {
    collection: 'schedule',
    timestamps: true,
});
mongoose.model('schedule', exports.ScheduleSchema);
exports.ScheduleSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=schedule.schema.js.map