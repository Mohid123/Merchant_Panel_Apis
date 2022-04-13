import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from 'src/enum/deal/dealstatus.enum';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import { generateStringId } from '../file-management/utils/utils';
import { SORT } from '../../enum/sort/sort.enum';
import { DealStatusDto } from 'src/dto/deal/updatedealstatus.dto';
import { DealDto } from 'src/dto/deal/deal.dto';

@Injectable()
export class DealService {
  constructor(
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('Category') private categorymodel: Model<CategoryInterface>,
  ) {}

  async createDeal(dealDto, req) {
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

      dealDto.title = dealDto.title.toUpperCase();

      dealDto.merchantId = req.user.id;

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
        merchantId: req.user.id,
        deletedCheck: false,
      });

      let deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantId: req.user.id,
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

  async getDealByMerchant(id) {
    try {
      const deal = await this.dealModel.findOne({
        merchantId: id,
        deletedCheck: false,
      });
      return deal;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDeals(
    title,
    price,
    startDate,
    endDate,
    dateFrom,
    dateTo,
    offset,
    limit,
    req,
  ) {
    try {
      dateFrom = parseInt(dateFrom);
      dateTo = parseInt(dateTo);

      let dateToFilters = {};
      let dateFromFilters = {};
      let matchFilter = {};

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

      if (title) {
        let sortTitle = title == SORT.ASC ? 1 : -1;
        console.log('title');
        sort = {
          ...sort,
          title: sortTitle,
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

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: 1,
        };
      }

      console.log(sort);
      console.log(matchFilter);

      const totalCount = await this.dealModel.countDocuments({
        merchantId: req.user.id,
        deletedCheck: false,
        ...matchFilter,
      });

      const deals = await this.dealModel
        .aggregate([
          {
            $match: {
              merchantId: req.user.id,
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

      return { totalDeals: totalCount, deals };
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
}
