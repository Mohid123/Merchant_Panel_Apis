import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import {
  encodeImageToBlurhash,
  generateStringId,
  getDominantColor,
} from '../file-management/utils/utils';
import { SORT } from '../../enum/sort/sort.enum';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { RATINGENUM } from 'src/enum/review/ratingValue.enum';
import { UsersInterface } from 'src/interface/user/users.interface';
import axios from 'axios';
import { delay } from 'rxjs';
import { ScheduleService } from '../schedule/schedule.service';
import { Schedule } from 'src/interface/schedule/schedule.interface';
import { StripePaymentDTO } from 'src/dto/stripe/stripe.dto';
import { StripeService } from '../stripe/stripe.service';
import { VoucherDto } from 'src/dto/vouchers/vouchers.dto';
import { VOUCHERSTATUSENUM } from 'src/enum/voucher/voucherstatus.enum';
import { BILLINGSTATUS } from 'src/enum/billing/billingStatus.enum';
import { VouchersService } from '../vouchers/vouchers.service';
import * as nodemailer from 'nodemailer';
import { EmailDTO } from 'src/dto/email/email.dto';
import { getEmailHTML } from './email/emailHtml';
import { ViewsService } from '../views/views.service';
import { ViewsInterface } from 'src/interface/views/views.interface';
import { PreComputedDealInteface } from 'src/interface/deal/preComputedDeal.interface';
import { Cache } from 'cache-manager';
import { ReviewInterface } from 'src/interface/review/review.interface';
import { AFFILIATEPAYMENTSTATUS } from 'src/enum/affiliate/affiliate.enum';
import { MERCHANTPAYMENTSTATUS } from 'src/enum/merchant/merchant.enum';
import { SORTINGENUM } from 'src/enum/sort/categoryapisorting.enum';
import { DealCategoryAnalyticsInterface } from 'src/interface/deal/dealcategoryanalytics.interface';
let transporter;

@Injectable()
export class DealService implements OnModuleInit {
  constructor(
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('PreComputedDeal')
    private readonly preComputedDealModel: Model<PreComputedDealInteface>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel('Category')
    private readonly categorymodel: Model<CategoryInterface>,
    @InjectModel('Counter')
    private readonly voucherCounterModel: Model<VoucherCounterInterface>,
    @InjectModel('SubCategory')
    private readonly subCategoryModel: Model<SubCategoryInterface>,
    @InjectModel('User')
    private readonly _userModel: Model<UsersInterface>,
    @InjectModel('Schedule') private _scheduleModel: Model<Schedule>,
    @InjectModel('views') private _viewsModel: Model<ViewsInterface>,
    @InjectModel('Review') private readonly reviewModel: Model<ReviewInterface>,
    @InjectModel('categories-Analytics') private readonly categoryAnalyticsModel: Model<DealCategoryAnalyticsInterface>,
    private _scheduleService: ScheduleService,
    private _stripeService: StripeService,
    private _voucherService: VouchersService,
    private viewsService: ViewsService,
  ) {}

  onModuleInit() {
    transporter = nodemailer.createTransport({
      // host: 'boostingthemovement.com',
      // port: 465,
      // secure: true,
      service: 'Gmail',
      auth: {
        user: 'noreplydivideals@gmail.com',
        pass: 'eyccuiqvdskyaknn',
      },
    });
  }

  async generateVoucherId(sequenceName) {
    const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(
      sequenceName,
      {
        $inc: {
          sequenceValue: 1,
        },
      },
      { new: true },
    );

    const year = new Date().getFullYear() % 2000;

    return `DBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${
      sequenceDocument.sequenceValue < 10000 ? '0' : ''
    }${sequenceDocument.sequenceValue}`;
  }

