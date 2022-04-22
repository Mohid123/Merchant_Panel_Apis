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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sortinvoiceamount_enum_1 = require("../../enum/sorting/sortinvoiceamount.enum");
const sortinvoicedate_enum_1 = require("../../enum/sorting/sortinvoicedate.enum");
let InvoicesService = class InvoicesService {
    constructor(_invoicesModel) {
        this._invoicesModel = _invoicesModel;
    }
    async createInvoice(invoiceDto) {
        invoiceDto.invoiceDate = new Date().getTime();
        return await new this._invoicesModel(invoiceDto).save();
    }
    async getInvoice(invoiceURL) {
        return await this._invoicesModel.findOne({ invoiceURL: invoiceURL });
    }
    async getAllInvoices(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let totalCount = await this._invoicesModel.countDocuments();
            let invoices = await this._invoicesModel.aggregate([
                {
                    $sort: {
                        invoiceDate: -1
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
                data: invoices
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllInvoicesByMerchant(merchantID, dateFrom, dateTo, invoiceDate, invoiceAmount, offset, limit) {
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
            let sortInvoiceDate;
            if (invoiceDate) {
                if (invoiceDate == sortinvoicedate_enum_1.INVOICEDATEENUM.ASC) {
                    sortInvoiceDate = 1;
                }
                else {
                    sortInvoiceDate = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { transactionDate: sortInvoiceDate });
            }
            let sortInvoiceAmount;
            if (invoiceAmount) {
                if (invoiceAmount == sortinvoiceamount_enum_1.INVOICEAMOUNTENUM.ASC) {
                    sortInvoiceAmount = 1;
                }
                else {
                    sortInvoiceAmount = -1;
                }
                sortFilters = Object.assign(Object.assign({}, sortFilters), { amount: sortInvoiceAmount });
            }
            const totalCount = await this._invoicesModel.countDocuments(Object.assign({ merchantID: merchantID }, matchFilter));
            let invoices = await this._invoicesModel.aggregate([
                {
                    $match: Object.assign({ merchantID: merchantID }, matchFilter)
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
                data: invoices
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Invoices')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InvoicesService);
exports.InvoicesService = InvoicesService;
//# sourceMappingURL=invoices.service.js.map