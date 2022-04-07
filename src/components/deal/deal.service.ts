import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryInterface } from '../../interface/category/category.interface';
import { DealInterface } from '../../interface/deal/deal.interface';
import { generateStringId } from '../file-management/utils/utils';

@Injectable()
export class DealService {
  constructor(
    @InjectModel('Deal')
    private readonly dealModel: Model<DealInterface>,
    @InjectModel('Category')
    private categorymodel: Model<CategoryInterface>,
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

      dealDto.vouchers = dealDto.vouchers.map((el) => {
        let startTime;
        let endTime;
        let discountPercentage =
          ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
        el.discountPercentage = discountPercentage;

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

  async getAllDeals() {
    try {
      const deals = await this.dealModel.find();
      return deals;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDeal(id) {
    try {
      const deals = await this.dealModel.findById(id);
      return deals;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getDealByMerchant(id) {
    try {
      const deal = await this.dealModel.find({ merchantId: id });
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
}
