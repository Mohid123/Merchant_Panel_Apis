import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import { generateStringId } from '../file-management/utils/utils';
import { SORT } from '../../enum/sort/sort.enum';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { arrayBuffer } from 'stream/consumers';
import { RATINGENUM } from 'src/enum/review/ratingValue.enum';
import { UsersInterface } from 'src/interface/user/users.interface';

@Injectable()
export class DealService {
  constructor(
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('Category')
    private readonly categorymodel: Model<CategoryInterface>,
    @InjectModel('Counter')
    private readonly voucherCounterModel: Model<VoucherCounterInterface>,
    @InjectModel('SubCategory')
    private readonly subCategoryModel: Model<SubCategoryInterface>,
    @InjectModel('User')
    private readonly _userModel: Model<UsersInterface>,
  ) {}

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

    return 'D' + sequenceDocument.sequenceValue;
  }

  async createDeal(dealDto, req) {
    try {
      var dealVouchers = 0;
      var delaSoldVocuhers = 0;
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
      }

      if (!savedDeal) {
        dealDto.dealID = await this.generateVoucherId('dealID');
      }

      if (dealDto.startDate && dealDto.endDate) {
        let stamp = new Date(dealDto.startDate).getTime();
        dealDto.startDate = stamp;
        stamp = new Date(dealDto.endDate).getTime();
        dealDto.endDate = stamp;
      }
      if (!savedDeal) {
        dealDto.dealHeader = dealDto.dealHeader.toUpperCase();

        dealDto.merchantID = req.user.id;
        if (dealDto.dealStatus) {
          dealDto.dealStatus = DEALSTATUS.inReview;
        }
      }

      if (dealDto.vouchers) {
        dealDto.vouchers = dealDto.vouchers.map((el) => {
          let startTime;
          let endTime;
          let calculateDiscountPercentage =
            ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
          el.discountPercentage = calculateDiscountPercentage;

          dealVouchers += el.numberOfVouchers;
          el.soldVouchers = 0;
          // delaSoldVocuhers += el?.soldVouchers;

          if (el.voucherValidity > 0) {
            startTime = 0;
            endTime = 0;
          } else {
            startTime = new Date(el.voucherStartDate).getTime();
            endTime = new Date(el.voucherEndDate).getTime();
          }

          el._id = generateStringId();
          el.voucherStartDate = startTime;
          el.voucherEndDate = endTime;

          return el;
        });
      }

      if (dealDto.mediaUrl) {
        for (let i = 0; i < dealDto.mediaUrl.length; i++) {
          if (dealDto.mediaUrl[i].type == 'video') {
            console.log('Inside if');
            var item = dealDto.mediaUrl.splice(i, 1);
            dealDto.mediaUrl.splice(0, 0, item[0]);
          }
        }
      }

      dealDto.availableVouchers = dealVouchers;
      dealDto.soldVouchers = delaSoldVocuhers;

      if (!savedDeal) {
        const deal = await this.dealModel.create(dealDto);
        return deal;
      }

      await this.dealModel.updateOne({ _id: dealDto.id }, dealDto);

      return this.dealModel.findOne({ _id: dealDto.id });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async updateDeal(updateDealDto, dealID) {
    updateDealDto.vouchers = [updateDealDto.vouchers]
    const deal = await this.dealModel.findById(dealID);

    let dealVouchers = 0;

    deal.vouchers = deal.vouchers.map((element) => {
      updateDealDto.vouchers.forEach((el) => {

        let calculateDiscountPercentage =
            ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
          el.discountPercentage = calculateDiscountPercentage;

        if (el['voucherID'] === element['_id']) {
          element.numberOfVouchers += el.numberOfVouchers;
          element.subTitle = el.subTitle;
          element.originalPrice = el.originalPrice;
          element.dealPrice = el.dealPrice;
          element.discountPercentage = calculateDiscountPercentage;
        }
      });

      dealVouchers += element.numberOfVouchers;

      return element;
    });

    deal.availableVouchers = dealVouchers;

    await this.dealModel.findByIdAndUpdate(dealID, deal);

    return { message: 'Deal Updated Successfully' };
  }

  async approveRejectDeal(dealID, dealStatusDto) {
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

  async getDeal(id) {
    try {
      const deals = await this.dealModel.findOne({
        _id: id,
        deletedCheck: false,
      });
      return deals;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealReviews(offset, limit, rating, id) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

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
      console.log(ratingFilter['eq']);
      const deal = await this.dealModel
        .aggregate([
          {
            $match: {
              _id: id,
            },
          },
          {
            $project: {
              dealHeader: 1,
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
                  },
                },
                {
                  $lookup: {
                    from: 'reviewText',
                    as: 'merchantReplyText',
                    localField: '_id',
                    foreignField: 'reviewID'
                  }
                },
                {
                  $unwind: '$merchantReplyText',
                },
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
    averageRating,
    dealID,
    offset,
    limit,
    multipleReviewsDto
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
      
      let minValue;
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
            break;
        }
      }

      if (averageRating !== RATINGENUM.all) {
        matchFilter = {
          ...matchFilter,
          ratingsAverage: {
            $gte: minValue,
          },
        };
      }

      if( multipleReviewsDto?.dealIDsArray?.length){
        filters = {
          ...filters,
          dealID: { $in: multipleReviewsDto.dealIDsArray },
        };
      };

      const totalCount = await this.dealModel.countDocuments({
        merchantID: id,
        deletedCheck: false,
        ...matchFilter,
        ...filters
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantID: id,
              deletedCheck: false,
              ...matchFilter,
              ...filters,
              totalReviews: {$gt: 0}
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
            merchantID: id,
            deletedCheck: false,
            ...matchFilter
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
        // totalDeals: totalCount,
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
    multipleDealsDto
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

      if( multipleDealsDto?.dealIDsArray?.length){
        filters = {
          ...filters,
          dealID: { $in: multipleDealsDto.dealIDsArray },
        };
      }

      if( multipleDealsDto?.dealHeaderArray?.length){
        filters = {
          ...filters,
          dealHeader: { $in: multipleDealsDto.dealHeaderArray },
        };
      }

      if( multipleDealsDto?.dealStatusArray?.length){
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
        merchantID: merchantID,
        deletedCheck: false,
        ...matchFilter,
        ...filters
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantID: merchantID,
              deletedCheck: false,
              ...matchFilter,
              ...filters
            },
          },
          {
            $sort: sort,
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
        totalDeals: totalCount,
        data: deals,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getTopRatedDeals(merchantID) {
    try {
      const deals = this.dealModel
        .aggregate([
          {
            $match: {
              merchantID: merchantID,
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
  }
}
