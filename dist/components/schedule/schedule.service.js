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
const affiliate_enum_1 = require("../../enum/affiliate/affiliate.enum");
const dealstatus_enum_1 = require("../../enum/deal/dealstatus.enum");
const merchant_enum_1 = require("../../enum/merchant/merchant.enum");
const voucherstatus_enum_1 = require("../../enum/voucher/voucherstatus.enum");
const nodeSchedule = require('node-schedule');
const axios_1 = require("axios");
let ScheduleService = class ScheduleService {
    constructor(_scheduleModel, _dealModel, _voucherModel) {
        this._scheduleModel = _scheduleModel;
        this._dealModel = _dealModel;
        this._voucherModel = _voucherModel;
    }
    async retrieveJobs() {
        this.updateStatusSchedule();
    }
    async runUpdateStatusSchedule() {
        try {
            const currentDate = new Date().getTime();
            const dealsToPublish = await this._dealModel.updateMany({
                deletedCheck: false,
                startDate: { $lte: currentDate },
                dealStatus: dealstatus_enum_1.DEALSTATUS === null || dealstatus_enum_1.DEALSTATUS === void 0 ? void 0 : dealstatus_enum_1.DEALSTATUS.scheduled
            }, {
                $set: {
                    dealStatus: dealstatus_enum_1.DEALSTATUS === null || dealstatus_enum_1.DEALSTATUS === void 0 ? void 0 : dealstatus_enum_1.DEALSTATUS.published,
                }
            });
            console.log('Puplished deals', dealsToPublish);
            const dealsToExpire = await this._dealModel.updateMany({
                deletedCheck: false,
                endDate: { $lte: currentDate },
                dealStatus: dealstatus_enum_1.DEALSTATUS === null || dealstatus_enum_1.DEALSTATUS === void 0 ? void 0 : dealstatus_enum_1.DEALSTATUS.published
            }, {
                $set: {
                    dealStatus: dealstatus_enum_1.DEALSTATUS === null || dealstatus_enum_1.DEALSTATUS === void 0 ? void 0 : dealstatus_enum_1.DEALSTATUS.expired,
                }
            });
            console.log('Expired deals', dealsToExpire);
            const vouchersToExpire = await this._voucherModel.updateMany({
                deletedCheck: false,
                expiryDate: { $lte: currentDate },
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM === null || voucherstatus_enum_1.VOUCHERSTATUSENUM === void 0 ? void 0 : voucherstatus_enum_1.VOUCHERSTATUSENUM.purchased,
            }, {
                $set: {
                    status: voucherstatus_enum_1.VOUCHERSTATUSENUM === null || voucherstatus_enum_1.VOUCHERSTATUSENUM === void 0 ? void 0 : voucherstatus_enum_1.VOUCHERSTATUSENUM.expired,
                }
            });
            console.log('Expired vouchers', vouchersToExpire);
            const paymentClearDate = currentDate - (15 * 24 * 60 * 60 * 1000);
            const vouchersPaymentUpdate = await this._voucherModel.updateMany({
                deletedCheck: false,
                affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.pending,
                merchantPaymentStatus: merchant_enum_1.MERCHANTPAYMENTSTATUS.pending,
                boughtDate: { $lte: paymentClearDate },
            }, {
                $set: {
                    affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS === null || affiliate_enum_1.AFFILIATEPAYMENTSTATUS === void 0 ? void 0 : affiliate_enum_1.AFFILIATEPAYMENTSTATUS.approved,
                    merchantPaymentStatus: merchant_enum_1.MERCHANTPAYMENTSTATUS === null || merchant_enum_1.MERCHANTPAYMENTSTATUS === void 0 ? void 0 : merchant_enum_1.MERCHANTPAYMENTSTATUS.approved,
                }
            });
            console.log('vouchersPaymentUpdate', vouchersPaymentUpdate);
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException(err === null || err === void 0 ? void 0 : err.message);
        }
    }
    async updateStatusSchedule() {
        try {
            const rule = new nodeSchedule.RecurrenceRule();
            rule.hour = 0;
            rule.minutes = 0;
            rule.tz = 'Etc/UTC';
            nodeSchedule.scheduleJob(rule, async () => {
                await this.runUpdateStatusSchedule();
            });
        }
        catch (err) {
            console.log(err);
            throw new Error(err === null || err === void 0 ? void 0 : err.message);
        }
    }
    async scheduleVocuher(scheduleVocuherDto) {
        const job = await new this._scheduleModel(scheduleVocuherDto).save();
        nodeSchedule.scheduleJob(job.id, job.scheduleDate, async () => {
            let status = '';
            if (job.type == 'expireVoucher') {
                status = voucherstatus_enum_1.VOUCHERSTATUSENUM.expired;
            }
            if (job.type == 'updateMerchantAffiliatePaymentStatus') {
                status = merchant_enum_1.MERCHANTPAYMENTSTATUS.approved;
            }
            if (status == voucherstatus_enum_1.VOUCHERSTATUSENUM.expired) {
                await this._voucherModel.updateOne({ voucherID: job.dealID }, { status: status });
                const voucher = await this._voucherModel.findOne({
                    voucherID: job.dealID,
                });
                await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
            }
            if (status == merchant_enum_1.MERCHANTPAYMENTSTATUS.approved) {
                await this._voucherModel.updateOne({ voucherID: job.dealID }, { affiliatePaymentStatus: status, merchantPaymentStatus: status });
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
                await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${job.dealID}`);
                const deal = await this._dealModel.findOne({ dealID: job.dealID });
                this.scheduleDeal({
                    scheduleDate: new Date(deal.endDate),
                    status: 0,
                    type: 'expireDeal',
                    dealID: deal.dealID,
                    deletedCheck: false,
                });
                await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
            }
            else if (status == 'Expired') {
                await this._dealModel.updateOne({ dealID: job.dealID }, { dealStatus: status });
                await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${job.dealID}`);
                await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
            }
            console.log(`Deal ${status}...`);
        });
    }
    async scheduleDealsFromDatabase(id, dealID, scheduleDate, status, type) {
        nodeSchedule.scheduleJob(id, scheduleDate, async () => {
            if (status == 'Published') {
                await this._dealModel.updateOne({ dealID: dealID }, { dealStatus: status });
                await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${dealID}`);
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
                await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${dealID}`);
                await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
            }
            else if (status == 'Expired' && type == 'expireVoucher') {
                await this._voucherModel.updateOne({ voucherID: dealID }, { status: status });
                await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
            }
            else if (status == merchant_enum_1.MERCHANTPAYMENTSTATUS.approved &&
                type == 'updateMerchantAffiliatePaymentStatus') {
                await this._voucherModel.updateOne({ voucherID: dealID }, { affiliatePaymentStatus: status, merchantPaymentStatus: status });
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