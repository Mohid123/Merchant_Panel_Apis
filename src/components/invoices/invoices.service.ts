import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BILLINGSTATUS } from 'src/enum/billing/billingStatus.enum';
import { INVOICEAMOUNTENUM } from '../../enum/sorting/sortinvoiceamount.enum';
import { INVOICEDATEENUM } from '../../enum/sorting/sortinvoicedate.enum';
import { InvoiceInterface } from '../../interface/invoices/invoices.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel('Invoices')
    private readonly _invoicesModel: Model<InvoiceInterface>,
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

    const year = new Date().getFullYear() % 2000;

    return `INV-BE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${
      sequenceDocument.sequenceValue < 10000 ? '0' : ''
    }${sequenceDocument.sequenceValue}`;
  }

  async createInvoice(invoiceDto) {
    try {
      invoiceDto.invoiceID = await this.generateVoucherId('invoiceID');

      invoiceDto.invoiceDate = new Date().getTime();

      return await new this._invoicesModel(invoiceDto).save();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getInvoice(invoiceURL) {
    try {
      return await this._invoicesModel.findOne({ invoiceURL: invoiceURL });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllInvoices(offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let totalCount = await this._invoicesModel.countDocuments();

      let invoices = await this._invoicesModel
        .aggregate([
          {
            $sort: {
              invoiceDate: -1,
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
        data: invoices,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllInvoicesByMerchant(
    merchantID,
    dateFrom,
    dateTo,
    invoiceDate,
    invoiceAmount,
    status,
    invoiceID,
    offset,
    limit,
    multipleInvoicesDto,
  ) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

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
        dateTo = dateTo + 24 * 60 * 60 * 1000;
        dateToFilters = {
          ...dateToFilters,
          $lte: dateTo,
        };
      } else {
        dateTo = dateFrom + 24 * 60 * 60 * 1000;
        dateToFilters = {
          ...dateToFilters,
          $lte: dateTo,
        };
      }

      if (status) {
        matchFilter = {
          ...matchFilter,
          status: status,
        };
      }

      if (dateFrom || dateTo) {
        matchFilter = {
          ...matchFilter,
          invoiceDate: {
            ...dateFromFilters,
            ...dateToFilters,
          },
        };
      }

      let sortFilters = {};

      let sortInvoiceDate;

      if (invoiceDate) {
        if (invoiceDate == INVOICEDATEENUM.ASC) {
          sortInvoiceDate = 1;
        } else {
          sortInvoiceDate = -1;
        }
        sortFilters = {
          ...sortFilters,
          invoiceDate: sortInvoiceDate,
        };
      }

      let sortInvoiceAmount;

      if (invoiceAmount) {
        if (invoiceAmount == INVOICEAMOUNTENUM.ASC) {
          sortInvoiceAmount = 1;
        } else {
          sortInvoiceAmount = -1;
        }
        sortFilters = {
          ...sortFilters,
          invoiceAmount: sortInvoiceAmount,
        };
      }

      invoiceID = invoiceID.trim();

      let filters = {};

      if (invoiceID.trim().length) {
        var query = new RegExp(`${invoiceID}`, 'i');
        filters = {
          ...filters,
          invoiceID: query,
        };
      }

      if (multipleInvoicesDto?.invoiceIDsArray?.length) {
        filters = {
          ...filters,
          invoiceID: { $in: multipleInvoicesDto.invoiceIDsArray },
        };
      }

      if (
        Object.keys(sortFilters).length === 0 &&
        sortFilters.constructor === Object
      ) {
        sortFilters = {
          createdAt: -1,
        };
      }

      const totalCount = await this._invoicesModel.countDocuments({
        merchantMongoID: merchantID,
        // ...matchFilter,
        // ...filters,
      });

      const filteredCount = await this._invoicesModel.countDocuments({
        merchantMongoID: merchantID,
        ...matchFilter,
        ...filters,
      });

      let invoices = await this._invoicesModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantID,
              ...matchFilter,
              ...filters,
            },
          },
          {
            $sort: {
              ...sortFilters,
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
              nameInLowerCase: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        filteredCount,
        data: invoices,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllInvoicesByAffiliate (affiliateMongoID, invoiceID, dateFrom, dateTo, multipleInvoicesDto, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      dateFrom = parseInt(dateFrom);
      dateTo = parseInt(dateTo);
      let matchFilter = {};

      let dateToFilters = {};
      let dateFromFilters = {};

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
          invoiceDate: {
            ...dateFromFilters,
            ...dateToFilters,
          },
        };
      }

      let filters = {};

      if (invoiceID.trim().length) {
        var query = new RegExp(`${invoiceID}`, 'i');
        filters = {
          ...filters,
          invoiceID: query,
        };
      }

      if (multipleInvoicesDto?.invoiceIDsArray?.length) {
        filters = {
          ...filters,
          invoiceID: { $in: multipleInvoicesDto.invoiceIDsArray },
        };
      }

      let totalCount = await this._invoicesModel.countDocuments({
        affiliateMongoID: affiliateMongoID,
        deletedCheck: false
      });

      let filteredCount = await this._invoicesModel.countDocuments({
        affiliateMongoID: affiliateMongoID,
        deletedCheck: false,
        status: BILLINGSTATUS.paid,
        ...filters,
        ...matchFilter,
      });

      let affiliateInvoices = await this._invoicesModel.aggregate([
        {
          $match: {
            affiliateMongoID: affiliateMongoID,
            deletedCheck: false,
            status: BILLINGSTATUS.paid,
            ...filters,
            ...matchFilter
          }
        },
        {
          $sort: {
            createdAt: -1
          }
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

      // if (affiliateInvoices.length == 0) {
      //   throw new HttpException('Invoices against this affiliate not found!', HttpStatus.NOT_FOUND)
      // }

      return {
        totalCount: totalCount,
        filteredCount: filteredCount,
        data: affiliateInvoices
      }

    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
