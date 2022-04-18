import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { stat } from 'fs';
import { Model } from 'mongoose';
import { SORT } from 'src/enum/sort/sort.enum';
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

  async getBillingsByMerchant(
    paymentMethod,
    amount,
    date,
    status,
    dateFrom,
    dateTo,
    offset,
    limit,
    merchantId,
  ) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      dateFrom = parseInt(dateFrom);
      dateTo = parseInt(dateTo);

      let dateToFilters = {};
      let dateFromFilters = {};
      let matchFilter = {};

      if (status) {
        matchFilter = {
          ...matchFilter,
          status: status,
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
          transactionDate: {
            ...dateFromFilters,
            ...dateToFilters,
          },
        };
      }

      let sort = {};

      if (paymentMethod) {
        let sortByPayment = paymentMethod == SORT.ASC ? 1 : -1;
        console.log('paymentMethod');
        sort = {
          ...sort,
          paymentMethod: sortByPayment,
        };
      }
      if (amount) {
        let sortamount = amount == SORT.ASC ? 1 : -1;
        console.log('amount');
        sort = {
          ...sort,
          amount: sortamount,
        };
      }
      if (date) {
        let sortDate = date == SORT.ASC ? 1 : -1;
        console.log('date');
        sort = {
          ...sort,
          transactionDate: sortDate,
        };
      }

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: 1,
        };
      }

      console.log(sort);
      console.log(matchFilter);
      console.log(status);

      const totalCount = await this.billingModel.countDocuments({
        merchantID: merchantId,
        ...matchFilter,
      });

      const billings = await this.billingModel
        .aggregate([
          {
            $match: {
              merchantID: merchantId,
              ...matchFilter,
            },
          },
          {
            $sort: sort,
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return { totalBillings: totalCount, billings };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
