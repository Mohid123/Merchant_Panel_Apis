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
    constructor(reviewModel, dealModel, userModel) {
        this.reviewModel = reviewModel;
        this.dealModel = dealModel;
        this.userModel = userModel;
    }
    async createReview(reviewDto) {
        try {
            const reviewAlreadyGiven = await this.reviewModel
                .findOne()
                .and([
                { dealID: reviewDto.dealID },
                { customerID: reviewDto.customerID },
            ]);
            if (reviewAlreadyGiven) {
                throw new common_1.HttpException('Customer has already reviewed this deal.', common_1.HttpStatus.CONFLICT);
            }
            const review = await this.reviewModel.create(reviewDto);
            const reviewStats = await this.reviewModel.aggregate([
                {
                    $match: {
                        dealID: reviewDto.dealID,
                    },
                },
                {
                    $group: {
                        _id: '$dealId',
                        nRating: { $sum: 1 },
                        avgRating: { $avg: '$rating' },
                        minRating: { $min: '$rating' },
                        maxRating: { $max: '$rating' },
                    },
                },
            ]);
            if (reviewStats.length > 0) {
                await this.dealModel.findByIdAndUpdate(reviewDto.dealID, {
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
                        avgRating: { $avg: '$rating' },
                        minRating: { $min: '$rating' },
                        maxRating: { $max: '$rating' },
                    },
                },
            ]);
            if (userStats.length > 0) {
                await this.userModel.findByIdAndUpdate(reviewDto.merchantID, {
                    ratingsAverage: userStats[0].avgRating,
                    ratingsQuantity: userStats[0].nRating,
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
    async deleteReview(id) {
        return this.reviewModel.findOneAndDelete({ _id: id });
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
    __param(1, (0, mongoose_1.InjectModel)('Deal')),
    __param(2, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map