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
exports.DealService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dealstatus_enum_1 = require("../../enum/deal/dealstatus.enum");
const utils_1 = require("../file-management/utils/utils");
const sort_enum_1 = require("../../enum/sort/sort.enum");
let DealService = class DealService {
    constructor(dealModel, categorymodel, voucherCounterModel, subCategoryModel) {
        this.dealModel = dealModel;
        this.categorymodel = categorymodel;
        this.voucherCounterModel = voucherCounterModel;
        this.subCategoryModel = subCategoryModel;
    }
    async generateVoucherId(sequenceName) {
        const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
            $inc: {
                sequenceValue: 1,
            },
        }, { new: true });
        return sequenceDocument.sequenceValue;
    }
    async createDeal(dealDto, req) {
        try {
            console.log(dealDto);
            var dealVouchers = 0;
            var delaSoldVocuhers = 0;
            let category = await this.categorymodel.findOne({
                categoryName: req.user.businessType,
            });
            dealDto.categoryName = req.user.businessType;
            dealDto.categoryID = category.id;
            if (dealDto.subCategory) {
                let subCategory = await this.subCategoryModel.findOne({
                    subCategoryName: dealDto.subCategory,
                });
                dealDto.subCategoryID = subCategory.id;
            }
            dealDto.dealID = await this.generateVoucherId('dealID');
            let stamp = new Date(dealDto.startDate).getTime();
            dealDto.startDate = stamp;
            stamp = new Date(dealDto.endDate).getTime();
            dealDto.endDate = stamp;
            dealDto.dealHeader = dealDto.dealHeader.toUpperCase();
            dealDto.merchantID = req.user.id;
            dealDto.dealStatus = dealstatus_enum_1.DEALSTATUS.inReview;
            dealDto.vouchers = dealDto.vouchers.map((el) => {
                let startTime;
                let endTime;
                let calculateDiscountPercentage = ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
                el.discountPercentage = calculateDiscountPercentage;
                dealVouchers += el.numberOfVouchers;
                el.soldVouchers = 0;
                if (el.voucherValidity > 0) {
                    startTime = 0;
                    endTime = 0;
                }
                else {
                    startTime = new Date(el.voucherStartDate).getTime();
                    endTime = new Date(el.voucherEndDate).getTime();
                }
                el._id = (0, utils_1.generateStringId)();
                el.voucherStartDate = startTime;
                el.voucherEndDate = endTime;
                return el;
            });
            dealDto.availableVouchers = dealVouchers;
            const deal = await this.dealModel.create(dealDto);
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateDeal(updateDealDto, dealID) {
        const deal = await this.dealModel.findById(dealID);
        let dealVouchers = 0;
        let stamp = new Date(updateDealDto.endDate).getTime();
        updateDealDto.endDate = stamp;
        deal.endDate = updateDealDto.endDate;
        deal.vouchers = deal.vouchers.map((element) => {
            updateDealDto.vouchers.forEach((el) => {
                if (el['voucherID'] === element['_id']) {
                    element.numberOfVouchers += el.numberOfVouchers;
                }
            });
            dealVouchers += element.numberOfVouchers;
            return element;
        });
        deal.availableVouchers = dealVouchers;
        await this.dealModel.findByIdAndUpdate(dealID, deal);
        return { message: 'Deal Updated Successfully' };
    }
    async approveRejectDeal(dealID, dealStatusDto) {
        let deal = await this.dealModel.findOne({
            _id: dealID,
            deletedCheck: false,
            dealStatus: dealstatus_enum_1.DEALSTATUS.inReview,
        });
        if (dealStatusDto.dealStatus == dealstatus_enum_1.DEALSTATUS.scheduled) {
            return await this.dealModel.updateOne({ _id: deal.id }, { dealStatus: dealstatus_enum_1.DEALSTATUS.scheduled });
        }
        else if (dealStatusDto.dealStatus == dealstatus_enum_1.DEALSTATUS.bounced) {
            return await this.dealModel.updateOne({ _id: deal.id }, { dealStatus: dealstatus_enum_1.DEALSTATUS.bounced });
        }
    }
    async getAllDeals(req, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.dealModel.countDocuments({
                merchantID: req.user.id,
                deletedCheck: false,
            });
            let deals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        merchantID: req.user.id,
                        deletedCheck: false,
                    },
                },
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
                totalCount: totalCount,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDeal(id) {
        try {
            const deals = await this.dealModel.findOne({
                _id: id,
                deletedCheck: false,
            });
            return deals;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealReviews(offset, limit, rating, id) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let ratingFilter = {};
            if (rating) {
                ratingFilter = {
                    eq: ['$rating', parseInt(rating)],
                };
            }
            else {
                ratingFilter = Object.assign(Object.assign({}, ratingFilter), { eq: ['', ''] });
            }
            console.log(ratingFilter['eq']);
            const deal = await this.dealModel
                .aggregate([
                {
                    $match: {
                        _id: id,
                    },
                },
                {
                    $project: {
                        dealHeader: 1,
                        ratingsAverage: 1,
                        totalReviews: 1,
                        maxRating: 1,
                        minRating: 1,
                        Reviews: 1,
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            dealID: id,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$dealID', '$$dealID'],
                                            },
                                            {
                                                $eq: ratingFilter['eq'],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $skip: parseInt(offset),
                            },
                            {
                                $limit: parseInt(limit),
                            },
                        ],
                        as: 'Reviews',
                    },
                },
            ])
                .then((items) => items[0]);
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealsReviewStatsByMerchant(id, offset, limit) {
        offset = parseInt(offset) < 0 ? 0 : offset;
        limit = parseInt(limit) < 1 ? 10 : limit;
        try {
            const totalCount = await this.dealModel.countDocuments({
                merchantID: id,
                deletedCheck: false,
            });
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        merchantID: id,
                        deletedCheck: false,
                    },
                },
                {
                    $project: {
                        dealHeader: 1,
                        ratingsAverage: 1,
                        totalReviews: 1,
                        maxRating: 1,
                        minRating: 1,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            const totalMerchantReviews = await this.dealModel.aggregate([
                {
                    $match: {
                        merchantID: id,
                        deletedCheck: false,
                    },
                },
                {
                    $group: {
                        _id: '$merchantID',
                        nRating: { $sum: '$totalReviews' },
                    },
                },
            ]);
            if (!totalMerchantReviews[0]) {
                totalMerchantReviews[0] = 0;
            }
            return {
                totalDeals: totalCount,
                totalMerchantReviews: totalMerchantReviews[0].nRating,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealsByMerchantID(merchantID, dealHeader, price, startDate, endDate, availableVoucher, soldVoucher, status, dateFrom, dateTo, offset, limit) {
        try {
            dateFrom = parseInt(dateFrom);
            dateTo = parseInt(dateTo);
            let dateToFilters = {};
            let dateFromFilters = {};
            let matchFilter = {};
            if (status) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { dealStatus: status });
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
                            startDate: Object.assign({}, dateFromFilters),
                        },
                        {
                            startDate: Object.assign({}, dateToFilters),
                        },
                    ] });
            }
            let sort = {};
            if (dealHeader) {
                let sortDealHeader = dealHeader == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('dealHeader');
                sort = Object.assign(Object.assign({}, sort), { dealHeader: sortDealHeader });
            }
            if (price) {
                let sortPrice = price == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('price');
                sort = Object.assign(Object.assign({}, sort), { price: sortPrice });
            }
            if (startDate) {
                let sortStartDate = startDate == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('startDate');
                sort = Object.assign(Object.assign({}, sort), { startDate: sortStartDate });
            }
            if (endDate) {
                let sortEndDate = endDate == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('endDate');
                sort = Object.assign(Object.assign({}, sort), { endDate: sortEndDate });
            }
            if (availableVoucher) {
                let sortAvailableVoucher = availableVoucher == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('availbleVoucher');
                sort = Object.assign(Object.assign({}, sort), { availableVoucher: sortAvailableVoucher });
            }
            if (soldVoucher) {
                let sortSoldVoucher = soldVoucher == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('soldVoucher');
                sort = Object.assign(Object.assign({}, sort), { soldVoucher: sortSoldVoucher });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            const totalCount = await this.dealModel.countDocuments(Object.assign({ merchantID: merchantID, deletedCheck: false }, matchFilter));
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: Object.assign({ merchantID: merchantID, deletedCheck: false }, matchFilter),
                },
                {
                    $sort: sort,
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalDeals: totalCount,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTopRatedDeals(merchantID) {
        try {
            const deals = this.dealModel
                .aggregate([
                {
                    $match: {
                        merchantID: merchantID,
                    },
                },
                {
                    $sort: {
                        ratingsAverage: -1,
                    },
                },
            ])
                .limit(5);
            return deals;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSalesStatistics(req) {
        const totalStats = {
            totalDeals: 0,
            scheduledDeals: 0,
            pendingDeals: 0,
            publishedDeals: 0,
        };
        const yearlyStats = {
            totalDeals: 0,
            scheduledDeals: 0,
            pendingDeals: 0,
            publishedDeals: 0,
        };
        const monthlyStats = [
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
            {
                totalDeals: 0,
                scheduledDeals: 0,
                pendingDeals: 0,
                publishedDeals: 0,
            },
        ];
        const currentDate = new Date();
        let totalDeals;
        let scheduledDeals;
        let pendingDeals;
        let publishedDeals;
        totalDeals = await this.dealModel
            .find({ merchantID: req.user.id, deletedCheck: false })
            .sort({ startDate: 1 });
        scheduledDeals = await this.dealModel
            .find({
            merchantID: req.user.id,
            dealStatus: dealstatus_enum_1.DEALSTATUS.scheduled,
            deletedCheck: false,
        })
            .sort({ startDate: 1 });
        pendingDeals = await this.dealModel
            .find({
            merchantID: req.user.id,
            dealStatus: dealstatus_enum_1.DEALSTATUS.inReview,
            deletedCheck: false,
        })
            .sort({ startDate: 1 });
        publishedDeals = await this.dealModel
            .find({
            merchantID: req.user.id,
            deletedCheck: false,
            dealStatus: dealstatus_enum_1.DEALSTATUS.published,
        })
            .sort({ startDate: 1 });
        totalDeals.forEach((data) => {
            let currentDocDate = new Date(data.startDate);
            totalStats.totalDeals = totalStats.totalDeals + 1;
            if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
                monthlyStats[currentDocDate.getMonth()].totalDeals =
                    monthlyStats[currentDocDate.getMonth()].totalDeals + 1;
            }
        });
        scheduledDeals.forEach((data) => {
            let currentDocDate = new Date(data.createdAt);
            totalStats.scheduledDeals = totalStats.scheduledDeals + 1;
            if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
                monthlyStats[currentDocDate.getMonth()].scheduledDeals =
                    monthlyStats[currentDocDate.getMonth()].scheduledDeals + 1;
            }
        });
        pendingDeals.forEach((data) => {
            let currentDocDate = new Date(data.createdAt);
            totalStats.pendingDeals = totalStats.pendingDeals + 1;
            if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
                monthlyStats[currentDocDate.getMonth()].pendingDeals =
                    monthlyStats[currentDocDate.getMonth()].pendingDeals + 1;
            }
        });
        publishedDeals.forEach((data) => {
            let currentDocDate = new Date(data.createdAt);
            totalStats.publishedDeals = totalStats.publishedDeals + 1;
            if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
                monthlyStats[currentDocDate.getMonth()].publishedDeals =
                    monthlyStats[currentDocDate.getMonth()].publishedDeals + 1;
            }
        });
        for (let i = 0; i < monthlyStats.length; i++) {
            yearlyStats.totalDeals =
                yearlyStats.totalDeals + monthlyStats[i].totalDeals;
            yearlyStats.scheduledDeals =
                yearlyStats.scheduledDeals + monthlyStats[i].scheduledDeals;
            yearlyStats.pendingDeals =
                yearlyStats.pendingDeals + monthlyStats[i].pendingDeals;
            yearlyStats.publishedDeals =
                yearlyStats.publishedDeals + monthlyStats[i].publishedDeals;
        }
        return {
            monthlyStats,
            yearlyStats,
            totalStats,
        };
    }
};
DealService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Deal')),
    __param(1, (0, mongoose_1.InjectModel)('Category')),
    __param(2, (0, mongoose_1.InjectModel)('Counter')),
    __param(3, (0, mongoose_1.InjectModel)('SubCategory')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DealService);
exports.DealService = DealService;
//# sourceMappingURL=deal.service.js.map