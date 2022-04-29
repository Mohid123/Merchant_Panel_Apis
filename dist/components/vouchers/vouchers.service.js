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
        return sequenceDocument.sequenceValue;
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
            const voucher = await this.voucherModel.findOne({ voucherID: voucherId });
            if (!voucher) {
                throw new common_1.HttpException('No record Found', common_1.HttpStatus.NOT_FOUND);
            }
            return voucher;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllVouchersByMerchantID(deal, amount, fee, net, status, paymentStatus, dateFrom, dateTo, merchantId, offset, limit) {
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
                sort = Object.assign(Object.assign({}, sort), { dealName: sortDeal });
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
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: 1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            const totalCount = await this.voucherModel.countDocuments(Object.assign({ merchantID: merchantId }, matchFilter));
            let vouchers = await this.voucherModel
                .aggregate([
                {
                    $match: Object.assign({ merchantID: merchantId }, matchFilter),
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