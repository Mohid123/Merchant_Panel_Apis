"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const category_controller_1 = require("./category.controller");
const category_schema_1 = require("../../schema/category/category.schema");
const category_service_1 = require("./category.service");
const subcategory_schema_1 = require("../../schema/category/subcategory.schema");
const affiliatecategory_schema_1 = require("../../schema/category/affiliatecategory.schema");
const affiliatesubcategory_schema_1 = require("../../schema/category/affiliatesubcategory.schema");
let CategoryModule = class CategoryModule {
};
CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Category', schema: category_schema_1.CategorySchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'SubCategory', schema: subcategory_schema_1.SubCategorySchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'affiliateCategories', schema: affiliatecategory_schema_1.affiliateCategorySchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'affiliateSubCategories', schema: affiliatesubcategory_schema_1.affiliateSubCategoriesSchema }])
        ],
        controllers: [category_controller_1.CategoryController],
        providers: [category_service_1.CategoryService],
    })
], CategoryModule);
exports.CategoryModule = CategoryModule;
//# sourceMappingURL=category.module.js.map