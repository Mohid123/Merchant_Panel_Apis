import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SORT } from '../../enum/sort/sort.enum';
import { VoucherInterface } from '../../interface/deal/deal.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel('Voucher')
    private readonly voucherModel: Model<VoucherInterface>,
    @InjectModel('Counter')
    private readonly voucherCounterModel: Model<VoucherCounterInterface>,
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

    return 'V' + sequenceDocument.sequenceValue;
  }

  async createVoucher(voucherDto) {
    try {
      let timeStamp = new Date(voucherDto.boughtDate).getTime();
      voucherDto.boughtDate = timeStamp;
      voucherDto.voucherID = await this.generateVoucherId('voucherID');
      const voucher = new this.voucherModel(voucherDto);

      return await voucher.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async searchByVoucherId(voucherId) {
    try {
      const voucher = await this.voucherModel.find({ voucherID: voucherId });
      if (!voucher) {
        throw new HttpException('No record Found', HttpStatus.NOT_FOUND);
      }
      return voucher;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllVouchersByMerchantID(
    deal,
    voucher,
    amount,
    fee,
    net,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    merchantId,
    voucherID,
    dealHeader,
    voucherHeader,
    voucherStatus,
    invoiceStatus,
    offset,
    limit,
    multipleVouchersDto,
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

      if (paymentStatus) {
        matchFilter = {
          ...matchFilter,
          paymentStatus: paymentStatus,
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
              boughtDate: {
                ...dateFromFilters,
              },
            },
            {
              boughtDate: {
                ...dateToFilters,
              },
            },
          ],
        };
      }

      let sort = {};

      if (deal) {
        let sortDeal = deal == SORT.ASC ? 1 : -1;
        console.log('deal');
        sort = {
          ...sort,
          dealHeader: sortDeal,
        };
      }
      if (voucher) {
        let sortVoucher = voucher == SORT.ASC ? 1 : -1;
        console.log('voucher');
        sort = {
          ...sort,
          voucherHeader: sortVoucher,
        };
      }
      if (amount) {
        let sortAmount = amount == SORT.ASC ? 1 : -1;
        console.log('amount');
        sort = {
          ...sort,
          amount: sortAmount,
        };
      }
      if (fee) {
        let sortFee = fee == SORT.ASC ? 1 : -1;
        console.log('fee');
        sort = {
          ...sort,
          fee: sortFee,
        };
      }
      if (net) {
        let sortNet = net == SORT.ASC ? 1 : -1;
        console.log('net');
        sort = {
          ...sort,
          net: sortNet,
        };
      }

      voucherID = voucherID.trim();
      dealHeader = dealHeader.trim();
      voucherHeader = voucherHeader.trim();
      voucherStatus = voucherStatus.trim();
      invoiceStatus = invoiceStatus.trim();

      let filters = {};

      if (voucherID.trim().length) {
        var query = new RegExp(`${voucherID}`, 'i');
        filters = {
          ...filters,
          voucherID: query,
        };
      }

      if (dealHeader.trim().length) {
        var query = new RegExp(`${dealHeader}`, 'i');
        filters = {
          ...filters,
          dealHeader: query,
        };
      }

      if (voucherHeader.trim().length) {
        var query = new RegExp(`${voucherHeader}`, 'i');
        filters = {
          ...filters,
          voucherHeader: query,
        };
      }

      if (voucherStatus.trim().length) {
        var query = new RegExp(`${voucherStatus}`, 'i');
        filters = {
          ...filters,
          status: query,
        };
      }

      if (invoiceStatus.trim().length) {
        var query = new RegExp(`${invoiceStatus}`, 'i');
        filters = {
          ...filters,
          paymentStatus: query,
        };
      }

      if (multipleVouchersDto?.voucherIDsArray?.length) {
        filters = {
          ...filters,
          voucherID: { $in: multipleVouchersDto.voucherIDsArray },
        };
      }

      if (multipleVouchersDto?.dealHeaderArray?.length) {
        filters = {
          ...filters,
          dealHeader: { $in: multipleVouchersDto.dealHeaderArray },
        };
      }

      if (multipleVouchersDto?.voucherHeaderArray?.length) {
        filters = {
          ...filters,
          voucherHeader: { $in: multipleVouchersDto.voucherHeaderArray },
        };
      }

      if (multipleVouchersDto?.voucherStatusArray?.length) {
        filters = {
          ...filters,
          status: { $in: multipleVouchersDto.voucherStatusArray },
        };
      }

      if (multipleVouchersDto?.invoiceStatusArray?.length) {
        filters = {
          ...filters,
          paymentStatus: { $in: multipleVouchersDto.invoiceStatusArray },
        };
      }

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: 1,
        };
      }

      console.log(sort);
      console.log(matchFilter);

      const totalCount = await this.voucherModel.countDocuments({
        merchantID: merchantId,
        ...matchFilter,
        ...filters,
      });

      const filteredCount = await this.voucherModel.countDocuments({
        merchantID: merchantId,
        // ...matchFilter,
        // ...filters,
      });

      let vouchers = await this.voucherModel
        .aggregate([
          {
            $match: {
              merchantID: merchantId,
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
        totalCount: totalCount,
        filteredCount,
        data: vouchers,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
