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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dealstatus_enum_1 = require("../../enum/deal/dealstatus.enum");
const utils_1 = require("../file-management/utils/utils");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const ratingValue_enum_1 = require("../../enum/review/ratingValue.enum");
const axios_1 = require("axios");
const schedule_service_1 = require("../schedule/schedule.service");
const stripe_service_1 = require("../stripe/stripe.service");
const voucherstatus_enum_1 = require("../../enum/voucher/voucherstatus.enum");
const billingStatus_enum_1 = require("../../enum/billing/billingStatus.enum");
const vouchers_service_1 = require("../vouchers/vouchers.service");
const nodemailer = require("nodemailer");
const emailHtml_1 = require("./email/emailHtml");
const views_service_1 = require("../views/views.service");
const affiliate_enum_1 = require("../../enum/affiliate/affiliate.enum");
const merchant_enum_1 = require("../../enum/merchant/merchant.enum");
const categoryapisorting_enum_1 = require("../../enum/sort/categoryapisorting.enum");
let transporter;
let DealService = class DealService {
    constructor(dealModel, preComputedDealModel, cacheManager, categorymodel, voucherCounterModel, subCategoryModel, _userModel, _scheduleModel, _viewsModel, reviewModel, _scheduleService, _stripeService, _voucherService, viewsService) {
        this.dealModel = dealModel;
        this.preComputedDealModel = preComputedDealModel;
        this.cacheManager = cacheManager;
        this.categorymodel = categorymodel;
        this.voucherCounterModel = voucherCounterModel;
        this.subCategoryModel = subCategoryModel;
        this._userModel = _userModel;
        this._scheduleModel = _scheduleModel;
        this._viewsModel = _viewsModel;
        this.reviewModel = reviewModel;
        this._scheduleService = _scheduleService;
        this._stripeService = _stripeService;
        this._voucherService = _voucherService;
        this.viewsService = viewsService;
    }
    onModuleInit() {
        transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'noreplydivideals@gmail.com',
                pass: 'eyccuiqvdskyaknn',
            },
        });
    }
    async generateVoucherId(sequenceName) {
        const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
            $inc: {
                sequenceValue: 1,
            },
        }, { new: true });
        const year = new Date().getFullYear() % 2000;
        return `DBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${sequenceDocument.sequenceValue < 10000 ? '0' : ''}${sequenceDocument.sequenceValue}`;
    }
    async createDeal(dealDto, req) {
        var e_1, _a;
        var _b;
        try {
            var dealVouchers = 0;
            var dealSoldVouchers = 0;
            let savedDeal = null;
            if (dealDto.id) {
                savedDeal = await this.dealModel.findById(dealDto.id);
            }
            if (dealDto.subCategory) {
                let subCategory = await this.subCategoryModel.findOne({
                    subCategoryName: dealDto.subCategory,
                });
                dealDto.subCategoryID = subCategory.id;
                dealDto.categoryName = subCategory.categoryName;
                dealDto.categoryID = subCategory.categoryID;
            }
            if (!savedDeal) {
                dealDto.dealID = await this.generateVoucherId('dealID');
            }
            if (dealDto.startDate && dealDto.endDate) {
                let stamp = new Date(dealDto.startDate).setUTCHours(0, 0, 0, 0);
                dealDto.startDate = stamp;
                stamp = new Date(dealDto.endDate).setUTCHours(23, 59, 59, 0);
                dealDto.endDate = stamp;
            }
            if (!savedDeal) {
                dealDto.dealHeader = dealDto === null || dealDto === void 0 ? void 0 : dealDto.dealHeader;
                dealDto.merchantID = req.user.userID;
                dealDto.merchantMongoID = req.user.id;
                if (dealDto.dealStatus) {
                    dealDto.dealStatus = dealstatus_enum_1.DEALSTATUS.inReview;
                }
                if (dealDto.dealStatus == 'Draft' || dealDto.isDuplicate == true) {
                    dealDto.dealStatus = dealstatus_enum_1.DEALSTATUS.draft;
                }
                if (!dealDto.dealStatus) {
                    dealDto.dealStatus = dealstatus_enum_1.DEALSTATUS.draft;
                }
            }
            if (dealDto.subDeals) {
                let num = 1;
                dealDto.subDeals = dealDto.subDeals.map((el) => {
                    let startTime;
                    let endTime;
                    if (el.originalPrice !== 0 || el.dealPrice !== 0) {
                        let calculateDiscountPercentage = ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
                        el.discountPercentage = calculateDiscountPercentage;
                    }
                    else if (el.originalPrice == 0 && el.dealPrice == 0) {
                        el.discountPercentage = 0;
                    }
                    dealVouchers += el.numberOfVouchers;
                    el.soldVouchers = 0;
                    el.grossEarning = 0;
                    el.netEarning = 0;
                    if (el.voucherValidity > 0) {
                        startTime = 0;
                        endTime = 0;
                    }
                    else {
                        startTime = new Date(el.voucherStartDate).setUTCHours(0, 0, 0, 0);
                        endTime = new Date(el.voucherEndDate).setUTCHours(23, 59, 59, 0);
                    }
                    el.originalPrice = parseFloat(el.originalPrice);
                    el.dealPrice = parseFloat(el.dealPrice);
                    el.numberOfVouchers = parseInt(el.numberOfVouchers);
                    el._id = (0, utils_1.generateStringId)();
                    if (savedDeal) {
                        el.subDealID = savedDeal.dealID + '-' + num++;
                    }
                    else {
                        el.subDealID = dealDto.dealID + '-' + num++;
                    }
                    el.voucherStartDate = startTime;
                    el.voucherEndDate = endTime;
                    return el;
                });
            }
            let minVoucher = (_b = dealDto.subDeals) === null || _b === void 0 ? void 0 : _b.sort((a, b) => (a === null || a === void 0 ? void 0 : a.dealPrice) - (b === null || b === void 0 ? void 0 : b.dealPrice))[0];
            dealDto.minDealPrice = minVoucher === null || minVoucher === void 0 ? void 0 : minVoucher.dealPrice;
            dealDto.minOriginalPrice = minVoucher === null || minVoucher === void 0 ? void 0 : minVoucher.originalPrice;
            dealDto.minDiscountPercentage = minVoucher === null || minVoucher === void 0 ? void 0 : minVoucher.discountPercentage;
            if (dealDto.mediaUrl && dealDto.mediaUrl.length) {
                dealDto['type'] = dealDto.mediaUrl[0].type;
                dealDto['captureFileURL'] = dealDto.mediaUrl[0].captureFileURL;
                dealDto['path'] = dealDto.mediaUrl[0].path;
                if (dealDto['type'] == 'Video') {
                    dealDto['thumbnailURL'] = dealDto.mediaUrl[0].thumbnailURL;
                    dealDto['thumbnailPath'] = dealDto.mediaUrl[0].thumbnailPath;
                }
                if (dealDto.mediaUrl) {
                    for (let i = 0; i < dealDto.mediaUrl.length; i++) {
                        if (dealDto.mediaUrl[i].type == 'Video') {
                            console.log('Inside if');
                            var item = dealDto.mediaUrl.splice(i, 1);
                            dealDto.mediaUrl.splice(0, 0, item[0]);
                        }
                    }
                }
                try {
                    for (var _c = __asyncValues(dealDto.mediaUrl), _d; _d = await _c.next(), !_d.done;) {
                        let mediaObj = _d.value;
                        await new Promise(async (resolve, reject) => {
                            try {
                                let urlMedia = '';
                                if (mediaObj.type == 'Video') {
                                    urlMedia = mediaObj.thumbnailURL;
                                }
                                else {
                                    urlMedia = mediaObj.captureFileURL;
                                }
                                mediaObj['blurHash'] = await (0, utils_1.encodeImageToBlurhash)(urlMedia);
                                let data = (mediaObj['backgroundColorHex'] =
                                    await (0, utils_1.getDominantColor)(urlMedia));
                                mediaObj['backgroundColorHex'] = data.hexCode;
                                resolve({});
                            }
                            catch (err) {
                                console.log('Error', err);
                                reject(err);
                            }
                        });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) await _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            dealDto.availableVouchers = dealVouchers;
            dealDto.soldVouchers = dealSoldVouchers;
            dealDto.isCollapsed = false;
            if (!savedDeal) {
                const deal = await this.dealModel.create(dealDto);
                let dealurl = `${process.env.customerPanelURL}/preview/${deal._id}`;
                let editUrl = `${process.env.merchantPanelURL}/editDeal/${deal._id}`;
                await this.dealModel.updateOne({ _id: deal._id }, { dealPreviewURL: dealurl, editDealURL: editUrl });
                return deal;
            }
            dealDto === null || dealDto === void 0 ? true : delete dealDto.dealPreviewURL;
            dealDto === null || dealDto === void 0 ? true : delete dealDto.editDealURL;
            await this.dealModel.updateOne({ _id: dealDto.id }, dealDto);
            let returnedDeal = await this.dealModel.findOne({ _id: dealDto.id });
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${returnedDeal.dealID}`);
            return returnedDeal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealByID(dealID) {
        try {
            let statuses = {
                Draft: 'Draft',
                'In review': 'Review Required',
                'Needs attention': 'Merchant Action Requested',
                Scheduled: 'Scheduled',
                Published: 'Published',
                Rejected: 'Rejected',
                Expired: 'Expired',
            };
            let deal = await this.dealModel.findOne({ dealID: dealID });
            if (!deal) {
                throw new Error('No deal Found!');
            }
            deal = JSON.parse(JSON.stringify(deal));
            let coverImageUrl = '';
            deal === null || deal === void 0 ? void 0 : deal.mediaUrl.forEach((el) => {
                if (el.type == 'Image' && coverImageUrl == '') {
                    coverImageUrl = el.captureFileURL;
                }
            });
            if ((deal === null || deal === void 0 ? void 0 : deal.subDeals.length) > 0) {
                deal.voucherValidity = deal === null || deal === void 0 ? void 0 : deal.subDeals[0].voucherValidity;
                deal.voucherStartDate = deal === null || deal === void 0 ? void 0 : deal.subDeals[0].voucherStartDate;
                deal.voucherEndDate = deal === null || deal === void 0 ? void 0 : deal.subDeals[0].voucherEndDate;
            }
            deal.publishStartDate = deal === null || deal === void 0 ? void 0 : deal.startDate;
            deal.publishEndDate = deal === null || deal === void 0 ? void 0 : deal.endDate;
            deal.coverImageUrl = coverImageUrl;
            deal.dealStatus = statuses[deal.dealStatus];
            deal === null || deal === void 0 ? true : delete deal.mediaUrl;
            deal === null || deal === void 0 ? true : delete deal.merchantMongoID;
            deal === null || deal === void 0 ? true : delete deal.categoryID;
            deal === null || deal === void 0 ? true : delete deal.subCategoryID;
            deal === null || deal === void 0 ? true : delete deal.highlights;
            deal === null || deal === void 0 ? true : delete deal.reviewMediaUrl;
            deal === null || deal === void 0 ? true : delete deal.ratingsAverage;
            deal === null || deal === void 0 ? true : delete deal.totalReviews;
            deal === null || deal === void 0 ? true : delete deal.maxRating;
            deal === null || deal === void 0 ? true : delete deal.minRating;
            deal === null || deal === void 0 ? true : delete deal.pageNumber;
            deal === null || deal === void 0 ? true : delete deal.deletedCheck;
            deal === null || deal === void 0 ? true : delete deal.isCollapsed;
            deal === null || deal === void 0 ? true : delete deal.isDuplicate;
            deal === null || deal === void 0 ? true : delete deal.isSpecialOffer;
            deal === null || deal === void 0 ? true : delete deal.netEarnings;
            deal === null || deal === void 0 ? true : delete deal.finePrints;
            deal === null || deal === void 0 ? true : delete deal.readMore;
            deal === null || deal === void 0 ? true : delete deal.minDiscountPercentage;
            deal === null || deal === void 0 ? true : delete deal.minOriginalPrice;
            deal === null || deal === void 0 ? true : delete deal.minDealPrice;
            deal === null || deal === void 0 ? true : delete deal.aboutThisDeal;
            deal === null || deal === void 0 ? true : delete deal.id;
            deal === null || deal === void 0 ? true : delete deal.createdAt;
            deal === null || deal === void 0 ? true : delete deal.updatedAt;
            deal === null || deal === void 0 ? true : delete deal.endDate;
            deal === null || deal === void 0 ? true : delete deal.startDate;
            deal === null || deal === void 0 ? void 0 : deal.subDeals.forEach((el) => {
                delete el._id;
                el.publishStartDate = deal === null || deal === void 0 ? void 0 : deal.publishStartDate;
                el.publishEndDate = deal === null || deal === void 0 ? void 0 : deal.publishEndDate;
                el.subCategory = deal === null || deal === void 0 ? void 0 : deal.subCategory;
                el.categoryName = deal === null || deal === void 0 ? void 0 : deal.categoryName;
                el.voucherTitle = el === null || el === void 0 ? void 0 : el.title;
                delete el.title;
                el.availableVouchers = el.numberOfVouchers;
                el === null || el === void 0 ? true : delete el.numberOfVouchers;
                el === null || el === void 0 ? true : delete el.grossEarning;
                el === null || el === void 0 ? true : delete el.netEarning;
            });
            deal === null || deal === void 0 ? true : delete deal.availableVouchers;
            deal === null || deal === void 0 ? true : delete deal.soldVouchers;
            if (!deal.dealPreviewURL) {
                deal.dealPreviewURL = '';
            }
            if (!deal.editDealURL) {
                deal.editDealURL = '';
            }
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateDealByID(updateDealDto) {
        try {
            let statuses = {
                Draft: 'Draft',
                'Review Required': 'In review',
                'Merchant Action Requested': 'Needs attention',
                Scheduled: 'Scheduled',
                Published: 'Published',
                Rejected: 'Rejected',
                Expired: 'Expired',
            };
            let deal = await this.dealModel.findOne({
                dealID: updateDealDto.dealID,
            });
            if (!deal) {
                throw new Error('No deal Found!');
            }
            if (updateDealDto.status) {
                deal.dealStatus = statuses[updateDealDto.status];
                if (updateDealDto.status == 'Rejected') {
                    let scheduledDeal = await this._scheduleModel.findOne({
                        dealID: deal.dealID,
                        status: 0,
                    });
                    if (scheduledDeal) {
                        this._scheduleService.cancelJob(scheduledDeal.id);
                    }
                }
                if (updateDealDto.status == 'Scheduled') {
                    if (deal.startDate <= Date.now()) {
                        deal.dealStatus = statuses['Published'];
                        this._scheduleService.scheduleDeal({
                            scheduleDate: new Date(deal.endDate),
                            status: 0,
                            type: 'expireDeal',
                            dealID: deal.dealID,
                            deletedCheck: false,
                        });
                    }
                    else {
                        this._scheduleService.scheduleDeal({
                            scheduleDate: new Date(deal.startDate),
                            status: 0,
                            type: 'publishDeal',
                            dealID: deal.dealID,
                            deletedCheck: false,
                        });
                    }
                    if (deal.endDate <= Date.now()) {
                        deal.dealStatus = statuses['Expired'];
                    }
                }
            }
            let dealVouchers = 0;
            deal.subDeals = deal.subDeals.map((element) => {
                if (updateDealDto.subDealID) {
                    if (updateDealDto.subDealID === element['subDealID']) {
                        if (updateDealDto.quantityAvailable) {
                            element.numberOfVouchers = updateDealDto.quantityAvailable;
                        }
                    }
                }
                if (updateDealDto.availabilityDays) {
                    element.voucherValidity = updateDealDto.availabilityDays;
                    element.voucherStartDate = 0;
                    element.voucherEndDate = 0;
                }
                if (updateDealDto.availabilityToDate) {
                    if (element.voucherStartDate == 0) {
                        element.voucherStartDate = deal.startDate;
                    }
                    element.voucherEndDate = updateDealDto.availabilityToDate;
                    if (updateDealDto.availabilityToDate > deal.endDate) {
                        deal.endDate = updateDealDto.availabilityToDate;
                    }
                    element.voucherValidity = 0;
                    if (element.voucherEndDate < element.voucherStartDate) {
                        throw new Error('Voucher End Date can not be smaller than voucher start date!');
                    }
                }
                dealVouchers += element.numberOfVouchers;
                return element;
            });
            deal.availableVouchers = dealVouchers;
            await this.dealModel.updateOne({ dealID: updateDealDto.dealID }, deal);
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${deal.dealID}`);
            return { message: 'Deal Updated Successfully' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateDeal(updateDealDto, dealID) {
        try {
            updateDealDto.subDeals = [updateDealDto.subDeals];
            const deal = await this.dealModel.findById(dealID);
            let dealVouchers = 0;
            deal.subDeals = deal.subDeals.map((element) => {
                updateDealDto.subDeals.forEach((el) => {
                    let calculateDiscountPercentage = ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
                    el.discountPercentage = calculateDiscountPercentage;
                    if (el['voucherID'] === element['_id']) {
                        element.numberOfVouchers = parseInt(el.numberOfVouchers);
                        element.title = el.title;
                        element.originalPrice = parseFloat(el.originalPrice);
                        element.dealPrice = parseFloat(el.dealPrice);
                        element.discountPercentage = calculateDiscountPercentage;
                    }
                });
                dealVouchers += element.numberOfVouchers;
                return element;
            });
            deal.availableVouchers = dealVouchers;
            await this.dealModel.findByIdAndUpdate(dealID, deal);
            return { message: 'Deal Updated Successfully' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approveRejectDeal(dealID, dealStatusDto) {
        try {
            let deal = await this.dealModel.findOne({
                _id: dealID,
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.inReview,
            });
            if (dealStatusDto.dealStatus == dealstatus_enum_1.DEALSTATUS.scheduled) {
                return await this.dealModel.updateOne({ _id: deal.id }, { dealStatus: dealstatus_enum_1.DEALSTATUS.scheduled });
            }
            else if (dealStatusDto.dealStatus == dealstatus_enum_1.DEALSTATUS.expired) {
                return await this.dealModel.updateOne({ _id: deal.id }, { dealStatus: dealstatus_enum_1.DEALSTATUS.expired });
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
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
    async getDeal(id, req) {
        try {
            let deal = await this.dealModel
                .aggregate([
                {
                    $match: {
                        _id: id,
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
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
                .then((items) => items[0]);
            if (!deal) {
                throw new common_1.HttpException('Deal not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            let viewsDto = {
                dealMongoID: deal.id,
                dealID: deal.dealID,
                customerMongoID: req.user.id,
                customerID: req.user.userID,
                viewedTime: new Date().getTime(),
            };
            await this.viewsService.createDealView(viewsDto, '');
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealForMerchantPanel(dealMongoID) {
        try {
            let deal = await this.dealModel
                .aggregate([
                {
                    $match: {
                        _id: dealMongoID,
                        deletedCheck: false,
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
                .then((items) => items[0]);
            if (!deal) {
                throw new common_1.HttpException('Deal not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealReviews(offset, limit, rating, id, createdAt, totalRating) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalReviewCount = await this.reviewModel.countDocuments({
                dealMongoID: id,
            });
            let rating1, rating2, rating3, rating4, rating5;
            rating1 = await this.reviewModel.countDocuments({
                dealMongoID: id,
                $and: [{ totalRating: { $gte: 1 } }, { totalRating: { $lt: 2 } }],
            });
            rating2 = await this.reviewModel.countDocuments({
                dealMongoID: id,
                $and: [{ totalRating: { $gte: 2 } }, { totalRating: { $lt: 3 } }],
            });
            rating3 = await this.reviewModel.countDocuments({
                dealMongoID: id,
                $and: [{ totalRating: { $gte: 3 } }, { totalRating: { $lt: 4 } }],
            });
            rating4 = await this.reviewModel.countDocuments({
                dealMongoID: id,
                $and: [{ totalRating: { $gte: 4 } }, { totalRating: { $lt: 5 } }],
            });
            rating5 = await this.reviewModel.countDocuments({
                dealMongoID: id,
                $and: [{ totalRating: { $gte: 5 } }],
            });
            rating1 = (rating1 / totalReviewCount) * 100;
            rating2 = (rating2 / totalReviewCount) * 100;
            rating3 = (rating3 / totalReviewCount) * 100;
            rating4 = (rating4 / totalReviewCount) * 100;
            rating5 = (rating5 / totalReviewCount) * 100;
            let calculatedReviewCount;
            if (totalReviewCount > 0) {
                calculatedReviewCount = [
                    { rating: rating5 },
                    { rating: rating4 },
                    { rating: rating3 },
                    { rating: rating2 },
                    { rating: rating1 },
                ];
            }
            else {
                calculatedReviewCount = [
                    { rating: 0 },
                    { rating: 0 },
                    { rating: 0 },
                    { rating: 0 },
                    { rating: 0 },
                ];
            }
            let ratingFilter = {};
            if (rating) {
                ratingFilter = {
                    eq: ['$rating', parseInt(rating)],
                };
            }
            else {
                ratingFilter = Object.assign(Object.assign({}, ratingFilter), { eq: ['', ''] });
            }
            let sort = {};
            if (createdAt) {
                let sortCreatedAt = createdAt == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('createdAt');
                sort = Object.assign(Object.assign({}, sort), { createdAt: sortCreatedAt });
            }
            if (totalRating) {
                let sortRating = totalRating == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('totalRating');
                sort = Object.assign(Object.assign({}, sort), { totalRating: sortRating });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
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
                        dealID: 1,
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
                            dealMongoID: id,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$dealMongoID', '$$dealMongoID'],
                                            },
                                            {
                                                $eq: ratingFilter['eq'],
                                            },
                                        ],
                                    },
                                    isViewed: true,
                                },
                            },
                            {
                                $sort: sort,
                            },
                            {
                                $lookup: {
                                    from: 'reviewText',
                                    as: 'merchantReplyText',
                                    localField: '_id',
                                    foreignField: 'reviewID',
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
            deal['calculatedReviewCount'] = calculatedReviewCount;
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteDeal(dealID) {
        try {
            const deal = await this.dealModel.findByIdAndUpdate(dealID, {
                deletedCheck: true,
            });
            if (!deal) {
                throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.BAD_REQUEST);
            }
            return { status: 'success', message: 'Deal deleted successfully!' };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealsReviewStatsByMerchant(id, dealID, offset, limit, multipleReviewsDto) {
        var _a;
        offset = parseInt(offset) < 0 ? 0 : offset;
        limit = parseInt(limit) < 1 ? 10 : limit;
        try {
            let matchFilter = {};
            if (dealID.trim().length) {
                var query = new RegExp(`${dealID}`, 'i');
                matchFilter = Object.assign(Object.assign({}, matchFilter), { dealID: query });
            }
            let filters = {};
            let averageRating = 'All';
            if (multipleReviewsDto === null || multipleReviewsDto === void 0 ? void 0 : multipleReviewsDto.ratingsArray.length) {
                averageRating = multipleReviewsDto === null || multipleReviewsDto === void 0 ? void 0 : multipleReviewsDto.ratingsArray[0];
            }
            let minValue = 1;
            if (averageRating) {
                switch (averageRating) {
                    case ratingValue_enum_1.RATINGENUM.range1:
                        minValue = 1;
                        break;
                    case ratingValue_enum_1.RATINGENUM.range2:
                        minValue = 2;
                        break;
                    case ratingValue_enum_1.RATINGENUM.range3:
                        minValue = 3;
                        break;
                    case ratingValue_enum_1.RATINGENUM.range4:
                        minValue = 4;
                        break;
                    case ratingValue_enum_1.RATINGENUM.range5:
                        minValue = 5;
                        break;
                    default:
                        minValue = 1;
                        break;
                }
            }
            console.log(minValue);
            console.log(averageRating);
            if (averageRating !== ratingValue_enum_1.RATINGENUM.all) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { ratingsAverage: {
                        $gte: minValue,
                    } });
            }
            if ((_a = multipleReviewsDto === null || multipleReviewsDto === void 0 ? void 0 : multipleReviewsDto.dealIDsArray) === null || _a === void 0 ? void 0 : _a.length) {
                filters = Object.assign(Object.assign({}, filters), { dealID: { $in: multipleReviewsDto.dealIDsArray } });
            }
            const totalCount = await this.dealModel.countDocuments({
                merchantMongoID: id,
                deletedCheck: false,
            });
            const filteredDealCount = await this.dealModel.countDocuments(Object.assign(Object.assign({ merchantMongoID: id, deletedCheck: false }, matchFilter), filters));
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign(Object.assign({ merchantMongoID: id, deletedCheck: false }, matchFilter), filters), { totalReviews: { $gt: 0 } }),
                },
                {
                    $project: {
                        dealHeader: 1,
                        dealID: 1,
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
                    $match: Object.assign({ merchantMongoID: id, deletedCheck: false }, matchFilter),
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
            const merchant = await this._userModel.findOne({ _id: id });
            return {
                totalDeals: totalCount,
                filteredDealCount,
                overallRating: merchant.ratingsAverage,
                totalMerchantReviews: totalMerchantReviews[0].nRating,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealsByMerchantID(merchantID, dealHeader, price, startDate, endDate, availableVoucher, soldVoucher, status, dateFrom, dateTo, dealID, header, dealStatus, offset, limit, multipleDealsDto) {
        var _a, _b, _c;
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
            dealID = dealID.trim();
            header = header.trim();
            dealStatus = dealStatus.trim();
            let filters = {};
            if (dealID.trim().length) {
                var query = new RegExp(`${dealID}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { dealID: query });
            }
            if (header.trim().length) {
                var query = new RegExp(`${header}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { dealHeader: query });
            }
            if (dealStatus.trim().length) {
                var query = new RegExp(`${dealStatus}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { dealStatus: query });
            }
            if ((_a = multipleDealsDto === null || multipleDealsDto === void 0 ? void 0 : multipleDealsDto.dealIDsArray) === null || _a === void 0 ? void 0 : _a.length) {
                filters = Object.assign(Object.assign({}, filters), { dealID: { $in: multipleDealsDto.dealIDsArray } });
            }
            if ((_b = multipleDealsDto === null || multipleDealsDto === void 0 ? void 0 : multipleDealsDto.dealHeaderArray) === null || _b === void 0 ? void 0 : _b.length) {
                filters = Object.assign(Object.assign({}, filters), { dealHeader: { $in: multipleDealsDto.dealHeaderArray } });
            }
            if ((_c = multipleDealsDto === null || multipleDealsDto === void 0 ? void 0 : multipleDealsDto.dealStatusArray) === null || _c === void 0 ? void 0 : _c.length) {
                filters = Object.assign(Object.assign({}, filters), { dealStatus: { $in: multipleDealsDto.dealStatusArray } });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            const totalCount = await this.dealModel.countDocuments(Object.assign({ merchantMongoID: merchantID, deletedCheck: false }, matchFilter));
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({ merchantMongoID: merchantID, deletedCheck: false }, matchFilter), filters),
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
                totalDeals: totalCount,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealsByMerchantIDForCustomerPanel(merchantID, offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.dealModel.countDocuments({
                merchantMongoID: merchantID,
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
            });
            const mercahntDeals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        merchantMongoID: merchantID,
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                data: mercahntDeals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTopRatedDeals(merchantID) {
        try {
            const deals = this.dealModel
                .aggregate([
                {
                    $match: {
                        merchantMongoID: merchantID,
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
    async getLowPriceDeals(price, offset, limit, req) {
        var _a, _b;
        try {
            price = parseFloat(price);
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let totalCount;
            let priceIncrease = 10;
            do {
                priceIncrease += 10;
                totalCount = await this.dealModel.countDocuments({
                    deletedCheck: false,
                    dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                    subDeals: { $elemMatch: { dealPrice: { $lt: price } } },
                });
                if (price > 150) {
                    break;
                }
                price = price + priceIncrease;
            } while (totalCount < 6);
            price = price - priceIncrease;
            let filterValue = price;
            let deals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        subDeals: {
                            $elemMatch: { dealPrice: { $lt: price } },
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            if (deals === null || deals === void 0 ? void 0 : deals.length) {
                const updatedFilterValue = Math.ceil(((_b = deals === null || deals === void 0 ? void 0 : deals.sort((a, b) => (b === null || b === void 0 ? void 0 : b.minDealPrice) - (a === null || a === void 0 ? void 0 : a.minDealPrice))[0]) === null || _b === void 0 ? void 0 : _b.minDealPrice) / 10) * 10;
                filterValue = updatedFilterValue;
            }
            return {
                filterValue,
                totalCount: totalCount,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getNewDeals(offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const value = await this.cacheManager.get(`getNewDeals${offset}${limit}`);
            let totalCount;
            let deals;
            if (!value) {
                totalCount = await this.dealModel.countDocuments({
                    deletedCheck: false,
                    dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                });
                deals = await this.dealModel
                    .aggregate([
                    {
                        $match: {
                            deletedCheck: false,
                            dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        },
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                    {
                        $lookup: {
                            from: 'favourites',
                            as: 'favouriteDeal',
                            let: {
                                dealID: '$dealID',
                                customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                                deletedCheck: '$deletedCheck',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ['$$dealID', '$dealID'],
                                                },
                                                {
                                                    $eq: ['$$customerMongoID', '$customerMongoID'],
                                                },
                                                {
                                                    $eq: ['$deletedCheck', false],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: '$favouriteDeal',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: 'merchantDetails',
                            let: {
                                userID: '$merchantID',
                                deletedCheck: '$deletedCheck',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ['$$userID', '$userID'],
                                                },
                                                {
                                                    $eq: ['$deletedCheck', false],
                                                },
                                            ],
                                        },
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
                                        id: 1,
                                        totalReviews: 1,
                                        ratingsAverage: 1,
                                        legalName: 1,
                                        city: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: '$merchantDetails',
                    },
                    {
                        $addFields: {
                            id: '$_id',
                            mediaUrl: {
                                $slice: [
                                    {
                                        $filter: {
                                            input: '$mediaUrl',
                                            as: 'mediaUrl',
                                            cond: {
                                                $eq: ['$$mediaUrl.type', 'Image'],
                                            },
                                        },
                                    },
                                    1,
                                ],
                            },
                            isFavourite: {
                                $cond: [
                                    {
                                        $ifNull: ['$favouriteDeal', false],
                                    },
                                    true,
                                    false,
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            merchantMongoID: 0,
                            merchantID: 0,
                            subTitle: 0,
                            categoryName: 0,
                            subCategoryID: 0,
                            subCategory: 0,
                            subDeals: 0,
                            availableVouchers: 0,
                            aboutThisDeal: 0,
                            readMore: 0,
                            finePrints: 0,
                            netEarnings: 0,
                            isCollapsed: 0,
                            isDuplicate: 0,
                            totalReviews: 0,
                            maxRating: 0,
                            minRating: 0,
                            pageNumber: 0,
                            updatedAt: 0,
                            __v: 0,
                            endDate: 0,
                            startDate: 0,
                            reviewMediaUrl: 0,
                        },
                    },
                ])
                    .skip(parseInt(offset))
                    .limit(parseInt(limit));
                await this.cacheManager.set(`getNewDeals${offset}${limit}`, {
                    totalCount: totalCount,
                    data: deals,
                }, { ttl: 1000 });
                return {
                    totalCount: totalCount,
                    data: deals,
                };
            }
            return value;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDiscountedDeals(percentage, offset, limit, req) {
        var _a, _b;
        try {
            percentage = parseFloat(percentage);
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let totalCount;
            do {
                totalCount = await this.dealModel.countDocuments({
                    deletedCheck: false,
                    dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                    subDeals: {
                        $elemMatch: { discountPercentage: { $lte: percentage } },
                    },
                });
                percentage += 10;
                if (percentage > 95) {
                    break;
                }
            } while (totalCount < 6);
            percentage = percentage - 10;
            let filterValue = percentage;
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        subDeals: {
                            $elemMatch: { discountPercentage: { $lte: percentage } },
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            if (deals === null || deals === void 0 ? void 0 : deals.length) {
                const updatedFilterValue = Math.ceil(((_b = deals === null || deals === void 0 ? void 0 : deals.sort((a, b) => (b === null || b === void 0 ? void 0 : b.minDiscountPercentage) - (a === null || a === void 0 ? void 0 : a.minDiscountPercentage))[0]) === null || _b === void 0 ? void 0 : _b.minDiscountPercentage) / 10) * 10;
                filterValue = updatedFilterValue;
            }
            return {
                filterValue,
                totalCount: totalCount,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getHotDeals(offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const value = await this.cacheManager.get(`getHotDeals${offset}${limit}`);
            let totalCount;
            let deals;
            if (!value) {
                totalCount = await this.dealModel.countDocuments({
                    deletedCheck: false,
                    dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                    availableVouchers: { $gt: 0 },
                    soldVouchers: { $gt: 0 },
                });
                deals = await this.dealModel
                    .aggregate([
                    {
                        $match: {
                            deletedCheck: false,
                            dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                            availableVouchers: { $gt: 0 },
                            soldVouchers: { $gt: 0 },
                        },
                    },
                    {
                        $addFields: {
                            id: '$_id',
                            added: { $add: ['$soldVouchers', '$availableVouchers'] },
                        },
                    },
                    {
                        $addFields: {
                            divided: { $divide: ['$soldVouchers', '$added'] },
                            percent: {
                                $multiply: ['$divided', 100],
                            },
                        },
                    },
                    {
                        $addFields: {
                            percent: {
                                $multiply: ['$divided', 100],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: 'favourites',
                            as: 'favouriteDeal',
                            let: {
                                dealID: '$dealID',
                                customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                                deletedCheck: '$deletedCheck',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ['$$dealID', '$dealID'],
                                                },
                                                {
                                                    $eq: ['$$customerMongoID', '$customerMongoID'],
                                                },
                                                {
                                                    $eq: ['$deletedCheck', false],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: '$favouriteDeal',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: 'merchantDetails',
                            let: {
                                userID: '$merchantID',
                                deletedCheck: '$deletedCheck',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ['$$userID', '$userID'],
                                                },
                                                {
                                                    $eq: ['$deletedCheck', false],
                                                },
                                            ],
                                        },
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
                                        id: 1,
                                        totalReviews: 1,
                                        ratingsAverage: 1,
                                        legalName: 1,
                                        city: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: '$merchantDetails',
                    },
                    {
                        $addFields: {
                            mediaUrl: {
                                $slice: [
                                    {
                                        $filter: {
                                            input: '$mediaUrl',
                                            as: 'mediaUrl',
                                            cond: {
                                                $eq: ['$$mediaUrl.type', 'Image'],
                                            },
                                        },
                                    },
                                    1,
                                ],
                            },
                            isFavourite: {
                                $cond: [
                                    {
                                        $ifNull: ['$favouriteDeal', false],
                                    },
                                    true,
                                    false,
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            added: 0,
                            divided: 0,
                            merchantMongoID: 0,
                            merchantID: 0,
                            subTitle: 0,
                            categoryName: 0,
                            subCategoryID: 0,
                            subCategory: 0,
                            subDeals: 0,
                            availableVouchers: 0,
                            aboutThisDeal: 0,
                            readMore: 0,
                            finePrints: 0,
                            netEarnings: 0,
                            isCollapsed: 0,
                            isDuplicate: 0,
                            totalReviews: 0,
                            maxRating: 0,
                            minRating: 0,
                            pageNumber: 0,
                            updatedAt: 0,
                            __v: 0,
                            endDate: 0,
                            startDate: 0,
                            reviewMediaUrl: 0,
                            favouriteDeal: 0,
                        },
                    },
                    {
                        $sort: {
                            percent: -1,
                        },
                    },
                ])
                    .skip(parseInt(offset))
                    .limit(parseInt(limit));
                await this.cacheManager.set(`getHotDeals${offset}${limit}`, {
                    totalCount: totalCount,
                    data: deals,
                }, { ttl: 1000 });
                return {
                    totalCount: totalCount,
                    data: deals,
                };
            }
            return value;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSpecialOfferDeals(offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.dealModel.countDocuments({
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                isSpecialOffer: true,
            });
            let deals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        isSpecialOffer: true,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
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
    async getNewFavouriteDeal(offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.dealModel.countDocuments({
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
            });
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                    },
                },
                {
                    $sample: { size: totalCount },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
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
    async getNearByDeals(lat, lng, distance, offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            if (!distance) {
                distance = 10;
            }
            let radius = parseFloat(distance) / 6378.1;
            if (!lat && !lng) {
                lat = 50.850346;
                lng = 4.351721;
                radius = 20 / 6378.1;
            }
            let deal;
            let isFound = false;
            while (!isFound) {
                deal = await this.dealModel
                    .aggregate([
                    {
                        $match: {
                            deletedCheck: false,
                            dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        },
                    },
                    {
                        $lookup: {
                            from: 'locations',
                            as: 'location',
                            localField: 'merchantID',
                            foreignField: 'merchantID',
                        },
                    },
                    {
                        $unwind: '$location',
                    },
                    {
                        $addFields: {
                            locationCoordinates: '$location.location',
                        },
                    },
                    {
                        $match: {
                            locationCoordinates: {
                                $geoWithin: {
                                    $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius],
                                },
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: 'favourites',
                            as: 'favouriteDeal',
                            let: {
                                dealID: '$dealID',
                                customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                                deletedCheck: '$deletedCheck',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ['$$dealID', '$dealID'],
                                                },
                                                {
                                                    $eq: ['$$customerMongoID', '$customerMongoID'],
                                                },
                                                {
                                                    $eq: ['$deletedCheck', false],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: {
                            path: '$favouriteDeal',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: 'merchantDetails',
                            let: {
                                userID: '$merchantID',
                                deletedCheck: '$deletedCheck',
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ['$$userID', '$userID'],
                                                },
                                                {
                                                    $eq: ['$deletedCheck', false],
                                                },
                                            ],
                                        },
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
                                        id: 1,
                                        totalReviews: 1,
                                        ratingsAverage: 1,
                                        legalName: 1,
                                        city: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $unwind: '$merchantDetails',
                    },
                    {
                        $addFields: {
                            id: '$_id',
                            mediaUrl: {
                                $slice: [
                                    {
                                        $filter: {
                                            input: '$mediaUrl',
                                            as: 'mediaUrl',
                                            cond: {
                                                $eq: ['$$mediaUrl.type', 'Image'],
                                            },
                                        },
                                    },
                                    1,
                                ],
                            },
                            isFavourite: {
                                $cond: [
                                    {
                                        $ifNull: ['$favouriteDeal', false],
                                    },
                                    true,
                                    false,
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            merchantMongoID: 0,
                            merchantID: 0,
                            subTitle: 0,
                            categoryName: 0,
                            subCategoryID: 0,
                            subCategory: 0,
                            subDeals: 0,
                            availableVouchers: 0,
                            aboutThisDeal: 0,
                            readMore: 0,
                            finePrints: 0,
                            netEarnings: 0,
                            isCollapsed: 0,
                            isDuplicate: 0,
                            totalReviews: 0,
                            maxRating: 0,
                            minRating: 0,
                            pageNumber: 0,
                            updatedAt: 0,
                            __v: 0,
                            endDate: 0,
                            startDate: 0,
                            reviewMediaUrl: 0,
                            favouriteDeal: 0,
                        },
                    },
                ])
                    .skip(parseInt(offset))
                    .limit(parseInt(limit));
                if (deal.length > 0) {
                    break;
                }
                if (lat == 33.5705073 && lng == 73.1434092) {
                    isFound = true;
                }
                lat = 33.5705073;
                lng = 73.1434092;
            }
            return deal;
        }
        catch (err) {
            console.log(err);
        }
    }
    async searchDeals(header, categoryName, subCategoryName, fromPrice, toPrice, reviewRating, offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            header = header.trim();
            let filters = {};
            if (header.trim().length) {
                var query = new RegExp(`${header}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { dealHeader: query });
            }
            let matchFilter = {};
            if (categoryName) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { categoryName: categoryName });
            }
            if (subCategoryName) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { subCategory: subCategoryName });
            }
            let minValue = parseInt(fromPrice);
            let maxValue = parseInt(toPrice);
            if (fromPrice && toPrice) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { minDealPrice: {
                        $gte: minValue,
                        $lte: maxValue,
                    } });
            }
            else if (fromPrice) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { minDealPrice: {
                        $gte: minValue,
                    } });
            }
            else if (toPrice) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { minDealPrice: {
                        $lte: maxValue,
                    } });
            }
            let rating = parseFloat(reviewRating);
            if (reviewRating) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { ratingsAverage: {
                        $gte: rating,
                    } });
            }
            const totalCount = await this.dealModel.countDocuments({
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
            });
            const filteredCount = await this.dealModel.countDocuments(Object.assign(Object.assign({ deletedCheck: false, dealStatus: dealstatus_enum_1.DEALSTATUS.published }, filters), matchFilter));
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({ deletedCheck: false, dealStatus: dealstatus_enum_1.DEALSTATUS.published }, filters), matchFilter),
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalDeals: totalCount,
                filteredDeals: filteredCount,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealsByCategories(categoryName, subCategoryName, fromPrice, toPrice, reviewRating, sorting, offset, limit, filterCategoriesApiDto, req) {
        var _a, _b, _c;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let matchFilter = {};
            if (categoryName) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { categoryName: categoryName });
            }
            if (subCategoryName) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { subCategory: subCategoryName });
            }
            let minValue = parseInt(fromPrice);
            let maxValue = parseInt(toPrice);
            if (fromPrice && toPrice) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { minDealPrice: {
                        $gte: minValue,
                        $lte: maxValue,
                    } });
            }
            else if (fromPrice) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { minDealPrice: {
                        $gte: minValue,
                    } });
            }
            else if (toPrice) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { minDealPrice: {
                        $lte: maxValue,
                    } });
            }
            let rating = parseFloat(reviewRating);
            if (reviewRating) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { ratingsAverage: {
                        $gte: rating,
                    } });
            }
            let sort = {};
            if (sorting) {
                let sortPrice = sorting == categoryapisorting_enum_1.SORTINGENUM.priceAsc ? 1 : -1;
                let sortRating = sorting == categoryapisorting_enum_1.SORTINGENUM.ratingAsc ? 1 : -1;
                let sortDate = sorting == categoryapisorting_enum_1.SORTINGENUM.dateAsc ? 1 : -1;
                console.log('sorting');
                sort = Object.assign(Object.assign({}, sort), { minDealPrice: sortPrice, ratingsAverage: sortRating, createdAt: sortDate });
            }
            let locationFilter = {};
            if ((_a = filterCategoriesApiDto === null || filterCategoriesApiDto === void 0 ? void 0 : filterCategoriesApiDto.provincesArray) === null || _a === void 0 ? void 0 : _a.length) {
                locationFilter = Object.assign(Object.assign({}, locationFilter), { province: { $in: filterCategoriesApiDto.provincesArray } });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            console.log(locationFilter);
            const totalCount = await this.dealModel.aggregate([
                {
                    $match: Object.assign({ deletedCheck: false, dealStatus: dealstatus_enum_1.DEALSTATUS.published }, matchFilter),
                },
                {
                    $sort: sort,
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                    province: 1
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        province: '$merchantDetails.province',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $match: Object.assign({}, locationFilter)
                },
                {
                    $count: 'totalCount'
                }
            ]);
            const deals = await this.dealModel
                .aggregate([
                {
                    $match: Object.assign({ deletedCheck: false, dealStatus: dealstatus_enum_1.DEALSTATUS.published }, matchFilter),
                },
                {
                    $sort: sort,
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                    province: 1
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        province: '$merchantDetails.province',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $match: Object.assign({}, locationFilter)
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalDeals: (totalCount === null || totalCount === void 0 ? void 0 : totalCount.length) > 0 ? totalCount[0].totalCount : 0,
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTrendingDeals(offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.dealModel.countDocuments({
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                availableVouchers: { $gt: 0 },
                soldVouchers: { $gt: 0 },
            });
            const trendingDeals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        availableVouchers: { $gt: 0 },
                        soldVouchers: { $gt: 0 },
                    },
                },
                {
                    $addFields: {
                        id: '$_id',
                        added: { $add: ['$soldVouchers', '$availableVouchers'] },
                    },
                },
                {
                    $addFields: {
                        divided: { $divide: ['$soldVouchers', '$added'] },
                        percent: {
                            $multiply: ['$divided', 100],
                        },
                    },
                },
                {
                    $addFields: {
                        percent: {
                            $multiply: ['$divided', 100],
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        added: 0,
                        divided: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
                {
                    $sort: {
                        percent: -1,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalDeals: totalCount,
                data: trendingDeals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSimilarDeals(categoryName, subCategoryName, offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.dealModel.countDocuments({
                deletedCheck: false,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                categoryName: categoryName,
                subCategory: subCategoryName,
            });
            const similarDeals = await this.dealModel
                .aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        dealStatus: dealstatus_enum_1.DEALSTATUS.published,
                        categoryName: categoryName,
                        subCategory: subCategoryName,
                    },
                },
                {
                    $sort: {
                        ratingsAverage: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        mediaUrl: {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        merchantMongoID: 0,
                        merchantID: 0,
                        subTitle: 0,
                        categoryName: 0,
                        subCategoryID: 0,
                        subCategory: 0,
                        subDeals: 0,
                        availableVouchers: 0,
                        aboutThisDeal: 0,
                        readMore: 0,
                        finePrints: 0,
                        netEarnings: 0,
                        isCollapsed: 0,
                        isDuplicate: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        pageNumber: 0,
                        updatedAt: 0,
                        __v: 0,
                        endDate: 0,
                        startDate: 0,
                        reviewMediaUrl: 0,
                        favouriteDeal: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                deals: similarDeals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRecentlyViewedDeals(offset, limit, req) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let deals = await this._viewsModel
                .aggregate([
                {
                    $match: {
                        customerMongoID: req.user.id,
                    },
                },
                {
                    $group: {
                        _id: '$dealID',
                        viewedTime: { $last: '$viewedTime' },
                    },
                },
                {
                    $sort: {
                        viewedTime: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'deals',
                        as: 'recentlyViewed',
                        localField: '_id',
                        foreignField: 'dealID',
                    },
                },
                {
                    $unwind: '$recentlyViewed',
                },
                {
                    $lookup: {
                        from: 'favourites',
                        as: 'favouriteDeal',
                        let: {
                            dealID: '$recentlyViewed.dealID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                            deletedCheck: '$recentlyViewed.deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$dealID', '$dealID'],
                                            },
                                            {
                                                $eq: ['$$customerMongoID', '$customerMongoID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$favouriteDeal',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'merchantDetails',
                        let: {
                            userID: '$merchantID',
                            deletedCheck: '$deletedCheck',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$$userID', '$userID'],
                                            },
                                            {
                                                $eq: ['$deletedCheck', false],
                                            },
                                        ],
                                    },
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
                                    id: 1,
                                    totalReviews: 1,
                                    ratingsAverage: 1,
                                    legalName: 1,
                                    city: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$merchantDetails',
                },
                {
                    $addFields: {
                        id: '$_id',
                        'recentlyViewed.mediaUrl': {
                            $slice: [
                                {
                                    $filter: {
                                        input: '$recentlyViewed.mediaUrl',
                                        as: 'mediaUrl',
                                        cond: {
                                            $eq: ['$$mediaUrl.type', 'Image'],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        isFavourite: {
                            $cond: [
                                {
                                    $ifNull: ['$favouriteDeal', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        id: 0,
                        _id: 0,
                        favouriteDeal: 0,
                        'recentlyViewed.merchantMongoID': 0,
                        'recentlyViewed.merchantID': 0,
                        'recentlyViewed.subTitle': 0,
                        'recentlyViewed.categoryName': 0,
                        'recentlyViewed.subCategoryID': 0,
                        'recentlyViewed.subCategory': 0,
                        'recentlyViewed.subDeals': 0,
                        'recentlyViewed.availableVouchers': 0,
                        'recentlyViewed.aboutThisDeal': 0,
                        'recentlyViewed.readMore': 0,
                        'recentlyViewed.finePrints': 0,
                        'recentlyViewed.netEarnings': 0,
                        'recentlyViewed.isCollapsed': 0,
                        'recentlyViewed.isDuplicate': 0,
                        'recentlyViewed.totalReviews': 0,
                        'recentlyViewed.maxRating': 0,
                        'recentlyViewed.minRating': 0,
                        'recentlyViewed.pageNumber': 0,
                        'recentlyViewed.updatedAt': 0,
                        'recentlyViewed.__v': 0,
                        'recentlyViewed.endDate': 0,
                        'recentlyViewed.startDate': 0,
                        'recentlyViewed.reviewMediaUrl': 0,
                        'recentlyViewed.favouriteDeal': 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            deals = deals.map((el) => {
                return Object.assign(Object.assign({}, el.recentlyViewed), { isFavourite: el.isFavourite, viewedTime: el.viewedTime, merchantDetails: el.merchantDetails });
            });
            return {
                data: deals,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSalesStatistics(req) {
        try {
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
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async changeMediaURL() {
        var e_2, _a, e_3, _b;
        var _c;
        let deals = await this.dealModel.find();
        deals = JSON.parse(JSON.stringify(deals));
        try {
            for (var deals_1 = __asyncValues(deals), deals_1_1; deals_1_1 = await deals_1.next(), !deals_1_1.done;) {
                let deal = deals_1_1.value;
                let updatedMediaArr = [];
                if ((_c = deal === null || deal === void 0 ? void 0 : deal.mediaUrl) === null || _c === void 0 ? void 0 : _c.length) {
                    try {
                        for (var _d = (e_3 = void 0, __asyncValues(deal === null || deal === void 0 ? void 0 : deal.mediaUrl)), _e; _e = await _d.next(), !_e.done;) {
                            let mediaObj = _e.value;
                            if (typeof mediaObj == 'string') {
                                let tempMediaObj = mediaObj;
                                let updatedMedia = tempMediaObj.replace('//dividealapi', '//stagingdividealapi');
                                updatedMediaArr.push(updatedMedia);
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_b = _d.return)) await _b.call(_d);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    await this.dealModel.updateOne({ _id: deal.id }, { mediaUrl: updatedMediaArr });
                    console.log('deals changed', deal.id);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (deals_1_1 && !deals_1_1.done && (_a = deals_1.return)) await _a.call(deals_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    async buyNow(buyNowDto, req) {
        try {
            const deal = await this.dealModel.findOne({ dealID: buyNowDto.dealID });
            debugger;
            if (!deal) {
                throw new Error('Deal ID not found!');
            }
            const merchant = await this._userModel.findOne({
                userID: deal.merchantID,
                deletedCheck: false,
            });
            const customer = await this._userModel.findById(req.user.id);
            const affiliate = await this._userModel.findOne({
                userID: buyNowDto.affiliateID,
                deletedCheck: false,
            });
            if (!affiliate) {
                throw new Error('Affiliate doesnot exist!');
            }
            const subDeal = deal.subDeals.find((el) => el.subDealID == buyNowDto.subDealID);
            if (subDeal.numberOfVouchers < buyNowDto.quantity) {
                throw new Error('Insufficent Quantity of deal present!');
            }
            let dealVouchers = 0, soldVouchers = 0;
            deal.subDeals = deal.subDeals.map((element) => {
                if (buyNowDto.subDealID === element['subDealID']) {
                    element.soldVouchers += buyNowDto.quantity;
                    element.numberOfVouchers -= buyNowDto.quantity;
                }
                dealVouchers += element.numberOfVouchers;
                soldVouchers += element.soldVouchers;
                return element;
            });
            deal.soldVouchers = soldVouchers;
            deal.availableVouchers -= buyNowDto.quantity;
            let imageURL = {};
            let payment = (subDeal.dealPrice * buyNowDto.quantity).toString();
            let description = `Customer with id ${req.user.id} and email address ${customer.email} is buying ${buyNowDto.quantity} vouchers of sub deal ${subDeal.title}`;
            let userId = req.user.id;
            let card = buyNowDto.card;
            let stripePaymentDto = {
                card,
                payment,
                description,
                userId,
            };
            const stripeResponse = await this._stripeService.checkout(stripePaymentDto, req);
            deal === null || deal === void 0 ? void 0 : deal.mediaUrl.forEach((el) => {
                if (el.type == 'Image' && Object.keys(imageURL).length === 0) {
                    imageURL = Object.assign({}, el);
                }
            });
            let expiryDate;
            if (subDeal.voucherStartDate > 0) {
                expiryDate = subDeal.voucherEndDate;
            }
            else {
                expiryDate =
                    new Date().getTime() + (subDeal === null || subDeal === void 0 ? void 0 : subDeal.voucherValidity) * 24 * 60 * 60 * 1000;
            }
            let merchantPercentage = merchant.platformPercentage / 100;
            affiliate.platformPercentage = merchant.platformPercentage / 100;
            const calculatedFee = subDeal.dealPrice * merchantPercentage;
            const netFee = subDeal.dealPrice - merchantPercentage * subDeal.dealPrice;
            const calculatedFeeForAffiliate = calculatedFee * affiliate.platformPercentage;
            subDeal.grossEarning += subDeal.dealPrice;
            subDeal.netEarning += netFee;
            let voucherDto = {
                voucherHeader: subDeal.title,
                dealHeader: deal.dealHeader,
                dealID: deal.dealID,
                dealMongoID: deal._id,
                subDealHeader: subDeal.title,
                subDealID: subDeal.subDealID,
                subDealMongoID: subDeal._id,
                amount: subDeal.dealPrice,
                net: netFee,
                fee: calculatedFee,
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM.purchased,
                merchantID: deal.merchantID,
                merchantMongoID: merchant.id,
                merchantPaymentStatus: merchant_enum_1.MERCHANTPAYMENTSTATUS.pending,
                affiliateName: affiliate.firstName + ' ' + affiliate.lastName,
                affiliateID: buyNowDto.affiliateID,
                affiliatePercentage: merchant.platformPercentage,
                affiliateFee: calculatedFeeForAffiliate,
                affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.pending,
                platformPercentage: merchant.platformPercentage,
                customerID: customer.userID,
                affiliateMongoID: affiliate.id,
                customerMongoID: customer.id,
                imageURL,
                dealPrice: subDeal.dealPrice,
                originalPrice: subDeal.originalPrice,
                discountedPercentage: subDeal.discountPercentage,
                expiryDate,
                deletedCheck: false,
                paymentStatus: billingStatus_enum_1.BILLINGSTATUS.paid,
            };
            let vouchers = [];
            for (let i = 0; i < buyNowDto.quantity; i++) {
                vouchers.push = this._voucherService.createVoucher(voucherDto);
            }
            await Promise.all(vouchers);
            const emailDto = (0, emailHtml_1.getEmailHTML)(customer.email, customer.firstName, customer.lastName);
            await this.dealModel.updateOne({ dealID: buyNowDto.dealID }, deal);
            await this._userModel.updateOne({ userID: deal.merchantID }, { purchasedVouchers: merchant.purchasedVouchers + buyNowDto.quantity, totalEarnings: merchant.totalEarnings + netFee });
            this.sendMail(emailDto);
            return { message: 'Purchase Successfull!' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendMail(emailDto) {
        var mailOptions = {
            from: emailDto.from,
            to: emailDto.to,
            subject: emailDto.subject,
            text: emailDto.text,
            html: emailDto.html,
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
            else {
            }
        });
    }
};
DealService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Deal')),
    __param(1, (0, mongoose_1.InjectModel)('PreComputedDeal')),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __param(3, (0, mongoose_1.InjectModel)('Category')),
    __param(4, (0, mongoose_1.InjectModel)('Counter')),
    __param(5, (0, mongoose_1.InjectModel)('SubCategory')),
    __param(6, (0, mongoose_1.InjectModel)('User')),
    __param(7, (0, mongoose_1.InjectModel)('Schedule')),
    __param(8, (0, mongoose_1.InjectModel)('views')),
    __param(9, (0, mongoose_1.InjectModel)('Review')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        schedule_service_1.ScheduleService,
        stripe_service_1.StripeService,
        vouchers_service_1.VouchersService,
        views_service_1.ViewsService])
], DealService);
exports.DealService = DealService;
//# sourceMappingURL=deal.service.js.map