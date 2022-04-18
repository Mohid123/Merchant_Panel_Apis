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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sortamount_enum_1 = require("../../enum/sorting/sortamount.enum");
const sortcustomername_enum_1 = require("../../enum/sorting/sortcustomername.enum");
const sorttransactiondate_enum_1 = require("../../enum/sorting/sorttransactiondate.enum");
let OrdersService = class OrdersService {
    constructor(_orderModel) {
        this._orderModel = _orderModel;
    }
    async addOrder(orderDto) {
        try {
            let timeStamp = new Date().getTime();
            orderDto.transactionDate = timeStamp;
            return await new this._orderModel(orderDto).save();
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOrder(id) {
        try {
            const order = this._orderModel.aggregate([
                {
                    $match: {
                        _id: id
                    }
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
            ]);
            return order;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllOrders(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this._orderModel.countDocuments();
            let order = await this._orderModel.aggregate([
                {
                    $sort: {
                        transactionDate: -1
                    }
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
                data: order
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOrdersByMerchant(merchantID, dateFrom, dateTo, Name, Date, Amount, Fee, Net, filterStatus, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            dateFrom = parseInt(dateFrom);
            dateTo = parseInt(dateTo);
            let dateToFilters = {};
            let dateFromFilters = {};
            let matchFilter;
            if (dateFrom) {
                dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': dateFrom });
            }
            if (dateTo) {
                dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateTo });
            }
            if (dateFrom || dateTo) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { transactionDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
            }
            let sortFilters = {};
            Name = Name === null || Name === void 0 ? void 0 : Name.toUpperCase();
            let sortCustomerName;
            if (Name) {
                if (Name == sortcustomername_enum_1.NAMEENUM.ASC) {
                    sortCustomerName = 1;
                }
                else {
                    sortCustomerName = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { nameInLowerCase: sortCustomerName });
            }
            let sortDate;
            if (Date) {
                if (Date == sorttransactiondate_enum_1.TRANSACTIONDATEENUM.ASC) {
                    sortDate = 1;
                }
                else {
                    sortDate = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { transactionDate: sortDate });
            }
            let sortAmount;
            if (Amount) {
                if (Amount == sortamount_enum_1.AMOUNTENUM.ASC) {
                    sortAmount = 1;
                }
                else {
                    sortAmount = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { amount: sortAmount });
            }
            let sortFee;
            if (Fee) {
                if (Fee == sortamount_enum_1.AMOUNTENUM.ASC) {
                    sortFee = 1;
                }
                else {
                    sortFee = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { fee: sortFee });
            }
            let sortNet;
            if (Net) {
                if (Net == sortamount_enum_1.AMOUNTENUM.ASC) {
                    sortNet = 1;
                }
                else {
                    sortNet = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { netAmount: sortNet });
            }
            if (filterStatus) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { status: filterStatus });
            }
            const totalCount = await this._orderModel.countDocuments(Object.assign({ merchantID: merchantID }, matchFilter));
            let orders = await this._orderModel.aggregate([
                {
                    $match: Object.assign({ merchantID: merchantID }, matchFilter)
                },
                {
                    $addFields: {
                        nameInLowerCase: {
                            $toLower: "$customerName",
                        },
                    },
                },
                {
                    $sort: Object.assign(Object.assign({}, sortFilters), { createdAt: -1 })
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        nameInLowerCase: 0
                    }
                }
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                data: orders
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Order')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrdersService);
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map