  async createDeal(dealDto, req) {
    try {
      var dealVouchers = 0;
      var dealSoldVouchers = 0;
      let savedDeal = null;

      if (dealDto.id) {
        savedDeal = await this.dealModel.findById(dealDto.id);
      }

      // let category = await this.categorymodel.findOne({
      //   categoryName: req.user.businessType,
      // });
      // dealDto.categoryName = req.user.businessType;
      // dealDto.categoryID = category.id;

      if (dealDto.subCategory) {
        let subCategory = await this.subCategoryModel.findOne({
          subCategoryName: dealDto.subCategory,
        });
        dealDto.subCategoryID = subCategory.id;
        dealDto.categoryName = subCategory.categoryName;
        dealDto.categoryID = subCategory.categoryID;
      }

      if (!savedDeal) {
        dealDto.dealID = await this.generateVoucherId('dealID');
      }

      if (dealDto.startDate && dealDto.endDate) {
        let stamp = new Date(dealDto.startDate).setUTCHours(0, 0, 0, 0);
        dealDto.startDate = stamp;
        stamp = new Date(dealDto.endDate).setUTCHours(23, 59, 59, 0);
        dealDto.endDate = stamp;
      }
      if (!savedDeal) {
        dealDto.dealHeader = dealDto?.dealHeader;

        dealDto.merchantID = req.user.userID;
        dealDto.merchantMongoID = req.user.id;

        if (dealDto.dealStatus) {
          dealDto.dealStatus = DEALSTATUS.inReview;
        }
        if (dealDto.dealStatus == 'Draft' || dealDto.isDuplicate == true) {
          dealDto.dealStatus = DEALSTATUS.draft;
        }

        if (!dealDto.dealStatus) {
          dealDto.dealStatus = DEALSTATUS.draft;
        }
      }

      if (dealDto.subDeals) {
        let num = 1;
        dealDto.subDeals = dealDto.subDeals.map((el) => {
          let startTime;
          let endTime;
          if (el.originalPrice !== 0 || el.dealPrice !== 0) {
            let calculateDiscountPercentage =
              ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
            el.discountPercentage = calculateDiscountPercentage;
          } else if (el.originalPrice == 0 && el.dealPrice == 0) {
            el.discountPercentage = 0;
          }

          dealVouchers += el.numberOfVouchers;
          el.soldVouchers = 0;
          el.grossEarning = 0;
          el.netEarning = 0;
          // dealSoldVouchers += el?.soldVouchers;

          if (el.voucherValidity > 0) {
            startTime = 0;
            endTime = 0;
          } else {
            startTime = new Date(el.voucherStartDate).getTime();
            endTime = new Date(el.voucherEndDate).getTime();
          }

          el.originalPrice = parseFloat(el.originalPrice);
          el.dealPrice = parseFloat(el.dealPrice);
          el.numberOfVouchers = parseInt(el.numberOfVouchers);
          el._id = generateStringId();
          if (savedDeal) {
            el.subDealID = savedDeal.dealID + '-' + num++;
          } else {
            el.subDealID = dealDto.dealID + '-' + num++;
          }

          el.voucherStartDate = startTime;
          el.voucherEndDate = endTime;

          return el;
        });
      }

      let minVoucher = dealDto.subDeals?.sort(
        (a, b) => a?.dealPrice - b?.dealPrice,
      )[0];

      dealDto.minDealPrice = minVoucher?.dealPrice;
      dealDto.minOriginalPrice = minVoucher?.originalPrice;
      dealDto.minDiscountPercentage = minVoucher?.discountPercentage;

      if (dealDto.mediaUrl && dealDto.mediaUrl.length) {
        dealDto['type'] = dealDto.mediaUrl[0].type;
        dealDto['captureFileURL'] = dealDto.mediaUrl[0].captureFileURL;
        dealDto['path'] = dealDto.mediaUrl[0].path;
        if (dealDto['type'] == 'Video') {
          dealDto['thumbnailURL'] = dealDto.mediaUrl[0].thumbnailURL;
          dealDto['thumbnailPath'] = dealDto.mediaUrl[0].thumbnailPath;
        }
        if (dealDto.mediaUrl) {
          for (let i = 0; i < dealDto.mediaUrl.length; i++) {
            if (dealDto.mediaUrl[i].type == 'Video') {
              console.log('Inside if');
              var item = dealDto.mediaUrl.splice(i, 1);
              dealDto.mediaUrl.splice(0, 0, item[0]);
            }
          }
        }
        for await (let mediaObj of dealDto.mediaUrl) {
          await new Promise(async (resolve, reject) => {
            try {
              let urlMedia = '';
              if (mediaObj.type == 'Video') {
                urlMedia = mediaObj.thumbnailURL;
              } else {
                urlMedia = mediaObj.captureFileURL;
              }
              mediaObj['blurHash'] = await encodeImageToBlurhash(urlMedia);
              let data = (mediaObj['backgroundColorHex'] =
                await getDominantColor(urlMedia));
              mediaObj['backgroundColorHex'] = data.hexCode;

              resolve({});
            } catch (err) {
              console.log('Error', err);
              reject(err);
            }
          });
        }
      }

      dealDto.availableVouchers = dealVouchers;
      dealDto.soldVouchers = dealSoldVouchers;
      dealDto.isCollapsed = false;

      if (!savedDeal) {
        const deal = await this.dealModel.create(dealDto);

        let dealurl = `${process.env.customerPanelURL}/preview/${deal._id}`;
        let editUrl = `${process.env.merchantPanelURL}/editDeal/${deal._id}`;
        await this.dealModel.updateOne(
          { _id: deal._id },
          { dealPreviewURL: dealurl, editDealURL: editUrl },
        );

        return deal;
      }

      delete dealDto?.dealPreviewURL;
      delete dealDto?.editDealURL;

      await this.dealModel.updateOne({ _id: dealDto.id }, dealDto);

      let returnedDeal = await this.dealModel.findOne({ _id: dealDto.id });

      // const res = await axios.get(
      //   `https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${returnedDeal.dealID}`,
      // );

      return returnedDeal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealByID(dealID) {
    try {
      let statuses = {
        Draft: 'Draft',
        'In review': 'Review Required',
        'Needs attention': 'Merchant Action Requested',
        Scheduled: 'Scheduled',
        Published: 'Published',
        Rejected: 'Rejected',
        Expired: 'Expired',
      };

      let deal: any = await this.dealModel.findOne({ dealID: dealID });

      if (!deal) {
        throw new Error('No deal Found!');
      }

      deal = JSON.parse(JSON.stringify(deal));

      let coverImageUrl = '';
      deal?.mediaUrl.forEach((el) => {
        if (el.type == 'Image' && coverImageUrl == '') {
          coverImageUrl = el.captureFileURL;
        }
      });
      if (deal?.subDeals.length > 0) {
        deal.voucherValidity = deal?.subDeals[0].voucherValidity;
        deal.voucherStartDate = deal?.subDeals[0].voucherStartDate;
        deal.voucherEndDate = deal?.subDeals[0].voucherEndDate;
      }

      deal.publishStartDate = deal?.startDate;
      deal.publishEndDate = deal?.endDate;
      deal.coverImageUrl = coverImageUrl;
      deal.dealStatus = statuses[deal.dealStatus];

      delete deal?.mediaUrl;
      delete deal?.merchantMongoID;
      delete deal?.categoryID;
      delete deal?.subCategoryID;
      delete deal?.highlights;
      delete deal?.reviewMediaUrl;
      delete deal?.ratingsAverage;
      delete deal?.totalReviews;
      delete deal?.maxRating;
      delete deal?.minRating;
      delete deal?.pageNumber;
      delete deal?.deletedCheck;
      delete deal?.isCollapsed;
      delete deal?.isDuplicate;
      delete deal?.isSpecialOffer;
      delete deal?.netEarnings;
      delete deal?.finePrints;
      delete deal?.readMore;
      delete deal?.minDiscountPercentage;
      delete deal?.minOriginalPrice;
      delete deal?.minDealPrice;
      delete deal?.aboutThisDeal;
      delete deal?.id;
      delete deal?.createdAt;
      delete deal?.updatedAt;
      delete deal?.endDate;
      delete deal?.startDate;
      deal?.subDeals.forEach((el) => {
        delete el._id;
        el.publishStartDate = deal?.publishStartDate;
        el.publishEndDate = deal?.publishEndDate;
        el.subCategory = deal?.subCategory;
        el.categoryName = deal?.categoryName;
        el.voucherTitle = el?.title;
        delete el.title;
        el.availableVouchers = el.numberOfVouchers;
        delete el?.numberOfVouchers;
        delete el?.grossEarning;
        delete el?.netEarning;
      });
      delete deal?.availableVouchers;
      delete deal?.soldVouchers;

      if (!deal.dealPreviewURL) {
        deal.dealPreviewURL = '';
      }

      if (!deal.editDealURL) {
        deal.editDealURL = '';
      }

      return deal;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateDealByID(updateDealDto) {
    try {
      let statuses = {
        Draft: 'Draft',
        'Review Required': 'In review',
        'Merchant Action Requested': 'Needs attention',
        Scheduled: 'Scheduled',
        Published: 'Published',
        Rejected: 'Rejected',
        Expired: 'Expired',
      };

      let deal: any = await this.dealModel.findOne({
        dealID: updateDealDto.dealID,
      });

      if (!deal) {
        throw new Error('No deal Found!');
      }

      if (updateDealDto.status) {
        deal.dealStatus = statuses[updateDealDto.status];

        if (updateDealDto.status == 'Rejected') {
          let scheduledDeal = await this._scheduleModel.findOne({
            dealID: deal.dealID,
            status: 0,
          });

          if (scheduledDeal) {
            // this._scheduleService.cancelJob(scheduledDeal.id);
          }
        }

        if (updateDealDto.status == 'Scheduled') {
          if (deal.startDate <= Date.now()) {
            deal.dealStatus = statuses['Published'];
            // this._scheduleService.scheduleDeal({
            //   scheduleDate: new Date(deal.endDate),
            //   status: 0,
            //   type: 'expireDeal',
            //   dealID: deal.dealID,
            //   deletedCheck: false,
            // });
          } else {
            // this._scheduleService.scheduleDeal({
            //   scheduleDate: new Date(deal.startDate),
            //   status: 0,
            //   type: 'publishDeal',
            //   dealID: deal.dealID,
            //   deletedCheck: false,
            // });
          }
          if (deal.endDate <= Date.now()) {
            deal.dealStatus = statuses['Expired'];
          }
        }
      }

      let dealVouchers = 0;
      deal.subDeals = deal.subDeals.map((element) => {
        if (updateDealDto.subDealID) {
          if (updateDealDto.subDealID === element['subDealID']) {
            if (updateDealDto.quantityAvailable) {
              element.numberOfVouchers = updateDealDto.quantityAvailable;
            }
          }
        }

        if (updateDealDto.availabilityDays) {
          element.voucherValidity = updateDealDto.availabilityDays;
          element.voucherStartDate = 0;
          element.voucherEndDate = 0;
        }

        if (updateDealDto.availabilityToDate) {
          if (element.voucherStartDate == 0) {
            element.voucherStartDate = deal.startDate;
          }
          element.voucherEndDate = updateDealDto.availabilityToDate;
          if (updateDealDto.availabilityToDate > deal.endDate) {
            deal.endDate = updateDealDto.availabilityToDate;
          }
          element.voucherValidity = 0;
          if (element.voucherEndDate < element.voucherStartDate) {
            throw new Error(
              'Voucher End Date can not be smaller than voucher start date!',
            );
          }
        }

        dealVouchers += element.numberOfVouchers;

        return element;
      });

      deal.availableVouchers = dealVouchers;

      await this.dealModel.updateOne({ dealID: updateDealDto.dealID }, deal);

      // const res = await axios.get(
      //   `https://www.zohoapis.eu/crm/v2/functions/createdraftdeal/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&dealid=${deal.dealID}`,
      // );

      return { message: 'Deal Updated Successfully' };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateDeal(updateDealDto, dealID) {
    try {
      updateDealDto.subDeals = [updateDealDto.subDeals];
      const deal = await this.dealModel.findById(dealID);

      let dealVouchers = 0;

      deal.subDeals = deal.subDeals.map((element) => {
        updateDealDto.subDeals.forEach((el) => {
          let calculateDiscountPercentage =
            ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
          el.discountPercentage = calculateDiscountPercentage;

          if (el['voucherID'] === element['_id']) {
            element.numberOfVouchers = parseInt(el.numberOfVouchers);
            element.title = el.title;
            element.originalPrice = parseFloat(el.originalPrice);
            element.dealPrice = parseFloat(el.dealPrice);
            element.discountPercentage = calculateDiscountPercentage;
          }
        });

        dealVouchers += element.numberOfVouchers;

        return element;
      });

      deal.availableVouchers = dealVouchers;

      await this.dealModel.findByIdAndUpdate(dealID, deal);

      return { message: 'Deal Updated Successfully' };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async approveRejectDeal(dealID, dealStatusDto) {
    try {
      let deal = await this.dealModel.findOne({
        _id: dealID,
        deletedCheck: false,
        dealStatus: DEALSTATUS.inReview,
      });

      if (dealStatusDto.dealStatus == DEALSTATUS.scheduled) {
        return await this.dealModel.updateOne(
          { _id: deal.id },
          { dealStatus: DEALSTATUS.scheduled },
        );
      } else if (dealStatusDto.dealStatus == DEALSTATUS.expired) {
        return await this.dealModel.updateOne(
          { _id: deal.id },
          { dealStatus: DEALSTATUS.expired },
        );
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllDeals(req, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.dealModel.countDocuments({
        merchantID: req.user.id,
        deletedCheck: false,
      });

      let deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantID: req.user.id,
              deletedCheck: false,
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
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDeal(id, req) {
    try {
      let deal = await this.dealModel
        .aggregate([
          {
            $match: {
              _id: id,
              deletedCheck: false,
              // dealStatus: DEALSTATUS.published,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
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
        .then((items) => items[0]);

      if (!deal) {
        throw new HttpException('Deal not found!', HttpStatus.BAD_REQUEST);
      }

      let viewsDto: any = {
        dealMongoID: deal.id,
        dealID: deal.dealID,
        customerMongoID: req.user.id,
        customerID: req.user.userID,
        viewedTime: new Date().getTime(),
      };

      await this.viewsService.createDealView(viewsDto, '');

      return deal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealForMerchantPanel(dealMongoID) {
    try {
      let deal = await this.dealModel
        .aggregate([
          {
            $match: {
              _id: dealMongoID,
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
        ])
        .then((items) => items[0]);

      if (!deal) {
        throw new HttpException('Deal not found!', HttpStatus.BAD_REQUEST);
      }

      return deal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealReviews(offset, limit, rating, id, createdAt, totalRating) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalReviewCount = await this.reviewModel.countDocuments({
        dealMongoID: id,
      });

      let rating1, rating2, rating3, rating4, rating5;

      rating1 = await this.reviewModel.countDocuments({
        dealMongoID: id,
        $and: [{ totalRating: { $gte: 1 } }, { totalRating: { $lt: 2 } }],
      });
      rating2 = await this.reviewModel.countDocuments({
        dealMongoID: id,
        $and: [{ totalRating: { $gte: 2 } }, { totalRating: { $lt: 3 } }],
      });
      rating3 = await this.reviewModel.countDocuments({
        dealMongoID: id,
        $and: [{ totalRating: { $gte: 3 } }, { totalRating: { $lt: 4 } }],
      });
      rating4 = await this.reviewModel.countDocuments({
        dealMongoID: id,
        $and: [{ totalRating: { $gte: 4 } }, { totalRating: { $lt: 5 } }],
      });
      rating5 = await this.reviewModel.countDocuments({
        dealMongoID: id,
        $and: [{ totalRating: { $gte: 5 } }],
      });

      rating1 = (rating1 / totalReviewCount) * 100;
      rating2 = (rating2 / totalReviewCount) * 100;
      rating3 = (rating3 / totalReviewCount) * 100;
      rating4 = (rating4 / totalReviewCount) * 100;
      rating5 = (rating5 / totalReviewCount) * 100;

      let calculatedReviewCount;
      if (totalReviewCount > 0) {
        calculatedReviewCount = [
          { rating: rating5 },
          { rating: rating4 },
          { rating: rating3 },
          { rating: rating2 },
          { rating: rating1 },
        ];
      } else {
        calculatedReviewCount = [
          { rating: 0 },
          { rating: 0 },
          { rating: 0 },
          { rating: 0 },
          { rating: 0 },
        ];
      }

      let ratingFilter = {};

      if (rating) {
        ratingFilter = {
          eq: ['$rating', parseInt(rating)],
        };
      } else {
        ratingFilter = {
          ...ratingFilter,
          eq: ['', ''],
        };
      }

      let sort = {};

      if (createdAt) {
        let sortCreatedAt = createdAt == SORT.ASC ? 1 : -1;
        console.log('createdAt');
        sort = {
          ...sort,
          createdAt: sortCreatedAt,
        };
      }

      if (totalRating) {
        let sortRating = totalRating == SORT.ASC ? 1 : -1;
        console.log('totalRating');
        sort = {
          ...sort,
          totalRating: sortRating,
        };
      }

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: -1,
        };
      }

      console.log(ratingFilter['eq']);
      const deal: any = await this.dealModel
        .aggregate([
          {
            $match: {
              _id: id,
            },
          },
          {
            $project: {
              dealHeader: 1,
              dealID: 1,
              ratingsAverage: 1,
              totalReviews: 1,
              maxRating: 1,
              minRating: 1,
              Reviews: 1,
            },
          },
          {
            $lookup: {
              from: 'reviews',
              let: {
                dealMongoID: id,
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$dealMongoID', '$$dealMongoID'],
                        },
                        {
                          $eq: ratingFilter['eq'],
                        },
                      ],
                    },
                    isViewed: true,
                  },
                },
                {
                  $sort: sort,
                },
                {
                  $lookup: {
                    from: 'reviewText',
                    as: 'merchantReplyText',
                    localField: '_id',
                    foreignField: 'reviewID',
                  },
                },
                // {
                //   $unwind: '$merchantReplyText',
                // },
                {
                  $skip: parseInt(offset),
                },
                {
                  $limit: parseInt(limit),
                },
              ],
              as: 'Reviews',
            },
          },
        ])
        .then((items) => items[0]);

      deal['calculatedReviewCount'] = calculatedReviewCount;
      return deal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteDeal(dealID) {
    try {
      const deal = await this.dealModel.findByIdAndUpdate(dealID, {
        deletedCheck: true,
      });

      if (!deal) {
        throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
      }

      return { status: 'success', message: 'Deal deleted successfully!' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealsReviewStatsByMerchant(
    id,
    // averageRating,
    dealID,
    offset,
    limit,
    multipleReviewsDto,
  ) {
    offset = parseInt(offset) < 0 ? 0 : offset;
    limit = parseInt(limit) < 1 ? 10 : limit;
    try {
      let matchFilter = {};

      if (dealID.trim().length) {
        var query = new RegExp(`${dealID}`, 'i');
        matchFilter = {
          ...matchFilter,
          dealID: query,
        };
      }

      let filters = {};

      let averageRating = 'All';
      if (multipleReviewsDto?.ratingsArray.length) {
        averageRating = multipleReviewsDto?.ratingsArray[0];
      }

      let minValue = 1;
      if (averageRating) {
        switch (averageRating) {
          case RATINGENUM.range1:
            minValue = 1;
            break;

          case RATINGENUM.range2:
            minValue = 2;
            break;

          case RATINGENUM.range3:
            minValue = 3;
            break;

          case RATINGENUM.range4:
            minValue = 4;
            break;

          case RATINGENUM.range5:
            minValue = 5;
            break;

          default:
            minValue = 1;
            break;
        }
      }

      console.log(minValue);
      console.log(averageRating);

      if (averageRating !== RATINGENUM.all) {
        matchFilter = {
          ...matchFilter,
          ratingsAverage: {
            $gte: minValue,
          },
        };
      }

      if (multipleReviewsDto?.dealIDsArray?.length) {
        filters = {
          ...filters,
          dealID: { $in: multipleReviewsDto.dealIDsArray },
        };
      }

      const totalCount = await this.dealModel.countDocuments({
        merchantMongoID: id,
        deletedCheck: false,
        // ...matchFilter,
        // ...filters,
      });

      const filteredDealCount = await this.dealModel.countDocuments({
        merchantMongoID: id,
        deletedCheck: false,
        ...matchFilter,
        ...filters,
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantMongoID: id,
              deletedCheck: false,
              ...matchFilter,
              ...filters,
              totalReviews: { $gt: 0 },
            },
          },
          {
            $project: {
              dealHeader: 1,
              dealID: 1,
              ratingsAverage: 1,
              totalReviews: 1,
              maxRating: 1,
              minRating: 1,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      const totalMerchantReviews = await this.dealModel.aggregate([
        {
          $match: {
            merchantMongoID: id,
            deletedCheck: false,
            ...matchFilter,
          },
        },
        {
          $group: {
            _id: '$merchantID',
            nRating: { $sum: '$totalReviews' },
          },
        },
      ]);

      if (!totalMerchantReviews[0]) {
        totalMerchantReviews[0] = 0;
      }

      const merchant = await this._userModel.findOne({ _id: id });

      return {
        totalDeals: totalCount,
        filteredDealCount,
        overallRating: merchant.ratingsAverage,
        totalMerchantReviews: totalMerchantReviews[0].nRating,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealsByMerchantID(
    merchantID,
    dealHeader,
    price,
    startDate,
    endDate,
    availableVoucher,
    soldVoucher,
    status,
    dateFrom,
    dateTo,
    dealID,
    header,
    dealStatus,
    offset,
    limit,
    multipleDealsDto,
    // req,
  ) {
    try {
      dateFrom = parseInt(dateFrom);
      dateTo = parseInt(dateTo);

      let dateToFilters = {};
      let dateFromFilters = {};
      let matchFilter = {};

      if (status) {
        matchFilter = {
          ...matchFilter,
          dealStatus: status,
        };
      }

      if (dateFrom) {
        dateFromFilters = {
          ...dateFromFilters,
          $gte: dateFrom,
        };
      }

      if (dateTo) {
        dateToFilters = {
          ...dateToFilters,
          $lte: dateTo,
        };
      }

      if (dateFrom || dateTo) {
        matchFilter = {
          ...matchFilter,
          $and: [
            {
              startDate: {
                ...dateFromFilters,
              },
            },
            {
              startDate: {
                ...dateToFilters,
              },
            },
          ],
        };
      }

      let sort = {};

      if (dealHeader) {
        let sortDealHeader = dealHeader == SORT.ASC ? 1 : -1;
        console.log('dealHeader');
        sort = {
          ...sort,
          dealHeader: sortDealHeader,
        };
      }

      if (price) {
        let sortPrice = price == SORT.ASC ? 1 : -1;
        console.log('price');
        sort = {
          ...sort,
          price: sortPrice,
        };
      }

      if (startDate) {
        let sortStartDate = startDate == SORT.ASC ? 1 : -1;
        console.log('startDate');
        sort = {
          ...sort,
          startDate: sortStartDate,
        };
      }

      if (endDate) {
        let sortEndDate = endDate == SORT.ASC ? 1 : -1;
        console.log('endDate');
        sort = {
          ...sort,
          endDate: sortEndDate,
        };
      }

      if (availableVoucher) {
        let sortAvailableVoucher = availableVoucher == SORT.ASC ? 1 : -1;
        console.log('availbleVoucher');
        sort = {
          ...sort,
          availableVoucher: sortAvailableVoucher,
        };
      }

      if (soldVoucher) {
        let sortSoldVoucher = soldVoucher == SORT.ASC ? 1 : -1;
        console.log('soldVoucher');
        sort = {
          ...sort,
          soldVoucher: sortSoldVoucher,
        };
      }

      dealID = dealID.trim();
      header = header.trim();
      dealStatus = dealStatus.trim();

      let filters = {};

      if (dealID.trim().length) {
        var query = new RegExp(`${dealID}`, 'i');
        filters = {
          ...filters,
          dealID: query,
        };
      }

      if (header.trim().length) {
        var query = new RegExp(`${header}`, 'i');
        filters = {
          ...filters,
          dealHeader: query,
        };
      }

      if (dealStatus.trim().length) {
        var query = new RegExp(`${dealStatus}`, 'i');
        filters = {
          ...filters,
          dealStatus: query,
        };
      }

      if (multipleDealsDto?.dealIDsArray?.length) {
        filters = {
          ...filters,
          dealID: { $in: multipleDealsDto.dealIDsArray },
        };
      }

      if (multipleDealsDto?.dealHeaderArray?.length) {
        filters = {
          ...filters,
          dealHeader: { $in: multipleDealsDto.dealHeaderArray },
        };
      }

      if (multipleDealsDto?.dealStatusArray?.length) {
        filters = {
          ...filters,
          dealStatus: { $in: multipleDealsDto.dealStatusArray },
        };
      }

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: -1,
        };
      }

      console.log(sort);
      console.log(matchFilter);

      const totalCount = await this.dealModel.countDocuments({
        merchantMongoID: merchantID,
        deletedCheck: false,
        ...matchFilter,
        // ...filters,
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantID,
              deletedCheck: false,
              ...matchFilter,
              ...filters,
            },
          },
          {
            $sort: sort,
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
        totalDeals: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealsByMerchantIDForCustomerPanel(merchantID, offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.dealModel.countDocuments({
        merchantMongoID: merchantID,
        deletedCheck: false,
        dealStatus: DEALSTATUS.published,
      });

      const mercahntDeals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantID,
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        data: mercahntDeals,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getTopRatedDeals(merchantID) {
    try {
      const deals = this.dealModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantID,
            },
          },
          {
            $sort: {
              ratingsAverage: -1,
            },
          },
        ])
        .limit(5);

      return deals;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getLowPriceDeals(price, offset, limit, req) {
    try {
      price = parseFloat(price);
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let totalCount;
      let priceIncrease = 10;

      do {
        priceIncrease += 10;
        totalCount = await this.dealModel.countDocuments({
          deletedCheck: false,
          dealStatus: DEALSTATUS.published,
          subDeals: { $elemMatch: { dealPrice: { $lt: price } } },
        });

        if (price > 150) {
          break;
        }

        price = price + priceIncrease;
      } while (totalCount < 6);

      price = price - priceIncrease;
      let filterValue = price;

      let deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              subDeals: {
                $elemMatch: { dealPrice: { $lt: price } },
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      if (deals?.length) {
        const updatedFilterValue =
          Math.ceil(
            deals?.sort((a, b) => b?.minDealPrice - a?.minDealPrice)[0]
              ?.minDealPrice / 10,
          ) * 10;
        filterValue = updatedFilterValue;
      }

      return {
        filterValue,
        totalCount: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getNewDeals(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const value = await this.cacheManager.get(`getNewDeals${offset}${limit}`);
      let totalCount;
      let deals;
      if (!value) {
        totalCount = await this.dealModel.countDocuments({
          deletedCheck: false,
          dealStatus: DEALSTATUS.published,
        });

        deals = await this.dealModel
          .aggregate([
            {
              $match: {
                deletedCheck: false,
                dealStatus: DEALSTATUS.published,
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $lookup: {
                from: 'favourites',
                as: 'favouriteDeal',
                let: {
                  dealID: '$dealID',
                  customerMongoID: req?.user?.id,
                  deletedCheck: '$deletedCheck',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$$dealID', '$dealID'],
                          },
                          {
                            $eq: ['$$customerMongoID', '$customerMongoID'],
                          },
                          {
                            $eq: ['$deletedCheck', false],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$favouriteDeal',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                as: 'merchantDetails',
                let: {
                  userID: '$merchantID',
                  deletedCheck: '$deletedCheck',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$$userID', '$userID'],
                          },
                          {
                            $eq: ['$deletedCheck', false],
                          },
                        ],
                      },
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
                      id: 1,
                      totalReviews: 1,
                      ratingsAverage: 1,
                      legalName: 1,
                      city: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$merchantDetails',
            },
            {
              $addFields: {
                id: '$_id',
                mediaUrl: {
                  $slice: [
                    {
                      $filter: {
                        input: '$mediaUrl',
                        as: 'mediaUrl',
                        cond: {
                          $eq: ['$$mediaUrl.type', 'Image'],
                        },
                      },
                    },
                    1,
                  ],
                },
                isFavourite: {
                  $cond: [
                    {
                      $ifNull: ['$favouriteDeal', false],
                    },
                    true,
                    false,
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                merchantMongoID: 0,
                merchantID: 0,
                subTitle: 0,
                categoryName: 0,
                subCategoryID: 0,
                subCategory: 0,
                subDeals: 0,
                availableVouchers: 0,
                aboutThisDeal: 0,
                readMore: 0,
                finePrints: 0,
                netEarnings: 0,
                isCollapsed: 0,
                isDuplicate: 0,
                totalReviews: 0,
                maxRating: 0,
                minRating: 0,
                pageNumber: 0,
                updatedAt: 0,
                __v: 0,
                endDate: 0,
                startDate: 0,
                reviewMediaUrl: 0,
                // favouriteDeal: 0
              },
            },
          ])
          .skip(parseInt(offset))
          .limit(parseInt(limit));

        await this.cacheManager.set(
          `getNewDeals${offset}${limit}`,
          {
            totalCount: totalCount,
            data: deals,
          },
          { ttl: 1000 },
        );
        return {
          totalCount: totalCount,
          data: deals,
        };
      }
      return value;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDiscountedDeals(percentage, offset, limit, req) {
    try {
      percentage = parseFloat(percentage);

      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let totalCount;

      do {
        totalCount = await this.dealModel.countDocuments({
          deletedCheck: false,
          dealStatus: DEALSTATUS.published,
          subDeals: {
            $elemMatch: { discountPercentage: { $lte: percentage } },
          },
        });
        percentage += 10;
        if (percentage > 95) {
          break;
        }
      } while (totalCount < 6);
      percentage = percentage - 10;
      let filterValue = percentage;
      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              subDeals: {
                $elemMatch: { discountPercentage: { $lte: percentage } },
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      if (deals?.length) {
        const updatedFilterValue =
          Math.ceil(
            deals?.sort(
              (a, b) => b?.minDiscountPercentage - a?.minDiscountPercentage,
            )[0]?.minDiscountPercentage / 10,
          ) * 10;
        filterValue = updatedFilterValue;
      }

      return {
        filterValue,
        totalCount: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getHotDeals(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const value = await this.cacheManager.get(`getHotDeals${offset}${limit}`);
      let totalCount;
      let deals;
      if (!value) {
        totalCount = await this.dealModel.countDocuments({
          deletedCheck: false,
          dealStatus: DEALSTATUS.published,
          availableVouchers: { $gt: 0 },
          soldVouchers: { $gt: 0 },
        });

        deals = await this.dealModel
          .aggregate([
            {
              $match: {
                deletedCheck: false,
                dealStatus: DEALSTATUS.published,
                availableVouchers: { $gt: 0 },
                soldVouchers: { $gt: 0 },
              },
            },
            {
              $addFields: {
                id: '$_id',
                added: { $add: ['$soldVouchers', '$availableVouchers'] },
              },
            },
            {
              $addFields: {
                divided: { $divide: ['$soldVouchers', '$added'] },
                percent: {
                  $multiply: ['$divided', 100],
                },
              },
            },
            {
              $addFields: {
                percent: {
                  $multiply: ['$divided', 100],
                },
              },
            },
            {
              $lookup: {
                from: 'favourites',
                as: 'favouriteDeal',
                let: {
                  dealID: '$dealID',
                  customerMongoID: req?.user?.id,
                  deletedCheck: '$deletedCheck',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$$dealID', '$dealID'],
                          },
                          {
                            $eq: ['$$customerMongoID', '$customerMongoID'],
                          },
                          {
                            $eq: ['$deletedCheck', false],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$favouriteDeal',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                as: 'merchantDetails',
                let: {
                  userID: '$merchantID',
                  deletedCheck: '$deletedCheck',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$$userID', '$userID'],
                          },
                          {
                            $eq: ['$deletedCheck', false],
                          },
                        ],
                      },
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
                      id: 1,
                      totalReviews: 1,
                      ratingsAverage: 1,
                      legalName: 1,
                      city: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$merchantDetails',
            },
            {
              $addFields: {
                mediaUrl: {
                  $slice: [
                    {
                      $filter: {
                        input: '$mediaUrl',
                        as: 'mediaUrl',
                        cond: {
                          $eq: ['$$mediaUrl.type', 'Image'],
                        },
                      },
                    },
                    1,
                  ],
                },
                isFavourite: {
                  $cond: [
                    {
                      $ifNull: ['$favouriteDeal', false],
                    },
                    true,
                    false,
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                added: 0,
                divided: 0,
                merchantMongoID: 0,
                merchantID: 0,
                subTitle: 0,
                categoryName: 0,
                subCategoryID: 0,
                subCategory: 0,
                subDeals: 0,
                availableVouchers: 0,
                aboutThisDeal: 0,
                readMore: 0,
                finePrints: 0,
                netEarnings: 0,
                isCollapsed: 0,
                isDuplicate: 0,
                totalReviews: 0,
                maxRating: 0,
                minRating: 0,
                pageNumber: 0,
                updatedAt: 0,
                __v: 0,
                endDate: 0,
                startDate: 0,
                reviewMediaUrl: 0,
                favouriteDeal: 0,
              },
            },
            {
              $sort: {
                percent: -1,
              },
            },
          ])
          .skip(parseInt(offset))
          .limit(parseInt(limit));

        await this.cacheManager.set(
          `getHotDeals${offset}${limit}`,
          {
            totalCount: totalCount,
            data: deals,
          },
          { ttl: 1000 },
        );
        return {
          totalCount: totalCount,
          data: deals,
        };
      }
      return value;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getSpecialOfferDeals(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;
      const totalCount = await this.dealModel.countDocuments({
        deletedCheck: false,
        dealStatus: DEALSTATUS.published,
        isSpecialOffer: true,
      });
      let deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              isSpecialOffer: true,
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));
      return {
        totalCount: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getNewFavouriteDeal(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.dealModel.countDocuments({
        deletedCheck: false,
        dealStatus: DEALSTATUS.published,
      });
      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
            },
          },
          {
            $sample: { size: totalCount },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));
      return {
        totalCount: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getNearByDeals(lat, lng, distance, offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      if (!distance) {
        distance = 10;
      }

      let radius = parseFloat(distance) / 6378.1;

      if (!lat && !lng) {
        lat = 50.850346;
        lng = 4.351721;
        radius = 20 / 6378.1;
      }
      let deal;

      let isFound = false;
      while (!isFound) {
        deal = await this.dealModel
          .aggregate([
            {
              $match: {
                deletedCheck: false,
                dealStatus: DEALSTATUS.published,
              },
            },
            {
              $lookup: {
                from: 'locations',
                as: 'location',
                localField: 'merchantID',
                foreignField: 'merchantID',
              },
            },
            {
              $unwind: '$location',
            },
            {
              $addFields: {
                locationCoordinates: '$location.location',
              },
            },
            {
              $match: {
                locationCoordinates: {
                  $geoWithin: {
                    $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius],
                  },
                },
              },
            },
            {
              $lookup: {
                from: 'favourites',
                as: 'favouriteDeal',
                let: {
                  dealID: '$dealID',
                  customerMongoID: req?.user?.id,
                  deletedCheck: '$deletedCheck',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$$dealID', '$dealID'],
                          },
                          {
                            $eq: ['$$customerMongoID', '$customerMongoID'],
                          },
                          {
                            $eq: ['$deletedCheck', false],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$favouriteDeal',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'users',
                as: 'merchantDetails',
                let: {
                  userID: '$merchantID',
                  deletedCheck: '$deletedCheck',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$$userID', '$userID'],
                          },
                          {
                            $eq: ['$deletedCheck', false],
                          },
                        ],
                      },
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
                      id: 1,
                      totalReviews: 1,
                      ratingsAverage: 1,
                      legalName: 1,
                      city: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$merchantDetails',
            },
            {
              $addFields: {
                id: '$_id',
                mediaUrl: {
                  $slice: [
                    {
                      $filter: {
                        input: '$mediaUrl',
                        as: 'mediaUrl',
                        cond: {
                          $eq: ['$$mediaUrl.type', 'Image'],
                        },
                      },
                    },
                    1,
                  ],
                },
                isFavourite: {
                  $cond: [
                    {
                      $ifNull: ['$favouriteDeal', false],
                    },
                    true,
                    false,
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                merchantMongoID: 0,
                merchantID: 0,
                subTitle: 0,
                categoryName: 0,
                subCategoryID: 0,
                subCategory: 0,
                subDeals: 0,
                availableVouchers: 0,
                aboutThisDeal: 0,
                readMore: 0,
                finePrints: 0,
                netEarnings: 0,
                isCollapsed: 0,
                isDuplicate: 0,
                totalReviews: 0,
                maxRating: 0,
                minRating: 0,
                pageNumber: 0,
                updatedAt: 0,
                __v: 0,
                endDate: 0,
                startDate: 0,
                reviewMediaUrl: 0,
                favouriteDeal: 0,
              },
            },
          ])
          .skip(parseInt(offset))
          .limit(parseInt(limit));

        if (deal.length > 0) {
          break;
        }

        if (lat == 33.5705073 && lng == 73.1434092) {
          isFound = true;
        }

        lat = 33.5705073;
        lng = 73.1434092;
      }

      return deal;
    } catch (err) {
      console.log(err);
    }
  }

  async searchDeals(
    searchBar,
    header,
    categoryName,
    subCategoryName,
    fromPrice,
    toPrice,
    reviewRating,
    offset,
    limit,
    filterCategoriesApiDto,
    req,
  ) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let filters = {};

      searchBar = searchBar.trim();

      var headerQuery = new RegExp(`${searchBar}`, 'i');
      var categoryQuery = new RegExp(`${searchBar}`, 'i');
      var subCategoryQuery = new RegExp(`${searchBar}`, 'i');

      if (header.trim().length) {
        var query = new RegExp(`${header}`, 'i');
        filters = {
          ...filters,
          dealHeader: query,
        };
      }

      let matchFilter = {};

      if (categoryName) {
        matchFilter = {
          ...matchFilter,
          categoryName: categoryName,
        };
      }

      if (subCategoryName) {
        matchFilter = {
          ...matchFilter,
          subCategory: subCategoryName,
        };
      }

      let minValue = parseInt(fromPrice);
      let maxValue = parseInt(toPrice);

      if (fromPrice && toPrice) {
        matchFilter = {
          ...matchFilter,
          minDealPrice: {
            $gte: minValue,
            $lte: maxValue,
          },
        };
      } else if (fromPrice) {
        matchFilter = {
          ...matchFilter,
          minDealPrice: {
            $gte: minValue,
          },
        };
      } else if (toPrice) {
        matchFilter = {
          ...matchFilter,
          minDealPrice: {
            $lte: maxValue,
          },
        };
      }

      let rating = parseFloat(reviewRating);

      if (reviewRating) {
        matchFilter = {
          ...matchFilter,
          ratingsAverage: {
            $gte: rating,
          },
        };
      }

      let locationFilter = {};

      if (filterCategoriesApiDto?.provincesArray?.length) {
        locationFilter = {
          ...locationFilter,
          province: { $in: filterCategoriesApiDto.provincesArray },
        };
      }

      console.log(filters);
      console.log(locationFilter);

      const totalCount: any = await this.dealModel.aggregate([
        {
          $match: {
            deletedCheck: false,
            dealStatus: DEALSTATUS.published,
            ...filters,
            ...matchFilter,
          },
        },
        {
          $addFields: {
            isHeader:{ $regexMatch: { input: "$dealHeader" , regex: headerQuery } },
            isCategory:{ $regexMatch: { input: "$categoryName" , regex: categoryQuery } },
            isSubCategory:{ $regexMatch: { input: "$subCategory" , regex: subCategoryQuery } }
          }
        },
        {
          $match: {
            $or:[
              {isCategory: true},
              {isSubCategory: true},
              {isHeader: true},
            ]   
          }
        },
        {
          $sort:{
            isCategory: -1,
            isSubCategory: -1,
            isHeader: -1,
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: 'favourites',
            as: 'favouriteDeal',
            let: {
              dealID: '$dealID',
              customerMongoID: req?.user?.id,
              deletedCheck: '$deletedCheck',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$dealID', '$dealID'],
                      },
                      {
                        $eq: ['$$customerMongoID', '$customerMongoID'],
                      },
                      {
                        $eq: ['$deletedCheck', false],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$favouriteDeal',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            as: 'merchantDetails',
            let: {
              userID: '$merchantID',
              deletedCheck: '$deletedCheck',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$userID', '$userID'],
                      },
                      {
                        $eq: ['$deletedCheck', false],
                      },
                    ],
                  },
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
                  id: 1,
                  totalReviews: 1,
                  ratingsAverage: 1,
                  legalName: 1,
                  city: 1,
                  province: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$merchantDetails',
        },
        {
          $addFields: {
            id: '$_id',
            province: '$merchantDetails.province',
            mediaUrl: {
              $slice: [
                {
                  $filter: {
                    input: '$mediaUrl',
                    as: 'mediaUrl',
                    cond: {
                      $eq: ['$$mediaUrl.type', 'Image'],
                    },
                  },
                },
                1,
              ],
            },
            isFavourite: {
              $cond: [
                {
                  $ifNull: ['$favouriteDeal', false],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            ...locationFilter,
          },
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            Between0and50: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 0],
                      },
                      {
                        $lte: ['$minDealPrice', 50],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Between50and150: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 50],
                      },
                      {
                        $lte: ['$minDealPrice', 150],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Between150and300: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 150],
                      },
                      {
                        $lte: ['$minDealPrice', 300],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Between300and450: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 300],
                      },
                      {
                        $lte: ['$minDealPrice', 450],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Plus450: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$minDealPrice', 450],
                  },
                  1,
                  0,
                ],
              },
            },
            FourUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 4],
                  },
                  1,
                  0,
                ],
              },
            },
            ThreeUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 3],
                  },
                  1,
                  0,
                ],
              },
            },
            TwoUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 2],
                  },
                  1,
                  0,
                ],
              },
            },
            OneUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 1],
                  },
                  1,
                  0,
                ],
              },
            },
            allRating: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 0],
                  },
                  1,
                  0,
                ],
              },
            },
            WestVlaanderen: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'West-Vlaanderen'],
                  },
                  1,
                  0,
                ],
              },
            },
            OostVlaanderen: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Oost-Vlaanderen'],
                  },
                  1,
                  0,
                ],
              },
            },
            Antwerpen: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Antwerpen'],
                  },
                  1,
                  0,
                ],
              },
            },
            Limburg: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Limburg'],
                  },
                  1,
                  0,
                ],
              },
            },
            VlaamsBrabant: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Vlaams-Brabant'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              ...filters,
              ...matchFilter,
            },
          },
          // {
          //   $sort: {
          //     createdAt: -1,
          //   },
          // },
          {
            $addFields: {
              isHeader:{ $regexMatch: { input: "$dealHeader" , regex: headerQuery } },
              isCategory:{ $regexMatch: { input: "$categoryName" , regex: categoryQuery } },
              isSubCategory:{ $regexMatch: { input: "$subCategory" , regex: subCategoryQuery } }
            }
          },
          {
            $match: {
              $or:[
                {isCategory: true},
                {isSubCategory: true},
                {isHeader: true},
              ]   
            }
          },
          {
            $sort:{
              isCategory: -1,
              isSubCategory: -1,
              isHeader: -1,
              createdAt: -1
            }
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                    province: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              province: '$merchantDetails.province',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $match: {
              ...locationFilter,
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        // totalDeals: totalCount,
        // filteredDeals: filteredCount,
        ...totalCount[0],
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealsByCategories(
    categoryName,
    subCategoryName,
    fromPrice,
    toPrice,
    reviewRating,
    sorting,
    offset,
    limit,
    filterCategoriesApiDto,
    req,
  ) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let matchFilter = {};

      if (categoryName) {
        matchFilter = {
          ...matchFilter,
          categoryName: categoryName,
        };
      }

      if (subCategoryName) {
        matchFilter = {
          ...matchFilter,
          subCategory: subCategoryName,
        };
      }

      let minValue = parseInt(fromPrice);
      let maxValue = parseInt(toPrice);

      if (fromPrice && toPrice) {
        matchFilter = {
          ...matchFilter,
          minDealPrice: {
            $gte: minValue,
            $lte: maxValue,
          },
        };
      } else if (fromPrice) {
        matchFilter = {
          ...matchFilter,
          minDealPrice: {
            $gte: minValue,
          },
        };
      } else if (toPrice) {
        matchFilter = {
          ...matchFilter,
          minDealPrice: {
            $lte: maxValue,
          },
        };
      }

      let rating = parseFloat(reviewRating);

      if (reviewRating) {
        matchFilter = {
          ...matchFilter,
          ratingsAverage: {
            $gte: rating,
          },
        };
      }

      let sort = {};

      if (sorting) {
        let sortPrice = sorting == SORTINGENUM.priceAsc ? 1 : -1;
        let sortRating = sorting == SORTINGENUM.ratingAsc ? 1 : -1;
        let sortDate = sorting == SORTINGENUM.dateAsc ? 1 : -1;
        console.log('sorting');
        sort = {
          ...sort,
          minDealPrice: sortPrice,
          ratingsAverage: sortRating,
          createdAt: sortDate,
        };
      }

      let locationFilter = {};

      if (filterCategoriesApiDto?.provincesArray?.length) {
        locationFilter = {
          ...locationFilter,
          province: { $in: filterCategoriesApiDto.provincesArray },
        };
      }

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: -1,
        };
      }

      console.log(sort);
      console.log(matchFilter);
      console.log(locationFilter);

      const totalCount: any = await this.dealModel.aggregate([
        {
          $match: {
            deletedCheck: false,
            dealStatus: DEALSTATUS.published,
            ...matchFilter,
          },
        },
        {
          $sort: sort,
        },
        {
          $lookup: {
            from: 'favourites',
            as: 'favouriteDeal',
            let: {
              dealID: '$dealID',
              customerMongoID: req?.user?.id,
              deletedCheck: '$deletedCheck',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$dealID', '$dealID'],
                      },
                      {
                        $eq: ['$$customerMongoID', '$customerMongoID'],
                      },
                      {
                        $eq: ['$deletedCheck', false],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$favouriteDeal',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            as: 'merchantDetails',
            let: {
              userID: '$merchantID',
              deletedCheck: '$deletedCheck',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$userID', '$userID'],
                      },
                      {
                        $eq: ['$deletedCheck', false],
                      },
                    ],
                  },
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
                  id: 1,
                  totalReviews: 1,
                  ratingsAverage: 1,
                  legalName: 1,
                  city: 1,
                  province: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$merchantDetails',
        },
        {
          $addFields: {
            id: '$_id',
            province: '$merchantDetails.province',
            mediaUrl: {
              $slice: [
                {
                  $filter: {
                    input: '$mediaUrl',
                    as: 'mediaUrl',
                    cond: {
                      $eq: ['$$mediaUrl.type', 'Image'],
                    },
                  },
                },
                1,
              ],
            },
            isFavourite: {
              $cond: [
                {
                  $ifNull: ['$favouriteDeal', false],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            ...locationFilter,
          },
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            Between0and50: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 0],
                      },
                      {
                        $lte: ['$minDealPrice', 50],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Between50and150: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 50],
                      },
                      {
                        $lte: ['$minDealPrice', 150],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Between150and300: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 150],
                      },
                      {
                        $lte: ['$minDealPrice', 300],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Between300and450: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ['$minDealPrice', 300],
                      },
                      {
                        $lte: ['$minDealPrice', 450],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            Plus450: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$minDealPrice', 450],
                  },
                  1,
                  0,
                ],
              },
            },
            FourUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 4],
                  },
                  1,
                  0,
                ],
              },
            },
            ThreeUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 3],
                  },
                  1,
                  0,
                ],
              },
            },
            TwoUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 2],
                  },
                  1,
                  0,
                ],
              },
            },
            OneUp: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 1],
                  },
                  1,
                  0,
                ],
              },
            },
            allRating: {
              $sum: {
                $cond: [
                  {
                    $gte: ['$ratingsAverage', 0],
                  },
                  1,
                  0,
                ],
              },
            },
            WestVlaanderen: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'West-Vlaanderen'],
                  },
                  1,
                  0,
                ],
              },
            },
            OostVlaanderen: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Oost-Vlaanderen'],
                  },
                  1,
                  0,
                ],
              },
            },
            Antwerpen: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Antwerpen'],
                  },
                  1,
                  0,
                ],
              },
            },
            Limburg: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Limburg'],
                  },
                  1,
                  0,
                ],
              },
            },
            VlaamsBrabant: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$province', 'Vlaams-Brabant'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
        // {
        //   $count: 'totalCount'
        // }
      ]);

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              ...matchFilter,
            },
          },
          {
            $sort: sort,
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                    province: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              province: '$merchantDetails.province',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $match: {
              ...locationFilter,
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        ...totalCount[0],
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getRecommendedForYouDeals (offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;



      const totalCount = await this.dealModel.countDocuments({
        deletedCheck: false,
        dealStatus: DEALSTATUS.published,
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
            },
          },
          {
            $sample: { size: totalCount },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));
      return {
        totalCount: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getTrendingDeals(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.dealModel.countDocuments({
        deletedCheck: false,
        dealStatus: DEALSTATUS.published,
        availableVouchers: { $gt: 0 },
        soldVouchers: { $gt: 0 },
      });

      const trendingDeals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              availableVouchers: { $gt: 0 },
              soldVouchers: { $gt: 0 },
            },
          },
          {
            $addFields: {
              id: '$_id',
              added: { $add: ['$soldVouchers', '$availableVouchers'] },
            },
          },
          {
            $addFields: {
              divided: { $divide: ['$soldVouchers', '$added'] },
              percent: {
                $multiply: ['$divided', 100],
              },
            },
          },
          {
            $addFields: {
              percent: {
                $multiply: ['$divided', 100],
              },
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              added: 0,
              divided: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
          {
            $sort: {
              percent: -1,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalDeals: totalCount,
        data: trendingDeals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getSimilarDeals(categoryName, subCategoryName, offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.dealModel.countDocuments({
        deletedCheck: false,
        dealStatus: DEALSTATUS.published,
        categoryName: categoryName,
        subCategory: subCategoryName,
      });

      const similarDeals = await this.dealModel
        .aggregate([
          {
            $match: {
              deletedCheck: false,
              dealStatus: DEALSTATUS.published,
              categoryName: categoryName,
              subCategory: subCategoryName,
            },
          },
          {
            $sort: {
              ratingsAverage: -1,
            },
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              id: '$_id',
              mediaUrl: {
                $slice: [
                  {
                    $filter: {
                      input: '$mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              merchantMongoID: 0,
              merchantID: 0,
              subTitle: 0,
              categoryName: 0,
              subCategoryID: 0,
              subCategory: 0,
              subDeals: 0,
              availableVouchers: 0,
              aboutThisDeal: 0,
              readMore: 0,
              finePrints: 0,
              netEarnings: 0,
              isCollapsed: 0,
              isDuplicate: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              pageNumber: 0,
              updatedAt: 0,
              __v: 0,
              endDate: 0,
              startDate: 0,
              reviewMediaUrl: 0,
              favouriteDeal: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        deals: similarDeals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getRecentlyViewedDeals(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      // const totalCount = await this.dealModel.countDocuments();

      let deals = await this._viewsModel
        .aggregate([
          {
            $match: {
              customerMongoID: req.user.id,
            },
          },
          {
            $group: {
              _id: '$dealID',
              viewedTime: { $last: '$viewedTime' },
            },
          },
          {
            $sort: {
              viewedTime: -1,
            },
          },
          {
            $lookup: {
              from: 'deals',
              as: 'recentlyViewed',
              localField: '_id',
              foreignField: 'dealID',
            },
          },
          {
            $unwind: '$recentlyViewed',
          },
          {
            $lookup: {
              from: 'favourites',
              as: 'favouriteDeal',
              let: {
                dealID: '$recentlyViewed.dealID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$recentlyViewed.deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$dealID', '$dealID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteDeal',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              as: 'merchantDetails',
              let: {
                userID: '$recentlyViewed.merchantID',
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$userID', '$userID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
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
                    id: 1,
                    totalReviews: 1,
                    ratingsAverage: 1,
                    legalName: 1,
                    city: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$merchantDetails',
          },
          {
            $addFields: {
              'recentlyViewed.id': '$recentlyViewed._id',
              'recentlyViewed.mediaUrl': {
                $slice: [
                  {
                    $filter: {
                      input: '$recentlyViewed.mediaUrl',
                      as: 'mediaUrl',
                      cond: {
                        $eq: ['$$mediaUrl.type', 'Image'],
                      },
                    },
                  },
                  1,
                ],
              },
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteDeal', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              id: 0,
              _id: 0,
              favouriteDeal: 0,
              'recentlyViewed._id': 0,
              'recentlyViewed.merchantMongoID': 0,
              'recentlyViewed.merchantID': 0,
              'recentlyViewed.subTitle': 0,
              'recentlyViewed.categoryName': 0,
              'recentlyViewed.subCategoryID': 0,
              'recentlyViewed.subCategory': 0,
              'recentlyViewed.subDeals': 0,
              'recentlyViewed.availableVouchers': 0,
              'recentlyViewed.aboutThisDeal': 0,
              'recentlyViewed.readMore': 0,
              'recentlyViewed.finePrints': 0,
              'recentlyViewed.netEarnings': 0,
              'recentlyViewed.isCollapsed': 0,
              'recentlyViewed.isDuplicate': 0,
              'recentlyViewed.totalReviews': 0,
              'recentlyViewed.maxRating': 0,
              'recentlyViewed.minRating': 0,
              'recentlyViewed.pageNumber': 0,
              'recentlyViewed.updatedAt': 0,
              'recentlyViewed.__v': 0,
              'recentlyViewed.endDate': 0,
              'recentlyViewed.startDate': 0,
              'recentlyViewed.reviewMediaUrl': 0,
              'recentlyViewed.favouriteDeal': 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      deals = deals.map((el) => {
        return {
          ...el.recentlyViewed,
          isFavourite: el.isFavourite,
          viewedTime: el.viewedTime,
          merchantDetails: el.merchantDetails,
        };
      });

      return {
        // totalCount: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  //   async createVoucher(voucherDto) {
  //     try {
  //       let dealId = voucherDto.dealId;
  //       delete voucherDto['dealId'];
  //       console.log(voucherDto);
  //       const deal = await this.dealModel.findOneAndUpdate(
  //         { _id: dealId },
  //         { $push: { vouchers: voucherDto } },
  //       );
  //       return deal;
  //     } catch (err) {
  //       throw new HttpException(err, HttpStatus.BAD_REQUEST);
  //     }
  //   }

  async getSalesStatistics(req) {
    try {
      const totalStats = {
        totalDeals: 0,
        scheduledDeals: 0,
        pendingDeals: 0,
        publishedDeals: 0,
      };

      const yearlyStats = {
        totalDeals: 0,
        scheduledDeals: 0,
        pendingDeals: 0,
        publishedDeals: 0,
      };

      const monthlyStats = [
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
        {
          totalDeals: 0,
          scheduledDeals: 0,
          pendingDeals: 0,
          publishedDeals: 0,
        },
      ];

      const currentDate = new Date();

      let totalDeals;
      let scheduledDeals;
      let pendingDeals;
      let publishedDeals;

      totalDeals = await this.dealModel
        .find({ merchantID: req.user.id, deletedCheck: false })
        .sort({ startDate: 1 });

      scheduledDeals = await this.dealModel
        .find({
          merchantID: req.user.id,
          dealStatus: DEALSTATUS.scheduled,
          deletedCheck: false,
        })
        .sort({ startDate: 1 });

      pendingDeals = await this.dealModel
        .find({
          merchantID: req.user.id,
          dealStatus: DEALSTATUS.inReview,
          deletedCheck: false,
        })
        .sort({ startDate: 1 });

      publishedDeals = await this.dealModel
        .find({
          merchantID: req.user.id,
          deletedCheck: false,
          dealStatus: DEALSTATUS.published,
        })
        .sort({ startDate: 1 });

      totalDeals.forEach((data) => {
        let currentDocDate = new Date(data.startDate);
        totalStats.totalDeals = totalStats.totalDeals + 1;
        if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
          monthlyStats[currentDocDate.getMonth()].totalDeals =
            monthlyStats[currentDocDate.getMonth()].totalDeals + 1;
        }
      });

      scheduledDeals.forEach((data) => {
        let currentDocDate = new Date(data.createdAt);
        totalStats.scheduledDeals = totalStats.scheduledDeals + 1;
        if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
          monthlyStats[currentDocDate.getMonth()].scheduledDeals =
            monthlyStats[currentDocDate.getMonth()].scheduledDeals + 1;
        }
      });

      pendingDeals.forEach((data) => {
        let currentDocDate = new Date(data.createdAt);
        totalStats.pendingDeals = totalStats.pendingDeals + 1;
        if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
          monthlyStats[currentDocDate.getMonth()].pendingDeals =
            monthlyStats[currentDocDate.getMonth()].pendingDeals + 1;
        }
      });

      publishedDeals.forEach((data: any) => {
        let currentDocDate = new Date(data.createdAt);
        totalStats.publishedDeals = totalStats.publishedDeals + 1;
        if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
          monthlyStats[currentDocDate.getMonth()].publishedDeals =
            monthlyStats[currentDocDate.getMonth()].publishedDeals + 1;
        }
      });

      for (let i = 0; i < monthlyStats.length; i++) {
        yearlyStats.totalDeals =
          yearlyStats.totalDeals + monthlyStats[i].totalDeals;
        yearlyStats.scheduledDeals =
          yearlyStats.scheduledDeals + monthlyStats[i].scheduledDeals;
        yearlyStats.pendingDeals =
          yearlyStats.pendingDeals + monthlyStats[i].pendingDeals;
        yearlyStats.publishedDeals =
          yearlyStats.publishedDeals + monthlyStats[i].publishedDeals;
      }

      return {
        monthlyStats,
        yearlyStats,
        totalStats,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeMediaURL() {
    let deals = await this.dealModel.find();
    deals = JSON.parse(JSON.stringify(deals));

    for await (let deal of deals) {
      let updatedMediaArr = [];
      if (deal?.mediaUrl?.length) {
        for await (let mediaObj of deal?.mediaUrl) {
          if (typeof mediaObj == 'string') {
            let tempMediaObj: string = mediaObj;
            let updatedMedia = tempMediaObj.replace(
              '//dividealapi',
              '//stagingdividealapi',
            );

            updatedMediaArr.push(updatedMedia);
          }
        }

        await this.dealModel.updateOne(
          { _id: deal.id },
          { mediaUrl: updatedMediaArr },
        );
        console.log('deals changed', deal.id);
      }
    }
  }

  async buyNow(buyNowDto, req) {
    try {
      const deal = await this.dealModel.findOne({ dealID: buyNowDto.dealID });
      debugger;
      if (!deal) {
        throw new Error('Deal ID not found!');
      }

      const merchant = await this._userModel.findOne({
        userID: deal.merchantID,
        deletedCheck: false,
      });

      const customer = await this._userModel.findById(req.user.id);

      const affiliate = await this._userModel.findOne({
        userID: buyNowDto.affiliateID,
        deletedCheck: false,
      });

      if (!affiliate) {
        throw new Error('Affiliate doesnot exist!');
      }

      const subDeal = deal.subDeals.find(
        (el) => el.subDealID == buyNowDto.subDealID,
      );

      if (subDeal.numberOfVouchers < buyNowDto.quantity) {
        throw new Error('Insufficent Quantity of deal present!');
      }

      let dealVouchers = 0,
        soldVouchers = 0;
      deal.subDeals = deal.subDeals.map((element) => {
        if (buyNowDto.subDealID === element['subDealID']) {
          element.soldVouchers += buyNowDto.quantity;
          element.numberOfVouchers -= buyNowDto.quantity;
        }

        dealVouchers += element.numberOfVouchers;
        soldVouchers += element.soldVouchers;

        return element;
      });

      deal.soldVouchers = soldVouchers;
      deal.availableVouchers -= buyNowDto.quantity;

      let imageURL = {};

      let payment = (subDeal.dealPrice * buyNowDto.quantity).toString();

      let description = `Customer with id ${req.user.id} and email address ${customer.email} is buying ${buyNowDto.quantity} vouchers of sub deal ${subDeal.title}`;

      let userId = req.user.id;

      let card = buyNowDto.card;

      let stripePaymentDto: StripePaymentDTO = {
        card,
        payment,
        description,
        userId,
      };

      const stripeResponse: any = await this._stripeService.checkout(
        stripePaymentDto,
        req,
      );

      deal?.mediaUrl.forEach((el) => {
        if (el.type == 'Image' && Object.keys(imageURL).length === 0) {
          imageURL = {
            ...el,
          };
        }
      });

      let expiryDate;

      if (subDeal.voucherStartDate > 0) {
        expiryDate = subDeal.voucherEndDate;
      } else {
        expiryDate =
          new Date().getTime() + subDeal?.voucherValidity * 24 * 60 * 60 * 1000;
      }

      let merchantPercentage = merchant.platformPercentage / 100;
      affiliate.platformPercentage = merchant.platformPercentage / 100;

      const calculatedFee = subDeal.dealPrice * merchantPercentage; // A percentage of amount that will go to divideals from the entire amount

      const netFee = subDeal.dealPrice - merchantPercentage * subDeal.dealPrice; // Amount that will be paid to the merchant by the divideals

      const calculatedFeeForAffiliate =
        calculatedFee * affiliate.platformPercentage; // A percentage of amount that will go to affiliate from the the amount earned by the platform

      subDeal.grossEarning += subDeal.dealPrice;
      subDeal.netEarning += netFee;

      let voucherDto: any = {
        voucherHeader: subDeal.title,
        dealHeader: deal.dealHeader,
        dealID: deal.dealID,
        dealMongoID: deal._id,
        subDealHeader: subDeal.title,
        subDealID: subDeal.subDealID,
        subDealMongoID: subDeal._id,
        amount: subDeal.dealPrice,
        net: netFee.toFixed(2),
        fee: calculatedFee.toFixed(2),
        status: VOUCHERSTATUSENUM.purchased,
        merchantID: deal.merchantID,
        merchantMongoID: merchant.id,
        merchantPaymentStatus: MERCHANTPAYMENTSTATUS.pending,
        affiliateName: affiliate.firstName + ' ' + affiliate.lastName,
        affiliateID: buyNowDto.affiliateID,
        affiliatePercentage: merchant.platformPercentage,
        affiliateFee: calculatedFeeForAffiliate.toFixed(2),
        affiliatePaymentStatus: AFFILIATEPAYMENTSTATUS.pending,
        platformPercentage: merchant.platformPercentage,
        customerID: customer.userID,
        affiliateMongoID: affiliate.id,
        customerMongoID: customer.id,
        imageURL,
        dealPrice: subDeal.dealPrice,
        originalPrice: subDeal.originalPrice,
        discountedPercentage: subDeal.discountPercentage,
        expiryDate,
        deletedCheck: false,
        paymentStatus: BILLINGSTATUS.paid,
      };

      // const categoryAnalytics = await this.categoryAnalyticsModel.findOne({customerID: customer.userID, categoryName: deal.categoryName});
      // if (categoryAnalytics) {
      //   await this.categorymodel.updateOne({_id: categoryAnalytics._id},{$inc:{count: 1}});
      // } else if (!categoryAnalytics) {
      //   let dealCategoryAnalyticsDto: any = {
      //     customerID: customer.userID,
      //     categoryName: deal.categoryName,
      //     // subCategoryName: deal.subCategory,
      //     count: 1
      //   };

      //   await new this.categorymodel(dealCategoryAnalyticsDto).save();
      // }

      let vouchers: any = [];
      for (let i = 0; i < buyNowDto.quantity; i++) {
        vouchers.push = this._voucherService.createVoucher(voucherDto);
      }
      await Promise.all(vouchers);

      const emailDto = getEmailHTML(
        customer.email,
        customer.firstName,
        customer.lastName,
      );

      await this.dealModel.updateOne({ dealID: buyNowDto.dealID }, deal);

      await this._userModel.updateOne(
        { userID: deal.merchantID },
        {
          purchasedVouchers: merchant.purchasedVouchers + buyNowDto.quantity,
          totalEarnings: merchant.totalEarnings + netFee,
        },
      );

      this.sendMail(emailDto);

      return { message: 'Purchase Successfull!' };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendMail(emailDto: EmailDTO) {
    // create reusable transporter object using the default SMTP transport

    // send mail with defined transport object
    var mailOptions = {
      from: emailDto.from,
      to: emailDto.to,
      subject: emailDto.subject,
      text: emailDto.text,
      html: emailDto.html,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        // res.redirect('/');
      }
    });
  }
}
