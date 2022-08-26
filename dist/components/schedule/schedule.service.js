"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const voucherstatus_enum_1 = require("../../enum/voucher/voucherstatus.enum");
const nodeSchedule = require('node-schedule');
let ScheduleService = class ScheduleService {
    constructor(_scheduleModel, _dealModel, _voucherModel) {
        this._scheduleModel = _scheduleModel;
        this._dealModel = _dealModel;
        this._voucherModel = _voucherModel;
    }
    async retrieveJobs() {
        let jobs = await this._scheduleModel.find({
            status: 0,
            deletedCheck: false,
            scheduleDate: { $gt: new Date() },
        });
        console.log(`${jobs.length} jobs scheduled...`);
        await this._scheduleModel.updateMany({ status: 0, scheduleDate: { $lte: new Date() } }, { $set: { status: -1 } });
        jobs = JSON.parse(JSON.stringify(jobs));
        jobs.forEach(async (jobDoc) => {
            let status = '';
            if (jobDoc.type == 'publishDeal') {
                status = 'Published';
            }
            else if (jobDoc.type == 'expireDeal') {
                status = 'Expired';
            }
            else if (jobDoc.type == 'expireVoucher') {
                status = 'Expired';
            }
            await this.scheduleDealsFromDatabase(jobDoc.id, jobDoc.dealID, jobDoc.scheduleDate, status, jobDoc.type);
        });
    }
    async scheduleVocuher(scheduleVocuherDto) {
        const job = await new this._scheduleModel(scheduleVocuherDto).save();
        nodeSchedule.scheduleJob(job.id, job.scheduleDate, async () => {
            let status = '';
            if (job.type == 'expireVoucher') {
                status = voucherstatus_enum_1.VOUCHERSTATUSENUM.expired;
            }
            if (status == voucherstatus_enum_1.VOUCHERSTATUSENUM.expired) {
                await this._voucherModel.updateOne({ voucherID: job.dealID }, { status: status });
                const voucher = await this._voucherModel.findOne({
                    voucherID: job.dealID,
                });
                await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
            }
            console.log(`Voucher ${status}...`);
        });
    }
    async scheduleDeal(scheduleDealDto) {
        const job = await new this._scheduleModel(scheduleDealDto).save();
        nodeSchedule.scheduleJob(job.id, job.scheduleDate, async () => {
            let status = '';
            if (job.type == 'publishDeal') {
                status = 'Published';
            }
            else if (job.type == 'expireDeal') {
                status = 'Expired';
            }
            if (status == 'Published') {
                await this._dealModel.updateOne({ dealID: job.dealID }, { dealStatus: status });
                const deal = await this._dealModel.findOne({ dealID: job.dealID });
                await new this._scheduleModel({
                    scheduleDate: new Date(deal.endDate),
                    status: 0,
                    type: 'expireDeal',
                    dealID: deal.dealID,
                    deletedCheck: false,
                }).save();
                await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
            }
            else if (status == 'Expired') {
                await this._dealModel.updateOne({ dealID: job.dealID }, { dealStatus: status });
                await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
            }
            console.log(`Deal ${status}...`);
        });
    }
    async scheduleDealsFromDatabase(id, dealID, scheduleDate, status, type) {
        nodeSchedule.scheduleJob(id, scheduleDate, async () => {
            if (status == 'Published') {
                await this._dealModel.updateOne({ dealID: dealID }, { dealStatus: status });
                const deal = await this._dealModel.findOne({ dealID: dealID });
                await this.scheduleDeal({
                    scheduleDate: new Date(deal.endDate),
                    status: 0,
                    type: 'expireDeal',
                    dealID: deal.dealID,
                    deletedCheck: false,
                });
                await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
            }
            else if (status == 'Expired' && type == 'expireDeal') {
                await this._dealModel.updateOne({ dealID: dealID }, { dealStatus: status });
                await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
            }
            else if (status == 'Expired' && type == 'expireDeal') {
                await this._voucherModel.updateOne({ voucherID: dealID }, { status: status });
                await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
            }
            console.log(`Deal ${status}...`);
        });
    }
    async cancelJob(jobId) {
        try {
            let myJob = await nodeSchedule.scheduledJobs[jobId];
            if (!myJob) {
                throw new Error('No Job Found');
            }
            myJob.cancel();
            console.log('Job deleted successfully!');
        }
        catch (err) {
            console.log('Error...');
        }
        return this._scheduleModel.updateOne({ _id: jobId }, { deletedCheck: true, status: -1 });
    }
    async getQueuedSchedules() {
        try {
            return await this._scheduleModel.find({ status: 0, deletedCheck: false });
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Schedule')),
    __param(1, (0, mongoose_1.InjectModel)('Deal')),
    __param(2, (0, mongoose_1.InjectModel)('Voucher')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ScheduleService);
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=schedule.service.js.map