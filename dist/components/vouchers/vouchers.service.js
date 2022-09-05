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
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const voucherstatus_enum_1 = require("../../enum/voucher/voucherstatus.enum");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const schedule_service_1 = require("../schedule/schedule.service");
const qr = require('qrcode');
const fs = require("fs");
let VouchersService = class VouchersService {
    constructor(voucherModel, voucherCounterModel, userModel, _scheduleModel, _scheduleService) {
        this.voucherModel = voucherModel;
        this.voucherCounterModel = voucherCounterModel;
        this.userModel = userModel;
        this._scheduleModel = _scheduleModel;
        this._scheduleService = _scheduleService;
    }
    async generateVoucherId(sequenceName) {
        const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
            $inc: {
                sequenceValue: 1,
            },
        }, { new: true });
        const year = new Date().getFullYear() % 2000;
        return `VBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${sequenceDocument.sequenceValue < 10000 ? '0' : ''}${sequenceDocument.sequenceValue}`;
    }
    async createVoucher(voucherDto) {
        try {
            let timeStamp = new Date().getTime();
            voucherDto.boughtDate = timeStamp;
            voucherDto.voucherID = await this.generateVoucherId('voucherID');
            let voucher = new this.voucherModel(voucherDto);
            this._scheduleService.scheduleVocuher({
                scheduleDate: new Date(voucherDto.expiryDate),
                status: 0,
                type: 'expireVoucher',
                dealID: voucherDto.voucherID,
                deletedCheck: false,
            });
            voucher = await voucher.save();
            let url = `${process.env.merchantPanelURL}/redeemVoucher/${voucher.id}`;
            url = await this.generateQRCode(url);
            await this.voucherModel.findByIdAndUpdate(voucher.id, { redeemQR: url });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateQRCode(qrUrl) {
        try {
            const qrData = qrUrl;
            let randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            const url = `${process.env.URL}media-upload/mediaFiles/qr/${randomName}.png`;
            const src = await qr.toDataURL(qrData);
            var base64Data = src.replace(/^data:image\/png;base64,/, '');
            await fs.promises.writeFile(`./mediaFiles/NFT/qr/${randomName}.png`, base64Data, 'base64');
            console.log('QR Code generated');
            return url;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchByVoucherId(merchantID, voucherId, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let filters = {};
            if (voucherId.trim().length) {
                var query = new RegExp(`${voucherId}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { voucherID: query });
            }
            const totalCount = await this.voucherModel.countDocuments(Object.assign({ merchantMongoID: merchantID, deletedCheck: false }, filters));
            const vouchers = await this.voucherModel
                .aggregate([
                {
                    $match: Object.assign({ merchantMongoID: merchantID, deletedCheck: false }, filters),
                },
                {
                    $addFields: {
                        id: '$_id',
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                data: vouchers,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllVouchersByMerchantID(deal, voucher, amount, fee, net, status, paymentStatus, dateFrom, dateTo, merchantId, voucherID, dealHeader, voucherHeader, voucherStatus, invoiceStatus, offset, limit, multipleVouchersDto) {
        var _a, _b, _c, _d, _e;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            dateFrom = parseInt(dateFrom);
            dateTo = parseInt(dateTo);
            let dateToFilters = {};
            let dateFromFilters = {};
            let matchFilter = {};
            if (status) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { status: status });
            }
            if (paymentStatus) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { paymentStatus: paymentStatus });
            }
            if (dateFrom) {
                dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { $gte: dateFrom });
            }
            if (dateTo) {
                dateToFilters = Object.assign(Object.assign({}, dateToFilters), { $lte: dateTo });
            }
            if (dateFrom || dateTo) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { $and: [
                        {
                            boughtDate: Object.assign({}, dateFromFilters),
                        },
                        {
                            boughtDate: Object.assign({}, dateToFilters),
                        },
                    ] });
            }
            let sort = {};
            if (deal) {
                let sortDeal = deal == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('deal');
                sort = Object.assign(Object.assign({}, sort), { dealHeader: sortDeal });
            }
            if (voucher) {
                let sortVoucher = voucher == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('voucher');
                sort = Object.assign(Object.assign({}, sort), { voucherHeader: sortVoucher });
            }
            if (amount) {
                let sortAmount = amount == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('amount');
                sort = Object.assign(Object.assign({}, sort), { amount: sortAmount });
            }
            if (fee) {
                let sortFee = fee == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('fee');
                sort = Object.assign(Object.assign({}, sort), { fee: sortFee });
            }
            if (net) {
                let sortNet = net == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('net');
                sort = Object.assign(Object.assign({}, sort), { net: sortNet });
            }
            voucherID = voucherID.trim();
            dealHeader = dealHeader.trim();
            voucherHeader = voucherHeader.trim();
            voucherStatus = voucherStatus.trim();
            invoiceStatus = invoiceStatus.trim();
            let filters = {};
            if (voucherID.trim().length) {
                var query = new RegExp(`${voucherID}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { voucherID: query });
            }
            if (dealHeader.trim().length) {
                var query = new RegExp(`${dealHeader}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { dealHeader: query });
            }
            if (voucherHeader.trim().length) {
                var query = new RegExp(`${voucherHeader}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { voucherHeader: query });
            }
            if (voucherStatus.trim().length) {
                var query = new RegExp(`${voucherStatus}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { status: query });
            }
            if (invoiceStatus.trim().length) {
                var query = new RegExp(`${invoiceStatus}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { paymentStatus: query });
            }
            if ((_a = multipleVouchersDto === null || multipleVouchersDto === void 0 ? void 0 : multipleVouchersDto.voucherIDsArray) === null || _a === void 0 ? void 0 : _a.length) {
                filters = Object.assign(Object.assign({}, filters), { voucherID: { $in: multipleVouchersDto.voucherIDsArray } });
            }
            if ((_b = multipleVouchersDto === null || multipleVouchersDto === void 0 ? void 0 : multipleVouchersDto.dealHeaderArray) === null || _b === void 0 ? void 0 : _b.length) {
                filters = Object.assign(Object.assign({}, filters), { dealHeader: { $in: multipleVouchersDto.dealHeaderArray } });
            }
            if ((_c = multipleVouchersDto === null || multipleVouchersDto === void 0 ? void 0 : multipleVouchersDto.voucherHeaderArray) === null || _c === void 0 ? void 0 : _c.length) {
                filters = Object.assign(Object.assign({}, filters), { voucherHeader: { $in: multipleVouchersDto.voucherHeaderArray } });
            }
            if ((_d = multipleVouchersDto === null || multipleVouchersDto === void 0 ? void 0 : multipleVouchersDto.voucherStatusArray) === null || _d === void 0 ? void 0 : _d.length) {
                filters = Object.assign(Object.assign({}, filters), { status: { $in: multipleVouchersDto.voucherStatusArray } });
            }
            if ((_e = multipleVouchersDto === null || multipleVouchersDto === void 0 ? void 0 : multipleVouchersDto.invoiceStatusArray) === null || _e === void 0 ? void 0 : _e.length) {
                filters = Object.assign(Object.assign({}, filters), { paymentStatus: { $in: multipleVouchersDto.invoiceStatusArray } });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            const totalCount = await this.voucherModel.countDocuments(Object.assign(Object.assign({ merchantMongoID: merchantId }, matchFilter), filters));
            const filteredCount = await this.voucherModel.countDocuments({
                merchantMongoID: merchantId,
            });
            let vouchers = await this.voucherModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({ merchantMongoID: merchantId }, matchFilter), filters),
                },
                {
                    $sort: sort,
                },
                {
                    $addFields: {
                        id: '$_id',
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                filteredCount,
                data: vouchers,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVouchersByCustomerID(customerID, searchVoucher, voucherStatus, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let matchFilter = {};
            if (customerID) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { customerMongoID: customerID });
            }
            if (voucherStatus) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { status: voucherStatus });
            }
            let filters = {};
            if (searchVoucher.trim().length) {
                var query = new RegExp(`${searchVoucher}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { voucherHeader: query });
            }
            const totalCount = await this.voucherModel.countDocuments({
                customerMongoID: customerID,
                deletedCheck: false,
            });
            const filteredCount = await this.voucherModel.countDocuments(Object.assign(Object.assign({ customerMongoID: customerID, deletedCheck: false }, matchFilter), filters));
            let customerVouchers = await this.voucherModel.aggregate([
                {
                    $match: Object.assign(Object.assign({ customerMongoID: customerID, deletedCheck: false }, matchFilter), filters)
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: 'locations',
                        let: {
                            merchantID: '$merchantID',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$merchantID', '$$merchantID'],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    id: '$_id',
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                    __v: 0
                                }
                            }
                        ],
                        as: 'merchantData',
                    },
                },
                {
                    $unwind: '$merchantData',
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                filteredCount: filteredCount,
                data: customerVouchers
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async redeemVoucher(voucherId, req) {
        try {
            const voucherErrors = {
                Expired: 'Voucher Expired!',
                Redeemed: 'Voucher already Reedemed!',
                Refunded: 'Vocuher Refunded!',
                'In Dispute': 'Voucher is in dispute!',
            };
            const voucher = await this.voucherModel.findOne({
                voucherID: voucherId,
                deletedCheck: false,
            });
            if (req.user.id != voucher.merchantMongoID) {
                throw new common_1.UnauthorizedException('Not allowed to redeem voucher!');
            }
            if (voucher) {
                if (voucher.expiryDate < new Date().getTime()) {
                    voucher.status = 'Expired';
                }
                if (voucherErrors[voucher.status]) {
                    return {
                        status: 'error',
                        message: voucherErrors[voucher.status],
                        voucher,
                    };
                }
            }
            if (!voucher) {
                throw new Error('No found!');
            }
            let scheduledVoucher = await this._scheduleModel.findOne({
                dealID: voucher.voucherID,
                status: 0,
            });
            if (scheduledVoucher) {
                this._scheduleService.cancelJob(scheduledVoucher.id);
            }
            const merchant = await this.userModel.findOne({
                userID: voucher.merchantID,
            });
            let redeemDate = new Date().getTime();
            const calculatedFee = voucher.dealPrice * 0.05;
            const net = voucher.dealPrice - 0.05 * voucher.dealPrice;
            await this.voucherModel.updateOne({ voucherID: voucherId }, {
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed,
                redeemDate: redeemDate,
                net: net,
                fee: calculatedFee
            });
            await this.userModel.updateOne({ userID: voucher.merchantID }, {
                redeemedVouchers: merchant.redeemedVouchers + 1,
                totalEarnings: merchant.totalEarnings + net,
            });
            const updtaedVoucher = await this.voucherModel.findOne({
                voucherID: voucherId,
            });
            return {
                status: 'success',
                message: 'Voucher redeemed successfully',
                voucher: updtaedVoucher,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVoucherByMongoId(id) {
        try {
            const voucher = await this.voucherModel.aggregate([
                {
                    $match: {
                        _id: id,
                        deletedCheck: false,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetail',
                        localField: 'merchantID',
                        foreignField: 'userID',
                    },
                },
                {
                    $unwind: '$merchantDetail',
                },
                {
                    $addFields: {
                        id: '$_id',
                    },
                },
                {
                    $project: {
                        id: 1,
                        voucherID: 1,
                        voucherHeader: 1,
                        dealHeader: 1,
                        dealID: 1,
                        merchantID: 1,
                        merchantMongoID: 1,
                        customerID: 1,
                        amount: 1,
                        fee: 1,
                        net: 1,
                        status: 1,
                        paymentStatus: 1,
                        boughtDate: 1,
                        expiryDate: 1,
                        redeemDate: 1,
                        imageURL: 1,
                        dealPrice: 1,
                        originalPrice: 1,
                        discountedPercentage: 1,
                        personalDetail: {
                            firstName: 1,
                            lastName: 1,
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
            ]);
            if (voucher.length == 0) {
                throw new Error('No Voucher Found!');
            }
            return voucher[0];
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async redeemVoucherByMerchantPin(redeemVoucherDto) {
        try {
            const voucherErrors = {
                Expired: 'Voucher Expired!',
                Redeemed: 'Voucher already Reedemed!',
                Refunded: 'Vocuher Refunded!',
                'In Dispute': 'Voucher is in dispute!',
            };
            const voucher = await this.voucherModel.findOne({
                voucherID: redeemVoucherDto.voucherID,
                deletedCheck: false,
            });
            if (voucher) {
                if (voucher.expiryDate < new Date().getTime()) {
                    voucher.status = 'Expired';
                }
                if (voucherErrors[voucher.status]) {
                    return {
                        status: 'error',
                        message: voucherErrors[voucher.status],
                        voucher,
                    };
                }
            }
            if (!voucher) {
                throw new Error('No found!');
            }
            let scheduledVoucher = await this._scheduleModel.findOne({
                dealID: voucher.voucherID,
                status: 0,
            });
            if (scheduledVoucher) {
                this._scheduleService.cancelJob(scheduledVoucher.id);
            }
            const merchant = await this.userModel.findOne({
                userID: voucher.merchantID,
            });
            if (merchant.voucherPinCode != redeemVoucherDto.pin) {
                throw new Error('Inavlid Pin Code!');
            }
            let redeemDate = new Date().getTime();
            const net = voucher.dealPrice - 0.05 * voucher.dealPrice;
            await this.voucherModel.updateOne({ voucherID: redeemVoucherDto.voucherID }, {
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed,
                redeemDate: redeemDate,
                net: net,
            });
            await this.userModel.updateOne({ userID: voucher.merchantID }, {
                redeemedVouchers: merchant.redeemedVouchers + 1,
                totalEarnings: merchant.totalEarnings + net,
            });
            const updtaedVoucher = await this.voucherModel.findOne({
                voucherID: redeemVoucherDto.voucherID,
            });
            return {
                status: 'success',
                message: 'Voucher redeemed successfully',
                voucher: updtaedVoucher,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Voucher')),
    __param(1, (0, mongoose_1.InjectModel)('Counter')),
    __param(2, (0, mongoose_1.InjectModel)('User')),
    __param(3, (0, mongoose_1.InjectModel)('Schedule')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        schedule_service_1.ScheduleService])
], VouchersService);
exports.VouchersService = VouchersService;
//# sourceMappingURL=vouchers.service.js.map