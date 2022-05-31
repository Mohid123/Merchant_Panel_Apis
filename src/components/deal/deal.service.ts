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

    return sequenceDocument.sequenceValue;
  }

  async createDeal(dealDto, req) {
    try {
      console.log(dealDto);
      var dealVouchers = 0;
      var delaSoldVocuhers = 0;

      let category = await this.categorymodel.findOne({
        categoryName: req.user.businessType,
      });
      dealDto.categoryName = req.user.businessType;
      dealDto.categoryID = category.id;

      if (dealDto.subCategory) {
        let subCategory = await this.subCategoryModel.findOne({
          subCategoryName: dealDto.subCategory,
        });
        dealDto.subCategoryID = subCategory.id;
      }

      dealDto.dealID = await this.generateVoucherId('dealID');

      let stamp = new Date(dealDto.startDate).getTime();
      dealDto.startDate = stamp;
      stamp = new Date(dealDto.endDate).getTime();
      dealDto.endDate = stamp;

      dealDto.dealHeader = dealDto.dealHeader.toUpperCase();

      dealDto.merchantID = req.user.id;

      dealDto.dealStatus = DEALSTATUS.inReview;

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

      dealDto.availableVouchers = dealVouchers;
      // dealDto.soldVouchers = delaSoldVocuhers;

      const deal = await this.dealModel.create(dealDto);
      return deal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async updateDeal(updateDealDto, dealID) {
    const deal = await this.dealModel.findById(dealID);

    let dealVouchers = 0;
    let stamp = new Date(updateDealDto.endDate).getTime();
    updateDealDto.endDate = stamp;

    deal.endDate = updateDealDto.endDate;

    deal.vouchers = deal.vouchers.map((element) => {
      updateDealDto.vouchers.forEach((el) => {
        if (el['voucherID'] === element['_id']) {
          element.numberOfVouchers += el.numberOfVouchers;
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
    } else if (dealStatusDto.dealStatus == DEALSTATUS.bounced) {
      return await this.dealModel.updateOne(
        { _id: deal.id },
        { dealStatus: DEALSTATUS.bounced },
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
                dealID: id,
              },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$dealID', '$$dealID'],
                        },
                        {
                          $eq: ratingFilter['eq'],
                        },
                      ],
                    },
                  },
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
        throw new HttpException('SOmething went wrong', HttpStatus.BAD_REQUEST);
      }

      return { status: 'success', message: 'Deal deleted successfully!' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealsReviewStatsByMerchant(id, offset, limit) {
    offset = parseInt(offset) < 0 ? 0 : offset;
    limit = parseInt(limit) < 1 ? 10 : limit;
    try {
      const totalCount = await this.dealModel.countDocuments({
        merchantID: id,
        deletedCheck: false,
      });

      // const deals = await this.dealModel
      //   .find({
      //     merchantId: id,
      //     deletedCheck: false,
      //   })
      //   .skip(parseInt(offset))
      //   .limit(parseInt(limit));

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantID: id,
              deletedCheck: false,
            },
          },
          {
            $project: {
              dealHeader: 1,
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

      return {
        totalDeals: totalCount,
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
    offset,
    limit,
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
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantID: merchantID,
              deletedCheck: false,
              ...matchFilter,
            },
          },
          {
            $sort: sort,
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
