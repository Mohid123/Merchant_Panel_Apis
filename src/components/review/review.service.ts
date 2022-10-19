import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DealInterface } from '../../interface/deal/deal.interface';
import { UsersInterface } from '../../interface/user/users.interface';
import { ReviewInterface } from '../../interface/review/review.interface';
import { ReviewTextInterface } from 'src/interface/review/merchantreviewreply.interface';
import { encodeImageToBlurhash, getDominantColor } from '../file-management/utils/utils';
import { VoucherInterface } from 'src/interface/vouchers/vouchers.interface';
import { VOUCHERSTATUSENUM } from 'src/enum/voucher/voucherstatus.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<ReviewInterface>,
    @InjectModel('reviewText')
    private readonly reviewTextModel: Model<ReviewTextInterface>,
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('User') private readonly userModel: Model<UsersInterface>,
    @InjectModel('Voucher') private readonly voucherModel: Model<VoucherInterface>,
  ) {}

  async createReview(reviewDto, req) {
    try {
      const voucher = await this.voucherModel.findOne({
        voucherID: reviewDto.voucherID,
        deletedCheck: false,
        status: VOUCHERSTATUSENUM.redeeemed
      });

      if (!voucher) {
        throw new Error('Voucher not found!');
      };

      reviewDto.dealMongoID = voucher.dealMongoID;
      reviewDto.dealID = voucher.dealID;
      reviewDto.dealHeader = voucher.dealHeader;
      reviewDto.subDealHeader = voucher.subDealHeader;
      reviewDto.merchantMongoID = voucher.merchantMongoID;
      reviewDto.merchantID = voucher.merchantID;
      // reviewDto.customerEmail = req.user.email;
      // reviewDto.customerName = req.user.firstName + ' ' + req.user.lastName;
      // reviewDto.profilePicURL = req.user.profilePicURL;
      reviewDto.voucherRedeemedDate = voucher.redeemDate;

      reviewDto.customerMongoID = req.user.id;
      reviewDto.customerID = req.user.customerID;

      const reviewAlreadyGiven = await this.reviewModel.findOne().and([
        { voucherMongoID: reviewDto.voucherMongoID },
        { voucherID: reviewDto.voucherID },
        { customerID: req.user.customerID },
      ]);

      if (reviewAlreadyGiven) {
        throw new HttpException(
          'Customer has already reviewed this voucher',
          HttpStatus.CONFLICT,
        );
      }

      reviewDto.totalRating =
        reviewDto.multipleRating.reduce((a, b) => {
          return a + b?.ratingScore;
        }, 0) / reviewDto.multipleRating?.length;

        reviewDto.multipleRating.map((el) => {
          if (el.ratingScore <= 0) {
            throw new HttpException('All rating parameters must be filled', HttpStatus.BAD_REQUEST);
          }
        });

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

  async getReviewforCustomerProfile (voucherID) {
    try {
      let review = await this.reviewModel.aggregate([
        {
          $match: {
            voucherID: voucherID,
          }
        },
        {
          $lookup: {
            from: 'users',
            as: 'customerData',
            localField: 'customerID',
            foreignField: 'customerID',
          },
        },
        {
          $unwind: '$customerData'
        },
        {
          $addFields: {
            id: '$_id',
            customerName: {
              $concat: [
                '$customerData.firstName', ' ', '$customerData.lastName'
              ]
            }
          }
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
          $project: {
            _id: 0,
            customerData: 0
          }
        }
      ]).then(items=>items[0])

      return review;

    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async createReviewReply(reviewTextDto) {
    try {
      const voucher = await this.voucherModel.findOne({
        voucherID: reviewTextDto.voucherID,
        deletedCheck: false
      });

      if(!voucher) {
        throw new HttpException('Voucher not found!', HttpStatus.BAD_REQUEST);
      }

      reviewTextDto.merchantMongoID = voucher.merchantMongoID;
      reviewTextDto.merchantID = voucher.merchantID;

      let reply = await new this.reviewTextModel(reviewTextDto).save();

      const merchantReply = await this.reviewTextModel.aggregate([
        {
          $match: {
            _id: reply._id
          }
        },
        {
          $lookup: {
            from: 'users',
            as: 'merchantData',
            localField: 'merchantID',
            foreignField: 'merchantID'
          }
        },
        {
          $unwind: '$merchantData'
        },
        {
          $addFields: {
            id: '$_id',
            legalName: '$merchantData.legalName',
            merchantName: {
              $concat: [
                '$merchantData.firstName', ' ', '$merchantData.lastName'
              ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            merchantData: 0
          }
        }
      ]).then(items=>items[0]);

      return merchantReply;

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
              from: 'users',
              let: {
                customerID: '$customerID',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$customerID', '$$customerID'],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'customerData',
            },
          },
          {
            $unwind: '$customerData',
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
              customerName: {
                $concat: [
                  '$customerData.firstName',
                  ' ',
                  '$customerData.lastName',
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              customerData: 0
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
