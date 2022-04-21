import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewInterface } from '../../interface/review/review.interface';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review')
    private readonly reviewModel: Model<ReviewInterface>,
  ) {}

  async createReview(reviewDto) {
    try {
      const review = await this.reviewModel.create(reviewDto);
      return review;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteReview (id) {
    return this.reviewModel.findOneAndDelete({_id:id})
  }

  async getAllReviews(offset, limit) {
    try {

      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.reviewModel.countDocuments({});

      const reviews = await this.reviewModel.aggregate([
        {
          $sort: {
            createdAt: -1
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

      return {
        totalCount: totalCount,
        data: reviews
      }

    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getReviewsByMerchant (merchantId, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.reviewModel.countDocuments({merchantID: merchantId});

      const reviews = await this.reviewModel.aggregate([
        {
          $match: {
            merchantID: merchantId
          }
        },
        {
          $sort: {
            createdAt: -1
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

      return {
        totalCount: totalCount,
        data: reviews
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
