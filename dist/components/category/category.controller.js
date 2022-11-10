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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_service_1 = require("./category.service");
const category_dto_1 = require("../../dto/category/category.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const subcategory_dto_1 = require("../../dto/category/subcategory.dto");
const affiliatecategory_dto_1 = require("../../dto/category/affiliatecategory.dto");
const affiliatesubcategory_dto_1 = require("../../dto/category/affiliatesubcategory.dto");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    createCategory(categoryDto) {
        return this.categoryService.createCategory(categoryDto);
    }
    createAffiliateCategory(categoryDto) {
        return this.categoryService.createAffiliateCategory(categoryDto);
    }
    createSubCategory(subCategoryDto) {
        return this.categoryService.createSubCategory(subCategoryDto);
    }
    createAffiliateSubCategory(subCategoryDto) {
        return this.categoryService.createAffiliateSubCategory(subCategoryDto);
    }
    getAllCategories(offset = 0, limit = 10) {
        return this.categoryService.getAllCategories(offset, limit);
    }
    getAllAffiliateCategories(offset = 0, limit = 10) {
        return this.categoryService.getAllAffiliateCategories(offset, limit);
    }
    getAllSubCategories(offset = 0, limit = 10) {
        return this.categoryService.getAllSubCategoriesByCategories(offset, limit);
    }
    getAllAffiliateSubCategoriesByAffiliateCategories(affiliateCategoryName, offset = 0, limit = 10) {
        return this.categoryService.getAllAffiliateSubCategoriesByAffiliateCategories(affiliateCategoryName, offset, limit);
    }
    getAllSubCategoriesByCategories(offset = 0, limit = 10, req) {
        return this.categoryService.getAllSubCategoriesByMerchant(offset, limit, req);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('createCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoryDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('createAffiliateCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [affiliatecategory_dto_1.AffiliateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "createAffiliateCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('createSubCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subcategory_dto_1.SubCategoryDTO]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "createSubCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('createAffiliateSubCategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [affiliatesubcategory_dto_1.AffiliateSubCategoryDTO]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "createAffiliateSubCategory", null);
__decorate([
    (0, common_1.Get)('getAllCategories'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getAllAffiliateCategories'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllAffiliateCategories", null);
__decorate([
    (0, common_1.Get)('getAllSubCategoriesByCategories'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllSubCategories", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getAllAffiliateSubCategoriesByAffiliateCategories/:affiliateCategoryName'),
    __param(0, (0, common_1.Param)('affiliateCategoryName')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllAffiliateSubCategoriesByAffiliateCategories", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getAllSubCategoriesByMerchant'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllSubCategoriesByCategories", null);
CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Category'),
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map