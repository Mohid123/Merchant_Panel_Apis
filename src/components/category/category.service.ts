import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { CategoryInterface } from '../../interface/category/category.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { pipeline } from 'stream';
import { affiliateCategoryInterface } from 'src/interface/category/affiliatecategory.interface';
import { AffiliateSubCategoryInterface } from 'src/interface/category/affiliatesubcategory.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryInterface>,
    @InjectModel('SubCategory')
    private readonly subCategoryModel: Model<SubCategoryInterface>,
    @InjectModel('affiliateCategories')
    private readonly affiliateCategoryModel: Model<affiliateCategoryInterface>,
    @InjectModel('affiliateSubCategories')
    private readonly affiliateSubCategoryModel: Model<AffiliateSubCategoryInterface>,
  ) {}

  async createCategory(categoryDto) {
    try {
      let category = await this.categoryModel.create(categoryDto);
      return category;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async createAffiliateCategory (categoryDto) {
    try {
      let affiliateCategory = await new this.affiliateCategoryModel(categoryDto).save();
      return affiliateCategory;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async createSubCategory(subCategoryDto) {
    try {
      let subCategory = await this.subCategoryModel.create(subCategoryDto);
      return subCategory;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async createAffiliateSubCategory (subCategoryDto) {
    try {
      let affiliateSubCategory = await this.affiliateSubCategoryModel.create(subCategoryDto);
      return affiliateSubCategory;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllAffiliateCategories (offset, limit) {
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllAffiliateSubCategoriesByAffiliateCategories (affiliateCategoryName, offset, limit) {
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
      .limit(parseInt(limit))

      return affiliateSubCategories;
    } catch (err) {
      
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
