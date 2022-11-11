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
const userstatus_enum_1 = require("../../enum/user/userstatus.enum");
const axios_1 = require("axios");
const { convertArrayToCSV } = require('convert-array-to-csv');
const dealstatus_enum_1 = require("../../enum/deal/dealstatus.enum");
const activity_service_1 = require("../activity/activity.service");
const activity_enum_1 = require("../../enum/activity/activity.enum");
const userrole_enum_1 = require("../../enum/user/userrole.enum");
const affiliate_enum_1 = require("../../enum/affiliate/affiliate.enum");
let VouchersService = class VouchersService {
    constructor(voucherModel, voucherCounterModel, userModel, _scheduleModel, _scheduleService, _activityService, dealModel) {
        this.voucherModel = voucherModel;
        this.voucherCounterModel = voucherCounterModel;
        this.userModel = userModel;
        this._scheduleModel = _scheduleModel;
        this._scheduleService = _scheduleService;
        this._activityService = _activityService;
        this.dealModel = dealModel;
    }
    onModuleInit() {
        const dir = 'mediaFiles/NFT/customerrankingcsv';
        let exist = fs.existsSync(dir);
        if (!exist) {
            fs.mkdir(dir, { recursive: true }, (err) => {
                if (err) {
                    return console.log('err');
                }
                console.log('Customer Ranking CSV directory created');
            });
        }
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
            let paymentUpdateTimeStamp = new Date().getTime() + 15 * 24 * 60 * 60 * 1000;
            voucher = await voucher.save();
            let activityMessage = `Customer with ${voucher.customerID} purchased voucher for sub deal ${voucher.subDealID}`;
            this._activityService.createActivity({
                activityType: activity_enum_1.ACTIVITYENUM.voucherPurchased,
                activityTime: Date.now(),
                merchantID: voucher.merchantID,
                merchantMongoID: voucher.merchantMongoID,
                message: activityMessage,
                deletedCheck: false,
            });
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createvoucher/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&voucherid=${voucher.voucherID}`);
            let url = `${process.env.merchantPanelURL}/redeemVoucher/${voucher.id}`;
            url = await this.generateQRCode(url);
            await this.voucherModel.findByIdAndUpdate(voucher.id, { redeemQR: url });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateVoucherByID(voucherID, updateVoucherForCRMDto) {
        try {
            const voucher = await this.voucherModel.findOne({ voucherID: voucherID });
            if (!voucher) {
                throw new Error('Voucher not found!');
            }
            await this.voucherModel.updateOne({ voucherID: voucherID }, updateVoucherForCRMDto);
            return {
                message: 'Voucher has been updated successfully!',
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVoucherByID(voucherID) {
        try {
            let voucher = await this.voucherModel.findOne({
                voucherID: voucherID,
            });
            if (!voucher) {
                throw new Error('Voucher not found!');
            }
            voucher = JSON.parse(JSON.stringify(voucher));
            voucher.voucherID = voucher.voucherID;
            voucher.voucherHeader = voucher.voucherHeader;
            voucher.dealHeader = voucher.dealHeader;
            voucher.dealID = voucher.dealID;
            voucher.subDealHeader = voucher.subDealHeader;
            voucher.subDealID = voucher.subDealID;
            voucher.merchantID = voucher.merchantID;
            voucher.customerID = voucher.customerID;
            voucher.affiliateName = voucher.affiliateName;
            voucher.affiliateID = voucher.affiliateID;
            voucher.unitPrice = voucher.amount;
            voucher.voucherStatus = voucher.status;
            voucher.affiliatePercentage = voucher.affiliatePercentage;
            voucher.affiliateFee = voucher.affiliateFee;
            voucher.affiliatePaymentStatus = voucher.affiliatePaymentStatus;
            voucher.platformPercentage = voucher.platformPercentage;
            voucher.platformFee = voucher.fee;
            voucher.netEarning = voucher.net;
            voucher.merchantPaymentStatus = voucher.merchantPaymentStatus;
            voucher.purchaseDate = voucher.boughtDate;
            voucher.redeemDate = voucher.redeemDate;
            voucher.expiryDate = voucher.expiryDate;
            voucher.redeemDate = voucher.redeemData ? voucher.redeemData : null;
            voucher === null || voucher === void 0 ? true : delete voucher.id;
            voucher === null || voucher === void 0 ? true : delete voucher.dealMongoID;
            voucher === null || voucher === void 0 ? true : delete voucher.subDealMongoID;
            voucher === null || voucher === void 0 ? true : delete voucher.merchantMongoID;
            voucher === null || voucher === void 0 ? true : delete voucher.customerMongoID;
            voucher === null || voucher === void 0 ? true : delete voucher.affiliateMongoID;
            voucher === null || voucher === void 0 ? true : delete voucher.paymentStatus;
            voucher === null || voucher === void 0 ? true : delete voucher.imageURL;
            voucher === null || voucher === void 0 ? true : delete voucher.dealPrice;
            voucher === null || voucher === void 0 ? true : delete voucher.originalPrice;
            voucher === null || voucher === void 0 ? true : delete voucher.discountedPercentage;
            voucher === null || voucher === void 0 ? true : delete voucher.deletedCheck;
            voucher === null || voucher === void 0 ? true : delete voucher.redeemQR;
            voucher === null || voucher === void 0 ? true : delete voucher.amount;
            voucher === null || voucher === void 0 ? true : delete voucher.createdAt;
            voucher === null || voucher === void 0 ? true : delete voucher.updatedAt;
            voucher === null || voucher === void 0 ? true : delete voucher.status;
            voucher === null || voucher === void 0 ? true : delete voucher.net;
            voucher === null || voucher === void 0 ? true : delete voucher.fee;
            voucher === null || voucher === void 0 ? true : delete voucher.boughtDate;
            return voucher;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
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
    async getVouchersByAffiliateID(affiliateMongoID, voucherID, multipleVouchersAffiliateDto, offset, limit) {
        var _a;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let filters = {};
            if (voucherID.trim().length) {
                var query = new RegExp(`${voucherID}`, 'i');
                filters = Object.assign(Object.assign({}, filters), { voucherID: query });
            }
            if ((_a = multipleVouchersAffiliateDto === null || multipleVouchersAffiliateDto === void 0 ? void 0 : multipleVouchersAffiliateDto.voucherIDsArray) === null || _a === void 0 ? void 0 : _a.length) {
                filters = Object.assign(Object.assign({}, filters), { voucherID: { $in: multipleVouchersAffiliateDto.voucherIDsArray } });
            }
            let totalCount = await this.voucherModel.countDocuments({
                affiliateMongoID: affiliateMongoID,
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed,
                affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.paid
            });
            let filteredCount = await this.voucherModel.countDocuments(Object.assign({ affiliateMongoID: affiliateMongoID, status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed, affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.paid }, filters));
            let affiliateVouchers = await this.voucherModel.aggregate([
                {
                    $match: Object.assign({ affiliateMongoID: affiliateMongoID, status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed, affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.paid }, filters)
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'customerData',
                        localField: 'customerID',
                        foreignField: 'customerID'
                    }
                },
                {
                    $unwind: '$customerData'
                },
                {
                    $addFields: {
                        id: '$_id',
                        customerName: {
                            $concat: [
                                '$customerData.firstName',
                                ' ',
                                '$customerData.lastName'
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        voucherHeader: 0,
                        dealHeader: 0,
                        dealID: 0,
                        dealMongoID: 0,
                        subDealHeader: 0,
                        subDealID: 0,
                        subDealMongoID: 0,
                        merchantID: 0,
                        merchantMongoID: 0,
                        merchantPaymentStatus: 0,
                        customerID: 0,
                        customerMongoID: 0,
                        affiliateName: 0,
                        affiliateID: 0,
                        affiliateMongoID: 0,
                        affiliatePercentage: 0,
                        platformPercentage: 0,
                        fee: 0,
                        net: 0,
                        status: 0,
                        paymentStatus: 0,
                        expiryDate: 0,
                        imageURL: 0,
                        dealPrice: 0,
                        originalPrice: 0,
                        discountedPercentage: 0,
                        deletedCheck: 0,
                        redeemQR: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                        redeemDate: 0,
                        customerData: 0
                    }
                }
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                filteredCount: filteredCount,
                data: affiliateVouchers
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
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
            let customerVouchers = await this.voucherModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({ customerMongoID: customerID, deletedCheck: false }, matchFilter), filters),
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
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
                        ],
                        as: 'merchantData',
                    },
                },
                {
                    $unwind: '$merchantData',
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            customerID: '$customerID',
                            voucherID: '$voucherID',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$customerID', '$$customerID'],
                                            },
                                            {
                                                $eq: ['$voucherID', '$$voucherID'],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'reviewData',
                    },
                },
                {
                    $unwind: {
                        path: '$reviewData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'deals',
                        let: {
                            dealID: '$dealID',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$dealID', '$$dealID'],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'categories',
                                    as: 'categoryData',
                                    foreignField: 'categoryName',
                                    localField: 'categoryName',
                                },
                            },
                            {
                                $unwind: '$categoryData',
                            },
                        ],
                        as: 'dealData',
                    },
                },
                {
                    $unwind: '$dealData',
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'customerData',
                        localField: 'customerID',
                        foreignField: 'customerID'
                    }
                },
                {
                    $unwind: '$customerData'
                },
                {
                    $addFields: {
                        id: '$_id',
                        customerName: {
                            $concat: [
                                '$customerData.firstName',
                                ' ',
                                '$customerData.lastName',
                            ],
                        },
                        tradeName: '$merchantData.tradeName',
                        streetAddress: '$merchantData.streetAddress',
                        googleMapPin: '$merchantData.googleMapPin',
                        phoneNumber: '$merchantData.phoneNumber',
                        ratingParameters: '$dealData.categoryData.ratingParameters',
                        totalRating: '$reviewData.totalRating',
                        isReviewed: {
                            $cond: [
                                {
                                    $ifNull: ['$reviewData', false],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        customerData: 0,
                        dealData: 0,
                        merchantData: 0,
                        reviewData: 0,
                        _id: 0,
                        deletedCheck: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                filteredCount: filteredCount,
                data: customerVouchers,
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
            if (req.user.id != (voucher === null || voucher === void 0 ? void 0 : voucher.merchantMongoID)) {
                throw new common_1.UnauthorizedException('Merchant Not allowed to redeem voucher!');
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
                throw new Error('Voucher Not found!');
            }
            let scheduledVoucher = await this._scheduleModel.findOne({
                dealID: voucher.voucherID,
                status: 0,
            });
            if (scheduledVoucher) {
            }
            const merchant = await this.userModel.findOne({
                merchantID: voucher.merchantID,
            });
            let redeemDate = new Date().getTime();
            await this.voucherModel.updateOne({ voucherID: voucherId }, {
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed,
                redeemDate: redeemDate,
            });
            let activityMessage = `Voucher ${voucher.voucherID} redeemed.`;
            this._activityService.createActivity({
                activityType: activity_enum_1.ACTIVITYENUM.voucherRedeemed,
                activityTime: Date.now(),
                merchantID: voucher.merchantID,
                merchantMongoID: voucher.merchantMongoID,
                message: activityMessage,
                deletedCheck: false,
            });
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createvoucher/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&voucherid=${voucher.voucherID}`);
            await this.userModel.updateOne({ merchantID: voucher.merchantID }, {
                redeemedVouchers: merchant.redeemedVouchers + 1,
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
                                $project: {
                                    _id: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                    plusCode: 0,
                                    location: 0,
                                    locationName: 0,
                                    zipCode: 0,
                                    city: 0,
                                    province: 0,
                                    __v: 0,
                                },
                            },
                        ],
                        as: 'merchantData',
                    },
                },
                {
                    $unwind: '$merchantData',
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
                throw new Error(' Voucher Not found!');
            }
            let scheduledVoucher = await this._scheduleModel.findOne({
                dealID: voucher.voucherID,
                status: 0,
            });
            if (scheduledVoucher) {
            }
            const merchant = await this.userModel.findOne({
                merchantID: voucher.merchantID,
            });
            if (merchant.voucherPinCode != redeemVoucherDto.pin) {
                throw new Error('Inavlid Pin Code!');
            }
            let redeemDate = new Date().getTime();
            await this.voucherModel.updateOne({ voucherID: redeemVoucherDto.voucherID }, {
                status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed,
                redeemDate: redeemDate,
            });
            let activityMessage = `Voucher ${voucher.voucherID} redeemed.`;
            this._activityService.createActivity({
                activityType: activity_enum_1.ACTIVITYENUM.voucherRedeemed,
                activityTime: Date.now(),
                merchantID: voucher.merchantID,
                merchantMongoID: voucher.merchantMongoID,
                message: activityMessage,
                deletedCheck: false,
            });
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createvoucher/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&voucherid=${voucher.voucherID}`);
            await this.userModel.updateOne({ merchantID: voucher.merchantID }, {
                redeemedVouchers: merchant.redeemedVouchers + 1,
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
    async getVoucherSoldPerDay(numberOfDays, req) {
        var _a, _b;
        try {
            let startTime = Date.now() - numberOfDays * 24 * 60 * 60 * 1000;
            startTime =
                Math.floor(startTime / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
            const data = await this.voucherModel.aggregate([
                {
                    $match: {
                        merchantMongoID: req.user.id,
                        createdAt: { $gte: new Date(startTime) },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfYear: '$createdAt' },
                        createdAt: { $last: '$createdAt' },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);
            let counts = [];
            for (let i = 0; i < numberOfDays; i++) {
                let tempDate = Date.now() - (numberOfDays - i) * 24 * 60 * 60 * 1000;
                let tempNextDate = tempDate + 24 * 60 * 60 * 1000;
                const filtered = data === null || data === void 0 ? void 0 : data.filter((item) => new Date(item === null || item === void 0 ? void 0 : item.createdAt).getTime() >= tempDate &&
                    new Date(item === null || item === void 0 ? void 0 : item.createdAt).getTime() <= tempNextDate);
                if (filtered === null || filtered === void 0 ? void 0 : filtered.length) {
                    counts.push({
                        createdAt: (_a = filtered[0]) === null || _a === void 0 ? void 0 : _a.createdAt,
                        count: (_b = filtered[0]) === null || _b === void 0 ? void 0 : _b.count,
                    });
                }
                else {
                    counts.push({ createdAt: new Date(tempDate), count: 0 });
                }
            }
            let maxCount = Math.max(...counts.map((el) => el.count));
            return { maxCount, counts };
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException(err);
        }
    }
    async getNetRevenue(req) {
        var _a, _b, _c;
        try {
            const timeStamp = Date.now() - 182 * 24 * 60 * 60 * 1000;
            const totalDeals = await this.dealModel.countDocuments({
                merchantMongoID: req.user.id,
                dealStatus: dealstatus_enum_1.DEALSTATUS.published,
            });
            const merchant = await this.userModel.findOne({
                _id: req.user.id,
                merchantID: req.user.merchantID,
                deletedCheck: false,
                status: userstatus_enum_1.USERSTATUS.approved,
                role: userrole_enum_1.USERROLE.merchant
            });
            const totalVouchersSold = merchant.purchasedVouchers;
            const overallRating = merchant.ratingsAverage;
            const netRevenue = merchant.totalEarnings;
            let vouchers = await this.voucherModel.aggregate([
                {
                    $match: {
                        merchantMongoID: req.user.id,
                        createdAt: { $gte: new Date(timeStamp) },
                    },
                },
                {
                    $group: {
                        _id: { $substr: ['$createdAt', 0, 7] },
                        netRevenue: { $sum: '$net' },
                    },
                },
                {
                    $addFields: {
                        month: '$_id',
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
                {
                    $sort: {
                        month: -1,
                    },
                },
            ]);
            let maxRevenueForMonth = 0;
            let month = new Date().getMonth() + 2;
            let year = new Date().getFullYear();
            let yearlyRevenue = 0;
            for (let i = 0; i < 6; i++) {
                month = month - 1;
                if (month == 0) {
                    month = 12;
                    year = year - 1;
                }
                let checkMonth = month < 10
                    ? year.toString() + '-' + '0' + month.toString()
                    : year.toString() + '-' + month.toString();
                if (((_a = vouchers[i]) === null || _a === void 0 ? void 0 : _a.month) != checkMonth) {
                    vouchers.splice(i, 0, {
                        netRevenue: 0,
                        month: checkMonth,
                    });
                }
                yearlyRevenue += vouchers[i].netRevenue;
                maxRevenueForMonth =
                    maxRevenueForMonth < ((_b = vouchers[i]) === null || _b === void 0 ? void 0 : _b.netRevenue)
                        ? (_c = vouchers[i]) === null || _c === void 0 ? void 0 : _c.netRevenue
                        : maxRevenueForMonth;
            }
            let from = `${vouchers[vouchers.length - 1].month.split('-')[1]} ${vouchers[vouchers.length - 1].month.split('-')[0]}`;
            let to = `${vouchers[0].month.split('-')[1]} ${vouchers[0].month.split('-')[0]}`;
            return {
                totalDeals,
                totalVouchersSold,
                overallRating,
                netRevenue,
                from,
                to,
                yearlyRevenue,
                maxRevenueForMonth,
                vouchers,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVoucherSoldPerDayForAffiliates(numberOfDays, req) {
        var _a, _b;
        try {
            let startTime = Date.now() - numberOfDays * 24 * 60 * 60 * 1000;
            startTime =
                Math.floor(startTime / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
            const data = await this.voucherModel.aggregate([
                {
                    $match: {
                        affiliateMongoID: req.user.id,
                        affiliateID: req.user.affiliateID,
                        createdAt: { $gte: new Date(startTime) },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfYear: '$createdAt' },
                        createdAt: { $last: '$createdAt' },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);
            let counts = [];
            for (let i = 0; i < numberOfDays; i++) {
                let tempDate = Date.now() - (numberOfDays - i) * 24 * 60 * 60 * 1000;
                let tempNextDate = tempDate + 24 * 60 * 60 * 1000;
                const filtered = data === null || data === void 0 ? void 0 : data.filter((item) => new Date(item === null || item === void 0 ? void 0 : item.createdAt).getTime() >= tempDate &&
                    new Date(item === null || item === void 0 ? void 0 : item.createdAt).getTime() <= tempNextDate);
                if (filtered === null || filtered === void 0 ? void 0 : filtered.length) {
                    counts.push({
                        createdAt: (_a = filtered[0]) === null || _a === void 0 ? void 0 : _a.createdAt,
                        count: (_b = filtered[0]) === null || _b === void 0 ? void 0 : _b.count,
                    });
                }
                else {
                    counts.push({ createdAt: new Date(tempDate), count: 0 });
                }
            }
            let maxCount = Math.max(...counts.map((el) => el.count));
            return { maxCount, counts };
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException(err);
        }
    }
    async getCustomerRanking(affiliateMongoID, byMonthYearQuarter, dateFrom, dateTo, totalVouchers, totalEarnings, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            dateFrom = parseInt(dateFrom);
            dateTo = parseInt(dateTo);
            let matchFilter;
            let dateFromFilters = {};
            let dateToFilters = {};
            let dateFilter = {};
            if (byMonthYearQuarter == 'Month') {
                let d = new Date();
                let m = d.getMonth();
                let datefrom = d.setMonth(d.getMonth() - 1);
                console.log('datefrom', datefrom);
                let dateto = new Date().getTime();
                console.log('dateto', dateto);
                if (datefrom) {
                    dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': datefrom });
                }
                if (dateto) {
                    dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateto });
                }
                if (datefrom || dateto) {
                    dateFilter = Object.assign(Object.assign({}, dateFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
                }
            }
            else if (byMonthYearQuarter == 'Year') {
                let d = new Date();
                let m = d.getFullYear();
                let datefrom = d.setFullYear(d.getFullYear() - 1);
                console.log('datefrom', datefrom);
                let dateto = new Date().getTime();
                console.log('dateto', dateto);
                if (datefrom) {
                    dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': datefrom });
                }
                if (dateto) {
                    dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateto });
                }
                if (datefrom || dateto) {
                    dateFilter = Object.assign(Object.assign({}, dateFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
                }
            }
            else if (byMonthYearQuarter == 'Quarter') {
                let month = new Date().getMonth();
                if (month >= 0 && month <= 2) {
                    var dfrom = new Date();
                    dfrom.setUTCMonth(0);
                    dfrom.setUTCDate(1);
                    dfrom.setUTCHours(0);
                    dfrom.setUTCMinutes(0);
                    dfrom.setUTCSeconds(0);
                    dfrom.setUTCMilliseconds(0);
                    let datefrom = new Date(dfrom).getTime();
                    var dto = new Date();
                    dto.setUTCMonth(2);
                    dto.setUTCDate(31);
                    dto.setUTCHours(23);
                    dto.setUTCMinutes(59);
                    dto.setUTCSeconds(59);
                    dto.setUTCMilliseconds(59);
                    let dateto = new Date(dto).getTime();
                    if (datefrom) {
                        dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': datefrom });
                    }
                    if (dateto) {
                        dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateto });
                    }
                    if (datefrom || dateto) {
                        dateFilter = Object.assign(Object.assign({}, dateFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
                    }
                }
                else if (month >= 3 && month <= 5) {
                    var dfrom = new Date();
                    dfrom.setUTCMonth(3);
                    dfrom.setUTCDate(1);
                    dfrom.setUTCHours(0);
                    dfrom.setUTCMinutes(0);
                    dfrom.setUTCSeconds(0);
                    dfrom.setUTCMilliseconds(0);
                    let datefrom = new Date(dfrom).getTime();
                    var dto = new Date();
                    dto.setUTCMonth(5);
                    dto.setUTCDate(30);
                    dto.setUTCHours(23);
                    dto.setUTCMinutes(59);
                    dto.setUTCSeconds(59);
                    dto.setUTCMilliseconds(59);
                    let dateto = new Date(dto).getTime();
                    if (datefrom) {
                        dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': datefrom });
                    }
                    if (dateto) {
                        dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateto });
                    }
                    if (datefrom || dateto) {
                        dateFilter = Object.assign(Object.assign({}, dateFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
                    }
                }
                else if (month >= 6 && month <= 8) {
                    var dfrom = new Date();
                    dfrom.setUTCMonth(6);
                    dfrom.setUTCDate(1);
                    dfrom.setUTCHours(0);
                    dfrom.setUTCMinutes(0);
                    dfrom.setUTCSeconds(0);
                    dfrom.setUTCMilliseconds(0);
                    let datefrom = new Date(dfrom).getTime();
                    var dto = new Date();
                    dto.setUTCMonth(8);
                    dto.setUTCDate(30);
                    dto.setUTCHours(23);
                    dto.setUTCMinutes(59);
                    dto.setUTCSeconds(59);
                    dto.setUTCMilliseconds(59);
                    let dateto = new Date(dto).getTime();
                    if (datefrom) {
                        dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': datefrom });
                    }
                    if (dateto) {
                        dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateto });
                    }
                    if (datefrom || dateto) {
                        dateFilter = Object.assign(Object.assign({}, dateFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
                    }
                }
                else if (month >= 9 && month <= 11) {
                    var dfrom = new Date();
                    dfrom.setUTCMonth(9);
                    dfrom.setUTCDate(1);
                    dfrom.setUTCHours(0);
                    dfrom.setUTCMinutes(0);
                    dfrom.setUTCSeconds(0);
                    dfrom.setUTCMilliseconds(0);
                    let datefrom = new Date(dfrom).getTime();
                    var dto = new Date();
                    dto.setUTCMonth(11);
                    dto.setUTCDate(31);
                    dto.setUTCHours(23);
                    dto.setUTCMinutes(59);
                    dto.setUTCSeconds(59);
                    dto.setUTCMilliseconds(59);
                    let dateto = new Date(dto).getTime();
                    if (datefrom) {
                        dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': datefrom });
                    }
                    if (dateto) {
                        dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateto });
                    }
                    if (datefrom || dateto) {
                        dateFilter = Object.assign(Object.assign({}, dateFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
                    }
                }
            }
            if (dateFrom) {
                dateFromFilters = Object.assign(Object.assign({}, dateFromFilters), { '$gte': dateFrom });
            }
            if (dateTo) {
                dateToFilters = Object.assign(Object.assign({}, dateToFilters), { "$lte": dateTo });
            }
            if (dateFrom || dateTo) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { boughtDate: Object.assign(Object.assign({}, dateFromFilters), dateToFilters) });
            }
            let sort = {};
            if (totalVouchers) {
                let sortVouchers = totalVouchers == sort_enum_1.SORT.ASC ? 1 : -1;
                sort = Object.assign(Object.assign({}, sort), { totalVouchers: sortVouchers });
            }
            if (totalEarnings) {
                let sortEarnings = totalEarnings == sort_enum_1.SORT.ASC ? 1 : -1;
                sort = Object.assign(Object.assign({}, sort), { totalEarnings: sortEarnings });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            let totalCount = await this.voucherModel.aggregate([
                {
                    $match: Object.assign(Object.assign({ affiliateMongoID: affiliateMongoID, status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed, affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.paid }, dateFilter), matchFilter)
                },
                {
                    $group: {
                        _id: '$customerID',
                        totalVouchers: {
                            $sum: 1
                        },
                        totalEarnings: {
                            $sum: '$affiliateFee'
                        },
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'customerData',
                        localField: '_id',
                        foreignField: 'customerID'
                    }
                },
                {
                    $unwind: '$customerData'
                },
                {
                    $addFields: {
                        id: '$_id',
                        customerName: {
                            $concat: [
                                '$customerData.firstName',
                                ' ',
                                '$customerData.lastName',
                            ],
                        },
                    }
                },
                {
                    $project: {
                        customerData: 0,
                        _id: 0
                    }
                },
                {
                    $count: 'totalCount'
                }
            ]);
            let data = await this.voucherModel.aggregate([
                {
                    $match: Object.assign(Object.assign({ affiliateMongoID: affiliateMongoID, status: voucherstatus_enum_1.VOUCHERSTATUSENUM.redeeemed, affiliatePaymentStatus: affiliate_enum_1.AFFILIATEPAYMENTSTATUS.paid }, dateFilter), matchFilter)
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: '$customerID',
                        totalVouchers: {
                            $sum: 1
                        },
                        totalEarnings: {
                            $sum: '$affiliateFee'
                        },
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        as: 'customerData',
                        localField: '_id',
                        foreignField: 'customerID'
                    }
                },
                {
                    $unwind: '$customerData'
                },
                {
                    $addFields: {
                        id: '$_id',
                        customerName: {
                            $concat: [
                                '$customerData.firstName',
                                ' ',
                                '$customerData.lastName',
                            ],
                        },
                    }
                },
                {
                    $project: {
                        customerData: 0,
                        _id: 0
                    }
                },
                {
                    $sort: sort
                }
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: (totalCount === null || totalCount === void 0 ? void 0 : totalCount.length) > 0 ? totalCount[0].totalCount : 0,
                data: data
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCustomerRankingCSV(affiliateMongoID, byMonthYearQuarter, dateFrom, dateTo, totalVouchers, totalEarnings) {
        try {
            let data = await this.getCustomerRanking(affiliateMongoID, byMonthYearQuarter, dateFrom, dateTo, totalVouchers, totalEarnings, 0, Number.MAX_SAFE_INTEGER);
            let csv = convertArrayToCSV(data.data);
            let randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            const url = `${process.env.URL}media-upload/mediaFiles/customerrankingcsv/${randomName}.csv`;
            await fs.promises.writeFile(`./mediaFiles/NFT/customerrankingcsv/${randomName}.csv`, csv);
            return { url };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Voucher')),
    __param(1, (0, mongoose_1.InjectModel)('Counter')),
    __param(2, (0, mongoose_1.InjectModel)('User')),
    __param(3, (0, mongoose_1.InjectModel)('Schedule')),
    __param(6, (0, mongoose_1.InjectModel)('Deal')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        schedule_service_1.ScheduleService,
        activity_service_1.ActivityService,
        mongoose_2.Model])
], VouchersService);
exports.VouchersService = VouchersService;
//# sourceMappingURL=vouchers.service.js.map