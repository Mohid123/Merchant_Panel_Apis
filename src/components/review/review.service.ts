import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review')
    private readonly reviewModel: Model<ReviewInterface>,
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('User') private readonly userModel: Model<UsersInterface>,
  ) {}

  async createReview(reviewDto) {
    try {
      const reviewAlreadyGiven = await this.reviewModel
        .findOne()
        .and([
          { dealId: reviewDto.dealId },
          { customerId: reviewDto.customerId },
        ]);

      if (reviewAlreadyGiven) {
        throw new HttpException(
          'Customer has already reviewed this deal.',
          HttpStatus.CONFLICT,
        );
      }

      const review = await this.reviewModel.create(reviewDto);

      const reviewStats = await this.reviewModel.aggregate([
        {
          $match: {
            dealId: reviewDto.dealId,
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
        await this.dealModel.findByIdAndUpdate(reviewDto.dealId, {
          ratingsAverage: reviewStats[0].avgRating,
          totalReviews: reviewStats[0].nRating,
          minRating: reviewStats[0].minRating,
          maxRating: reviewStats[0].maxRating,
        });
      }

      const userStats = await this.reviewModel.aggregate([
        {
          $match: {
            merchantId: reviewDto.merchantId,
          },
        },
        {
          $group: {
            _id: '$merchantId',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            minRating: { $min: '$rating' },
            maxRating: { $max: '$rating' },
          },
        },
      ]);

      if (userStats.length > 0) {
        await this.userModel.findByIdAndUpdate(reviewDto.merchantId, {
          ratingsAverage: userStats[0].avgRating,
          ratingsQuantity: userStats[0].nRating,
          minRating: userStats[0].minRating,
          maxRating: userStats[0].maxRating,
        });
      } else {
        await this.userModel.findByIdAndUpdate(reviewDto.merchantId, {
          ratingsAverage: 0,
          ratingsQuantity: 0,
        });
      }

      return review;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async updateReview(updateReviewDto) {
    try {
      return await this.reviewModel.updateOne(
        { _id: updateReviewDto.id },
        updateReviewDto,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
