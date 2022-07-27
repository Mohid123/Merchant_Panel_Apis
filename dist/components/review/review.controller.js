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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const merchantreviewreply_dto_1 = require("../../dto/review/merchantreviewreply.dto");
const review_dto_1 = require("../../dto/review/review.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const review_service_1 = require("./review.service");
let ReviewController = class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    createReview(revieDto) {
        return this.reviewService.createReview(revieDto);
    }
    createReviewReply(reviewTextDto) {
        return this.reviewService.createReviewReply(reviewTextDto);
    }
    getMerchantReply(merchantID, reviewID) {
        return this.reviewService.getMerchantReply(merchantID, reviewID);
    }
    deleteReview(reviewID) {
        return this.reviewService.deleteReview(reviewID);
    }
    getAllReviews(offset = 0, limit = 10) {
        return this.reviewService.getAllReviews(offset, limit);
    }
    getReviewsByMerchant(merchantId, offset = 0, limit = 10) {
        return this.reviewService.getReviewsByMerchant(merchantId, offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('createReview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_dto_1.ReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Post)('createReviewReply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchantreviewreply_dto_1.ReviewTextDto]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "createReviewReply", null);
__decorate([
    (0, common_1.Get)('getMerchantReply/:merchantID/:reviewID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Param)('reviewID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "getMerchantReply", null);
__decorate([
    (0, common_1.Post)('deleteReview/:reviewID'),
    __param(0, (0, common_1.Param)('reviewID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('getAllReviews'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "getAllReviews", null);
__decorate([
    (0, common_1.Get)('getReviewsByMerchant/:merchantId'),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "getReviewsByMerchant", null);
ReviewController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Review'),
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map