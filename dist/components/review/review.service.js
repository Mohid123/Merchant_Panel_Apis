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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ReviewService = class ReviewService {
    constructor(reviewModel, reviewTextModel, dealModel, userModel) {
        this.reviewModel = reviewModel;
        this.reviewTextModel = reviewTextModel;
        this.dealModel = dealModel;
        this.userModel = userModel;
    }
    async createReview(reviewDto) {
        var _a;
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
                }, 0) / ((_a = reviewDto.multipleRating) === null || _a === void 0 ? void 0 : _a.length);
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
                        merchantID: reviewDto.merchantID,
                    },
                },
                {
                    $group: {
                        _id: '$merchantID',
                        nRating: { $sum: 1 },
                        avgRating: { $avg: '$totalRating' },
                        minRating: { $min: '$totalRating' },
                        maxRating: { $max: '$totalRating' },
                    },
                },
            ]);
            if (userStats.length > 0) {
                await this.userModel.findByIdAndUpdate(reviewDto.merchantID, {
                    ratingsAverage: userStats[0].avgRating,
                    totalReviews: userStats[0].nRating,
                    minRating: userStats[0].minRating,
                    maxRating: userStats[0].maxRating,
                });
            }
            else {
                await this.userModel.findByIdAndUpdate(reviewDto.merchantID, {
                    ratingsAverage: 0,
                    ratingsQuantity: 0,
                });
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
                merchantID: reviewTextDto.merchantID,
            }, Object.assign({}, reviewTextDto), {
                upsert: true,
            });
            return await this.reviewTextModel.findOne({
                reviewID: reviewTextDto.reviewID,
                merchantID: reviewTextDto.merchantID,
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
                        merchantID: merchantID,
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
            if (merchantReply.length == 0) {
                return {};
            }
            return merchantReply[0];
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
                merchantID: merchantId,
            });
            const reviews = await this.reviewModel
                .aggregate([
                {
                    $match: {
                        merchantID: merchantId,
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