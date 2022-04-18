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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sort_enum_1 = require("../../enum/sort/sort.enum");
let BillingService = class BillingService {
    constructor(billingModel) {
        this.billingModel = billingModel;
    }
    async createBilling(billingDto) {
        try {
            billingDto.transactionDate = new Date(billingDto.transactionDate).getTime();
            const billing = await new this.billingModel(billingDto).save();
            return billing;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getBill(id) {
        try {
            const bill = await this.billingModel.find({ transactionID: id });
            return bill;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllBillings(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalBilling = await this.billingModel.countDocuments();
            let billings = await this.billingModel
                .aggregate([
                {
                    $sort: {
                        createdAt: -1,
                    },
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
                totalBilling,
                data: billings,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getBillingsByMerchant(paymentMethod, amount, date, status, dateFrom, dateTo, offset, limit, merchantId) {
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
            if (dateFrom) {
                dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { $gte: dateFrom });
            }
            if (dateTo) {
                dateToFilters = Object.assign(Object.assign({}, dateToFilters), { $lte: dateTo });
            }
            if (dateFrom || dateTo) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { transactionDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
            }
            let sort = {};
            if (paymentMethod) {
                let sortByPayment = paymentMethod == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('paymentMethod');
                sort = Object.assign(Object.assign({}, sort), { paymentMethod: sortByPayment });
            }
            if (amount) {
                let sortamount = amount == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('amount');
                sort = Object.assign(Object.assign({}, sort), { amount: sortamount });
            }
            if (date) {
                let sortDate = date == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('date');
                sort = Object.assign(Object.assign({}, sort), { transactionDate: sortDate });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: 1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            console.log(status);
            const totalCount = await this.billingModel.countDocuments(Object.assign({ merchantID: merchantId }, matchFilter));
            const billings = await this.billingModel
                .aggregate([
                {
                    $match: Object.assign({ merchantID: merchantId }, matchFilter),
                },
                {
                    $sort: sort,
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return { totalBillings: totalCount, billings };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Billing')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BillingService);
exports.BillingService = BillingService;
//# sourceMappingURL=billing.service.js.map