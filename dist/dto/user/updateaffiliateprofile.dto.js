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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAffiliateProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateAffiliateProfileDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                affiliateCategoryName: '',
                affiliateSubCategoryName: ''
            }
        ]
    }),
    __metadata("design:type", Array)
], UpdateAffiliateProfileDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "streetAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "tradeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "profilePicURL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "website_socialAppLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                type: '',
                captureFileURL: '',
                path: '',
                thumbnailURL: '',
                thumbnailPath: '',
                blurHash: '',
                backgroundColorHex: '',
            }
        ],
    }),
    __metadata("design:type", Array)
], UpdateAffiliateProfileDto.prototype, "gallery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "karibuURL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAffiliateProfileDto.prototype, "aboutUs", void 0);
exports.UpdateAffiliateProfileDto = UpdateAffiliateProfileDto;
//# sourceMappingURL=updateaffiliateprofile.dto.js.map