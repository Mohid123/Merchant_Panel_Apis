import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DealInterface } from '../../interface/deal/deal.interface';
import { UsersInterface } from '../../interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';
import { ReviewTextInterface } from 'src/interface/review/merchantreviewreply.interface';
import { encodeImageToBlurhash, getDominantColor } from '../file-management/utils/utils';

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

        if (reviewDto.mediaUrl && reviewDto.mediaUrl.length) {
          reviewDto['type'] = reviewDto.mediaUrl[0].type;
          reviewDto['captureFileURL'] = reviewDto.mediaUrl[0].captureFileURL;
          reviewDto['path'] = reviewDto.mediaUrl[0].path;
          if (reviewDto['type'] == 'Video') {
            reviewDto['thumbnailURL'] = reviewDto.mediaUrl[0].thumbnailURL;
            reviewDto['thumbnailPath'] = reviewDto.mediaUrl[0].thumbnailPath;
          }
          
          for await (let mediaObj of reviewDto.mediaUrl) {
            await new Promise(async (resolve, reject) => {
              try {
                let urlMedia = '';
                if (mediaObj.type == 'Video') {
                  urlMedia = mediaObj.thumbnailURL;
                } else {
                  urlMedia = mediaObj.captureFileURL;
                }
                mediaObj['blurHash'] = await encodeImageToBlurhash(urlMedia);
                let data = mediaObj['backgroundColorHex'] = await getDominantColor(urlMedia);
                mediaObj['backgroundColorHex'] = data.hexCode;
                resolve({})
              } catch (err) {
                console.log('Error', err);
                reject(err);
              }
            });
          }
        }

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
            merchantMongoID: reviewDto.merchantMongoID,
          },
        },
        {
          $group: {
            _id: '$merchantMongoID',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$totalRating' },
            minRating: { $min: '$totalRating' },
            maxRating: { $max: '$totalRating' },
          },
        },
      ]);

      if (userStats.length > 0) {
        await this.userModel.findByIdAndUpdate(reviewDto.merchantMongoID, {
          ratingsAverage: userStats[0].avgRating,
          totalReviews: userStats[0].nRating,
          minRating: userStats[0].minRating,
          maxRating: userStats[0].maxRating,
        });
      } else {
        await this.userModel.findByIdAndUpdate(reviewDto.merchantMongoID, {
          ratingsAverage: 0,
          ratingsQuantity: 0,
        });
      }

      if (reviewDto.mediaUrl && reviewDto.mediaUrl.length) {
        let deal = await this.dealModel.findOne({_id: reviewDto.dealMongoID});

        if (deal) {
          deal.reviewMediaUrl.unshift(...reviewDto.mediaUrl);
          deal.reviewMediaUrl = deal.reviewMediaUrl.slice(0,50);
          await this.dealModel.updateOne({_id: reviewDto.dealMongoID},{$set:{reviewMediaUrl: deal.reviewMediaUrl}});
        }
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
          merchantMongoID: reviewTextDto.merchantID,
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
        merchantMongoID: reviewTextDto.merchantID,
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
            merchantMongoID: merchantID,
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

      return merchantReply;
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
        merchantMongoID: merchantId,
      });

      const reviews = await this.reviewModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantId,
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

  async updateReviewViewState(id) {
    return await this.reviewModel.updateOne({ _id: id }, { isViewed: true });
  }

  async getNewReviewsForMerchant(merchantId, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.reviewModel.countDocuments({
        merchantMongoID: merchantId,
        isViewed: false,
      });

      const reviews = await this.reviewModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantId,
              isViewed: false,
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
