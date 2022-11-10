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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CategoryService = class CategoryService {
    constructor(categoryModel, subCategoryModel, affiliateCategoryModel, affiliateSubCategoryModel) {
        this.categoryModel = categoryModel;
        this.subCategoryModel = subCategoryModel;
        this.affiliateCategoryModel = affiliateCategoryModel;
        this.affiliateSubCategoryModel = affiliateSubCategoryModel;
    }
    async createCategory(categoryDto) {
        try {
            let category = await this.categoryModel.create(categoryDto);
            return category;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createAffiliateCategory(categoryDto) {
        try {
            let affiliateCategory = await new this.affiliateCategoryModel(categoryDto).save();
            return affiliateCategory;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createSubCategory(subCategoryDto) {
        try {
            let subCategory = await this.subCategoryModel.create(subCategoryDto);
            return subCategory;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createAffiliateSubCategory(subCategoryDto) {
        try {
            let affiliateSubCategory = await this.affiliateSubCategoryModel.create(subCategoryDto);
            return affiliateSubCategory;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllCategories(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.categoryModel.countDocuments();
            let categories = await this.categoryModel
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
                data: categories,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllAffiliateCategories(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.affiliateCategoryModel.countDocuments();
            let affiliateCategories = await this.affiliateCategoryModel
                .aggregate([
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
                data: affiliateCategories,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllAffiliateSubCategoriesByAffiliateCategories(affiliateCategoryName, offset, limit) {
        try {
            let affiliateSubCategories = await this.affiliateSubCategoryModel.aggregate([
                {
                    $match: {
                        affiliateCategoryName: affiliateCategoryName
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
            return affiliateSubCategories;
        }
        catch (err) {
        }
    }
    async getAllSubCategoriesByCategories(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.subCategoryModel.countDocuments();
            let subCategories = await this.categoryModel.aggregate([
                {
                    $project: {
                        _id: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                    },
                },
                {
                    $lookup: {
                        from: 'subCategories',
                        let: {
                            categoryName: '$categoryName',
                            index: 1,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$categoryName', '$$categoryName'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    subCategoryName: 1,
                                },
                            },
                        ],
                        as: 'subCategories',
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                data: subCategories,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllSubCategoriesByMerchant(offset, limit, req) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.subCategoryModel.countDocuments({
                categoryName: req.user.businessType,
            });
            let subCategories = await this.subCategoryModel
                .aggregate([
                {
                    $match: {
                        categoryName: req.user.businessType,
                    },
                },
                {
                    $sort: {
                        subCategoryName: 1,
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
                data: subCategories,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Category')),
    __param(1, (0, mongoose_1.InjectModel)('SubCategory')),
    __param(2, (0, mongoose_1.InjectModel)('affiliateCategories')),
    __param(3, (0, mongoose_1.InjectModel)('affiliateSubCategories')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map