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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const utils_1 = require("../file-management/utils/utils");
let ReviewService = class ReviewService {
    constructor(reviewModel, reviewTextModel, dealModel, userModel) {
        this.reviewModel = reviewModel;
        this.reviewTextModel = reviewTextModel;
        this.dealModel = dealModel;
        this.userModel = userModel;
    }
    async createReview(reviewDto) {
        var e_1, _a;
        var _b;
        try {
            const reviewAlreadyGiven = await this.reviewModel.findOne().and([
                { dealMongoID: reviewDto.dealMongoID },
                { voucherMongoID: reviewDto.voucherMongoID },
                { customerID: reviewDto.customerID },
            ]);
            if (reviewAlreadyGiven) {
                throw new common_1.HttpException('Customer has already reviewed this deal.', common_1.HttpStatus.CONFLICT);
            }
            reviewDto.totalRating =
                reviewDto.multipleRating.reduce((a, b) => {
                    return a + (b === null || b === void 0 ? void 0 : b.ratingScore);
                }, 0) / ((_b = reviewDto.multipleRating) === null || _b === void 0 ? void 0 : _b.length);
            if (reviewDto.mediaUrl && reviewDto.mediaUrl.length) {
                reviewDto['type'] = reviewDto.mediaUrl[0].type;
                reviewDto['captureFileURL'] = reviewDto.mediaUrl[0].captureFileURL;
                reviewDto['path'] = reviewDto.mediaUrl[0].path;
                if (reviewDto['type'] == 'Video') {
                    reviewDto['thumbnailURL'] = reviewDto.mediaUrl[0].thumbnailURL;
                    reviewDto['thumbnailPath'] = reviewDto.mediaUrl[0].thumbnailPath;
                }
                try {
                    for (var _c = __asyncValues(reviewDto.mediaUrl), _d; _d = await _c.next(), !_d.done;) {
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
                                let data = mediaObj['backgroundColorHex'] = await (0, utils_1.getDominantColor)(urlMedia);
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
            const review = await this.reviewModel.create(reviewDto);
            const reviewStats = await this.reviewModel.aggregate([
                {
                    $match: {
                        dealMongoID: reviewDto.dealMongoID,
                    },
                },
                {
                    $group: {
                        _id: '$dealID',
                        nRating: { $sum: 1 },
                        avgRating: { $avg: '$totalRating' },
                        minRating: { $min: '$totalRating' },
                        maxRating: { $max: '$totalRating' },
                    },
                },
            ]);
            if (reviewStats.length > 0) {
                await this.dealModel.findByIdAndUpdate(reviewDto.dealMongoID, {
                    ratingsAverage: reviewStats[0].avgRating,
                    totalReviews: reviewStats[0].nRating,
                    minRating: reviewStats[0].minRating,
                    maxRating: reviewStats[0].maxRating,
                });
            }
            const userStats = await this.reviewModel.aggregate([
                {
                    $match: {
                        merchantMongoID: reviewDto.merchantMongoID,
                    },
                },
                {
                    $group: {
                        _id: '$merchantMongoID',
                        nRating: { $sum: 1 },
                        avgRating: { $avg: '$totalRating' },
                        minRating: { $min: '$totalRating' },
                        maxRating: { $max: '$totalRating' },
                    },
                },
            ]);
            if (userStats.length > 0) {
                await this.userModel.findByIdAndUpdate(reviewDto.merchantMongoID, {
                    ratingsAverage: userStats[0].avgRating,
                    totalReviews: userStats[0].nRating,
                    minRating: userStats[0].minRating,
                    maxRating: userStats[0].maxRating,
                });
            }
            else {
                await this.userModel.findByIdAndUpdate(reviewDto.merchantMongoID, {
                    ratingsAverage: 0,
                    ratingsQuantity: 0,
                });
            }
            if (reviewDto.mediaUrl && reviewDto.mediaUrl.length) {
                let deal = await this.dealModel.findOne({ _id: reviewDto.dealMongoID });
                if (deal) {
                    deal.reviewMediaUrl.unshift(...reviewDto.mediaUrl);
                    deal.reviewMediaUrl = deal.reviewMediaUrl.slice(0, 50);
                    await this.dealModel.updateOne({ _id: reviewDto.dealMongoID }, { $set: { reviewMediaUrl: deal.reviewMediaUrl } });
                }
            }
            return review;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createReviewReply(reviewTextDto) {
        try {
            await this.reviewTextModel.findOneAndUpdate({
                reviewID: reviewTextDto.reviewID,
                merchantMongoID: reviewTextDto.merchantID,
            }, Object.assign({}, reviewTextDto), {
                upsert: true,
            });
            return await this.reviewTextModel.findOne({
                reviewID: reviewTextDto.reviewID,
                merchantMongoID: reviewTextDto.merchantID,
            });
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getMerchantReply(merchantID, reviewID) {
        try {
            let merchantReply = await this.reviewTextModel.aggregate([
                {
                    $match: {
                        merchantMongoID: merchantID,
                        reviewID: reviewID,
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
            ]);
            return merchantReply;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteReview(id) {
        try {
            return this.reviewModel.findOneAndDelete({ _id: id });
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllReviews(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.reviewModel.countDocuments({});
            const reviews = await this.reviewModel
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
                totalCount: totalCount,
                data: reviews,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getReviewsByMerchant(merchantId, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.reviewModel.countDocuments({
                merchantMongoID: merchantId,
            });
            const reviews = await this.reviewModel
                .aggregate([
                {
                    $match: {
                        merchantMongoID: merchantId,
                    },
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
                    $unwind: '$merchantReplyText',
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
                data: reviews,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateReviewViewState(id) {
        return await this.reviewModel.updateOne({ _id: id }, { isViewed: true });
    }
    async getNewReviewsForMerchant(merchantId, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.reviewModel.countDocuments({
                merchantMongoID: merchantId,
                isViewed: false,
            });
            const reviews = await this.reviewModel
                .aggregate([
                {
                    $match: {
                        merchantMongoID: merchantId,
                        isViewed: false,
                    },
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
                data: reviews,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Review')),
    __param(1, (0, mongoose_1.InjectModel)('reviewText')),
    __param(2, (0, mongoose_1.InjectModel)('Deal')),
    __param(3, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map