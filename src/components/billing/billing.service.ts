import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillingInterface } from 'src/interface/billing/billing.interface';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel('Billing')
    private readonly billingModel: Model<BillingInterface>,
  ) {}

  async createBilling(billingDto) {
    try {
      billingDto.transactionDate = new Date(
        billingDto.transactionDate,
      ).getTime();

      const billing = await new this.billingModel(billingDto).save();

      return billing;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getBill(id) {
    try {
      const bill = await this.billingModel.find({ transactionID: id });
      return bill;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllBillings(offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;
      const totalBilling = await this.billingModel.countDocuments();
      let billings = await this.billingModel
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
        totalBilling,
        data: billings,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
