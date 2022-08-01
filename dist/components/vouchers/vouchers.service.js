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
const sort_enum_1 = require("../../enum/sort/sort.enum");
let VouchersService = class VouchersService {
    constructor(voucherModel, voucherCounterModel) {
        this.voucherModel = voucherModel;
        this.voucherCounterModel = voucherCounterModel;
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
            let timeStamp = new Date(voucherDto.boughtDate).getTime();
            voucherDto.boughtDate = timeStamp;
            voucherDto.voucherID = await this.generateVoucherId('voucherID');
            const voucher = new this.voucherModel(voucherDto);
            return await voucher.save();
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchByVoucherId(voucherId) {
        try {
            const voucher = await this.voucherModel.find({ voucherID: voucherId });
            if (!voucher) {
                throw new common_1.HttpException('No record Found', common_1.HttpStatus.NOT_FOUND);
            }
            return voucher;
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
            const totalCount = await this.voucherModel.countDocuments(Object.assign(Object.assign({ merchantID: merchantId }, matchFilter), filters));
            const filteredCount = await this.voucherModel.countDocuments({
                merchantID: merchantId,
            });
            let vouchers = await this.voucherModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({ merchantID: merchantId }, matchFilter), filters),
                },
                {
                    $addFields: {
                        id: '$_id',
                        voucherHeader: {
                            $toLower: '$voucherHeader'
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        voucherID: 1,
                        dealHeader: 1,
                        dealID: 1,
                        merchantID: 1,
                        customerID: 1,
                        amount: 1,
                        fee: 1,
                        net: 1,
                        status: 1,
                        paymentStatus: 1,
                        boughtDate: 1,
                        deletedCheck: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        voucherHeader: {
                            $toLower: '$voucherHeader'
                        }
                    },
                },
                {
                    $sort: sort,
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
};
VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Voucher')),
    __param(1, (0, mongoose_1.InjectModel)('Counter')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VouchersService);
exports.VouchersService = VouchersService;
//# sourceMappingURL=vouchers.service.js.map