import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VoucherInterface } from 'src/interface/deal/deal.interface';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel('Voucher')
    private readonly voucherModel: Model<VoucherInterface>,
  ) {}

  async createVoucher(voucherDto) {
    try {
      const voucher = new this.voucherModel(voucherDto);

      return await voucher.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllVouchers(merchantId, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this.voucherModel.countDocuments({
        merchantId: merchantId,
        deletedCheck: false,
      });

      let vouchers = await this.voucherModel
        .aggregate([
          {
            $match: {
              merchantId: merchantId,
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
        data: vouchers,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
