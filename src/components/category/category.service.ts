import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { CategoryInterface } from '../../interface/category/category.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { pipeline } from 'stream';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryInterface>,
    @InjectModel('SubCategory')
    private readonly subCategoryModel: Model<SubCategoryInterface>,
  ) {}

  async createCategory(categoryDto) {
    try {
      let category = await this.categoryModel.create(categoryDto);
      return category;
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
      ]);

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
