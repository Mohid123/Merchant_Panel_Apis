import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import { generateStringId } from '../file-management/utils/utils';

@Injectable()
export class DealService {
  constructor(
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('Category') private categorymodel: Model<CategoryInterface>
  ) {}

  async createDeal(dealDto) {
    try {
      const category = await this.categorymodel.findOne({
        type: dealDto.categoryType,
      });

      let stamp = new Date(dealDto.startDate).getTime();
      dealDto.startDate = stamp;
      stamp = new Date(dealDto.endDate).getTime();
      dealDto.endDate = stamp;

      dealDto.categoryName = dealDto.categoryType;
      dealDto.categoryType = category.id;

      dealDto.dealStatus = DEALSTATUS.inReview;

      dealDto.vouchers = dealDto.vouchers.map((el) => {
        let startTime;
        let endTime;
        let calculateDiscountPercentage =
          ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
        el.discountPercentage = calculateDiscountPercentage;

        if (el.voucherValidity > 0) {
          startTime = new Date(new Date()).getTime();
          endTime = startTime + el.voucherValidity * 24 * 60 * 60 * 1000;
        } else {
          startTime = new Date(el.voucherStartDate).getTime();
          endTime = new Date(el.voucherEndDate).getTime();
        }

        el._id = generateStringId();
        el.voucherStartDate = startTime;
        el.voucherEndDate = endTime;

        return el;
      });

      const deal = await this.dealModel.create(dealDto);
      return deal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async approveRejectDeal (dealID, dealStatusDto) {

    let deal = await this.dealModel.findOne({_id: dealID, deletedCheck: false, dealStatus: DEALSTATUS.inReview});

    if (dealStatusDto.dealStatus == DEALSTATUS.scheduled) {
      return await this.dealModel.updateOne({_id: deal.id}, {dealStatus: DEALSTATUS.scheduled})
    } else if (dealStatusDto.dealStatus == DEALSTATUS.bounced) {
      return await this.dealModel.updateOne({_id: deal.id}, {dealStatus: DEALSTATUS.bounced})
    }
  }

  async getAllDeals(offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;
      
      const totalCount = await this.dealModel.countDocuments({deletedCheck: false});

      let deals = await this.dealModel.aggregate(
        [
          {
            $match: {
              deletedCheck: false
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
            {
              $addFields: {
                id: "$_id",
              },
            },
            {
              $project: {
                _id: 0,
              },
            }
        ]
      )
      .skip(parseInt(offset))
      .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        data: deals
      };

    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDeal(id) {
    try {
      const deals = await this.dealModel.findOne({_id: id, deletedCheck: false});
      return deals;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealByMerchant(id) {
    try {
      const deal = await this.dealModel.findOne({ merchantId: id, deletedCheck: false });
      return deal;
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

  async getSalesStatistics (req) {
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
      .find({ merchantId: req.user.id, deletedCheck: false })
      .sort({ startDate: 1 });

    scheduledDeals = await this.dealModel
      .find({ merchantId: req.user.id, dealStatus: DEALSTATUS.scheduled, deletedCheck: false })
      .sort({ startDate: 1 });

    pendingDeals = await this.dealModel
      .find({ merchantId: req.user.id, nftStatus: DEALSTATUS.inReview, deletedCheck: false })
      .sort({ startDate: 1 });

      publishedDeals = await this.dealModel
      .find({ merchantId: req.user.id, deletedCheck: false, dealStatus: DEALSTATUS.published })
      .sort({ startDate: 1 })

      totalDeals.forEach((data) => {
      let currentDocDate = new Date(data.startDate);
      totalStats.totalDeals =
      totalStats.totalDeals + 1;
      if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
        monthlyStats[currentDocDate.getMonth()].totalDeals =
          monthlyStats[currentDocDate.getMonth()].totalDeals + 1;
      }
    });

    scheduledDeals.forEach((data) => {
      let currentDocDate = new Date(data.createdAt);
      totalStats.scheduledDeals =
      totalStats.scheduledDeals + 1;
      if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
        monthlyStats[currentDocDate.getMonth()].scheduledDeals =
          monthlyStats[currentDocDate.getMonth()].scheduledDeals + 1;
      }
    });

    // profit.forEach((data) => {
    //   let currentDocDate = new Date(data.eventDate);
    //   totalStats.profit =
    //   totalStats.profit +
    //   parseFloat(data.price);
    //   if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
    //     monthlyStats[currentDocDate.getMonth()].profit =
    //       monthlyStats[currentDocDate.getMonth()].profit +
    //       parseFloat(data.price);
    //   }
    // });

    pendingDeals.forEach((data) => {
      let currentDocDate = new Date(data.createdAt);
      totalStats.pendingDeals = totalStats.pendingDeals + 1;
      if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
        monthlyStats[currentDocDate.getMonth()].pendingDeals =
          monthlyStats[currentDocDate.getMonth()].pendingDeals + 1;
      }
    });

    publishedDeals.forEach((data:any)=>{
      let currentDocDate = new Date(data.createdAt);
      totalStats.publishedDeals = totalStats.publishedDeals + 1
      if (currentDocDate.getFullYear() === currentDate.getFullYear()) {
        monthlyStats[currentDocDate.getMonth()].publishedDeals =
          monthlyStats[currentDocDate.getMonth()].publishedDeals + 1
      }
    });
    
    for (let i = 0; i < monthlyStats.length; i++) {
      yearlyStats.totalDeals = yearlyStats.totalDeals + monthlyStats[i].totalDeals;
      yearlyStats.scheduledDeals = yearlyStats.scheduledDeals + monthlyStats[i].scheduledDeals;
      yearlyStats.pendingDeals = yearlyStats.pendingDeals + monthlyStats[i].pendingDeals;
      yearlyStats.publishedDeals = yearlyStats.publishedDeals +  monthlyStats[i].publishedDeals;
    }

    return {
      monthlyStats,
      yearlyStats,
      totalStats,
    };
  }

}
