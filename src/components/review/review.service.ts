import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DealInterface } from '../../interface/deal/deal.interface';
import { UsersInterface } from '../../interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';
import { ReviewTextInterface } from 'src/interface/review/merchantreviewreply.interface';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<ReviewInterface>,
    @InjectModel('reviewText')
    private readonly reviewTextModel: Model<ReviewTextInterface>,
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('User') private readonly userModel: Model<UsersInterface>,
  ) {}

  async createReview(reviewDto) {
    try {
      const reviewAlreadyGiven = await this.reviewModel.findOne().and([
        // { dealID: reviewDto.dealID },
        { dealMongoID: reviewDto.dealMongoID },
        { voucherMongoID: reviewDto.voucherMongoID },
        { customerID: reviewDto.customerID },
      ]);

      if (reviewAlreadyGiven) {
        throw new HttpException(
          'Customer has already reviewed this deal.',
          HttpStatus.CONFLICT,
        );
      }

      reviewDto.totalRating =
        reviewDto.multipleRating.reduce((a, b) => {
          return a + b?.ratingScore;
        }, 0) / reviewDto.multipleRating?.length;

      const review = await this.reviewModel.create(reviewDto);

      const reviewStats = await this.reviewModel.aggregate([
        {
          $match: {
            dealMongoID: reviewDto.dealMongoID,
          },
        },
        {
          $group: {
            _id: '$dealID',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$totalRating' },
            minRating: { $min: '$totalRating' },
            maxRating: { $max: '$totalRating' },
          },
        },
      ]);

      if (reviewStats.length > 0) {
        await this.dealModel.findByIdAndUpdate(reviewDto.dealMongoID, {
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
            avgRating: { $avg: '$totalRating' },
            minRating: { $min: '$totalRating' },
            maxRating: { $max: '$totalRating' },
          },
        },
      ]);

      if (userStats.length > 0) {
        await this.userModel.findByIdAndUpdate(reviewDto.merchantID, {
          ratingsAverage: userStats[0].avgRating,
          totalReviews: userStats[0].nRating,
          minRating: userStats[0].minRating,
          maxRating: userStats[0].maxRating,
        });
      } else {
        await this.userModel.findByIdAndUpdate(reviewDto.merchantID, {
          ratingsAverage: 0,
          ratingsQuantity: 0,
        });
      }

      return review;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async createReviewReply(reviewTextDto) {
    try {
      await this.reviewTextModel.findOneAndUpdate(
        {
          reviewID: reviewTextDto.reviewID,
          merchantID: reviewTextDto.merchantID,
        },
        {
          ...reviewTextDto,
        },
        {
          upsert: true,
        },
      );

      return await this.reviewTextModel.findOne({
        reviewID: reviewTextDto.reviewID,
        merchantID: reviewTextDto.merchantID,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMerchantReply(merchantID, reviewID) {
    try {
      let merchantReply = await this.reviewTextModel.aggregate([
        {
          $match: {
            merchantID: merchantID,
            reviewID: reviewID,
            deletedCheck: false,
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
      ]);

      if (merchantReply.length == 0) {
        return {};
      }

      return merchantReply[0];
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteReview(id) {
    try {
      return this.reviewModel.findOneAndDelete({ _id: id });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
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
            $lookup: {
              from: 'reviewText',
              as: 'merchantReplyText',
              localField: '_id',
              foreignField: 'reviewID',
            },
          },
          {
            $unwind: '$merchantReplyText',
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
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
