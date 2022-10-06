import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VOUCHERSTATUSENUM } from 'src/enum/voucher/voucherstatus.enum';
import { Schedule } from 'src/interface/schedule/schedule.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { VoucherInterface } from 'src/interface/vouchers/vouchers.interface';
import { SORT } from '../../enum/sort/sort.enum';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
import { ScheduleService } from '../schedule/schedule.service';
const qr = require('qrcode');
import * as fs from 'fs';
import { USERSTATUS } from 'src/enum/user/userstatus.enum';
import { DealInterface } from 'src/interface/deal/deal.interface';
import axios from 'axios';
import { pipeline } from 'stream';
import { DEALSTATUS } from 'src/enum/deal/dealstatus.enum';
import { ActivityService } from '../activity/activity.service';
import { ACTIVITYENUM } from 'src/enum/activity/activity.enum';
import { USERROLE } from 'src/enum/user/userrole.enum';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel('Voucher')
    private readonly voucherModel: Model<VoucherInterface>,
    @InjectModel('Counter')
    private readonly voucherCounterModel: Model<VoucherCounterInterface>,
    @InjectModel('User')
    private readonly userModel: Model<UsersInterface>,
    @InjectModel('Schedule') private _scheduleModel: Model<Schedule>,
    private _scheduleService: ScheduleService,
    private _activityService: ActivityService,
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
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

    return `VBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${
      sequenceDocument.sequenceValue < 10000 ? '0' : ''
    }${sequenceDocument.sequenceValue}`;
  }

  async createVoucher(voucherDto) {
    try {
      let timeStamp = new Date().getTime();
      voucherDto.boughtDate = timeStamp;
      voucherDto.voucherID = await this.generateVoucherId('voucherID');
      let voucher = new this.voucherModel(voucherDto);
      let paymentUpdateTimeStamp =
        new Date().getTime() + 15 * 24 * 60 * 60 * 1000;

      // this._scheduleService.scheduleVocuher({
      //   scheduleDate: new Date(voucherDto.expiryDate),
      //   status: 0,
      //   type: 'expireVoucher',
      //   dealID: voucherDto.voucherID,
      //   deletedCheck: false,
      // });

      // this._scheduleService.scheduleVocuher({
      //   scheduleDate: new Date(paymentUpdateTimeStamp),
      //   status: 0,
      //   type: 'updateMerchantAffiliatePaymentStatus',
      //   dealID: voucherDto.voucherID,
      //   deletedCheck: false,
      // });

      voucher = await voucher.save();

      let activityMessage = `Customer with ${voucher.customerID} purchased voucher for sub deal ${voucher.subDealID}`;

      this._activityService.createActivity({
        activityType: ACTIVITYENUM.voucherPurchased,
        activityTime: Date.now(),
        merchantID: voucher.merchantID,
        merchantMongoID: voucher.merchantMongoID,
        message: activityMessage,
        deletedCheck: false,
      });

      // const res = await axios.get(`https://www.zohoapis.eu/crm/v2/functions/createvoucher/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&voucherid=${voucher.voucherID}`);

      let url = `${process.env.merchantPanelURL}/redeemVoucher/${voucher.id}`;

      url = await this.generateQRCode(url);

      await this.voucherModel.findByIdAndUpdate(voucher.id, { redeemQR: url });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateVoucherByID(voucherID, updateVoucherForCRMDto) {
    try {
      const voucher = await this.voucherModel.findOne({ voucherID: voucherID });
      if (!voucher) {
        throw new Error('Voucher not found!');
      }

      await this.voucherModel.updateOne(
        { voucherID: voucherID },
        updateVoucherForCRMDto,
      );

      return {
        message: 'Voucher has been updated successfully!',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getVoucherByID(voucherID) {
    try {
      let voucher: any = await this.voucherModel.findOne({
        voucherID: voucherID,
      });

      if (!voucher) {
        throw new Error('Voucher not found!');
      }

      voucher = JSON.parse(JSON.stringify(voucher));

      voucher.voucherID = voucher.voucherID;
      voucher.voucherHeader = voucher.voucherHeader;
      voucher.dealHeader = voucher.dealHeader;
      voucher.dealID = voucher.dealID;
      voucher.subDealHeader = voucher.subDealHeader;
      voucher.subDealID = voucher.subDealID;
      voucher.merchantID = voucher.merchantID;
      voucher.customerID = voucher.customerID;
      voucher.affiliateName = voucher.affiliateName;
      voucher.affiliateID = voucher.affiliateID;
      voucher.unitPrice = voucher.amount;
      voucher.voucherStatus = voucher.status;
      voucher.affiliatePercentage = voucher.affiliatePercentage;
      voucher.affiliateFee = voucher.affiliateFee;
      voucher.affiliatePaymentStatus = voucher.affiliatePaymentStatus;
      voucher.platformPercentage = voucher.platformPercentage;
      voucher.platformFee = voucher.fee;
      voucher.netEarning = voucher.net;
      voucher.merchantPaymentStatus = voucher.merchantPaymentStatus;
      voucher.purchaseDate = voucher.boughtDate;
      voucher.redeemDate = voucher.redeemDate;
      voucher.expiryDate = voucher.expiryDate;
      voucher.redeemDate = voucher.redeemData ? voucher.redeemData : null;

      delete voucher?.id;
      delete voucher?.dealMongoID;
      delete voucher?.subDealMongoID;
      delete voucher?.merchantMongoID;
      delete voucher?.customerMongoID;
      delete voucher?.affiliateMongoID;
      delete voucher?.paymentStatus;
      delete voucher?.imageURL;
      delete voucher?.dealPrice;
      delete voucher?.originalPrice;
      delete voucher?.discountedPercentage;
      delete voucher?.deletedCheck;
      delete voucher?.redeemQR;
      delete voucher?.amount;
      delete voucher?.createdAt;
      delete voucher?.updatedAt;
      delete voucher?.status;
      delete voucher?.net;
      delete voucher?.fee;
      delete voucher?.boughtDate;

      return voucher;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async generateQRCode(qrUrl) {
    try {
      const qrData = qrUrl;

      let randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

      const url = `${process.env.URL}media-upload/mediaFiles/qr/${randomName}.png`;

      const src = await qr.toDataURL(qrData);

      var base64Data = src.replace(/^data:image\/png;base64,/, '');

      await fs.promises.writeFile(
        `./mediaFiles/NFT/qr/${randomName}.png`,
        base64Data,
        'base64',
      );

      console.log('QR Code generated');

      return url;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async searchByVoucherId(merchantID, voucherId, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let filters = {};

      if (voucherId.trim().length) {
        var query = new RegExp(`${voucherId}`, 'i');
        filters = {
          ...filters,
          voucherID: query,
        };
      }

      const totalCount = await this.voucherModel.countDocuments({
        merchantMongoID: merchantID,
        deletedCheck: false,
        ...filters,
      });

      const vouchers = await this.voucherModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantID,
              deletedCheck: false,
              ...filters,
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
          createdAt: -1,
        };
      }

      console.log(sort);
      console.log(matchFilter);

      const totalCount = await this.voucherModel.countDocuments({
        merchantMongoID: merchantId,
        ...matchFilter,
        ...filters,
      });

      const filteredCount = await this.voucherModel.countDocuments({
        merchantMongoID: merchantId,
        // ...matchFilter,
        // ...filters,
      });

      let vouchers = await this.voucherModel
        .aggregate([
          {
            $match: {
              merchantMongoID: merchantId,
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

  async getVouchersByCustomerID(
    customerID,
    searchVoucher,
    voucherStatus,
    offset,
    limit,
  ) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let matchFilter = {};

      if (customerID) {
        matchFilter = {
          ...matchFilter,
          customerMongoID: customerID,
        };
      }

      if (voucherStatus) {
        matchFilter = {
          ...matchFilter,
          status: voucherStatus,
        };
      }

      let filters = {};

      if (searchVoucher.trim().length) {
        var query = new RegExp(`${searchVoucher}`, 'i');
        filters = {
          ...filters,
          voucherHeader: query,
        };
      }

      const totalCount = await this.voucherModel.countDocuments({
        customerMongoID: customerID,
        deletedCheck: false,
      });

      const filteredCount = await this.voucherModel.countDocuments({
        customerMongoID: customerID,
        deletedCheck: false,
        ...matchFilter,
        ...filters,
      });

      let customerVouchers = await this.voucherModel
        .aggregate([
          {
            $match: {
              customerMongoID: customerID,
              deletedCheck: false,
              ...matchFilter,
              ...filters,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: 'locations',
              let: {
                merchantID: '$merchantID',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$merchantID', '$$merchantID'],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'merchantData',
            },
          },
          {
            $unwind: '$merchantData',
          },
          {
            $lookup: {
              from: 'reviews',
              let: {
                customerID: '$customerID',
                voucherID: '$voucherID',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$customerID', '$$customerID'],
                        },
                        {
                          $eq: ['$voucherID', '$$voucherID'],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'reviewData',
            },
          },
          {
            $unwind: {
              path: '$reviewData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'deals',
              let: {
                dealID: '$dealID',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$dealID', '$$dealID'],
                        },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: 'categories',
                    as: 'categoryData',
                    foreignField: 'categoryName',
                    localField: 'categoryName',
                  },
                },
                {
                  $unwind: '$categoryData',
                },
              ],
              as: 'dealData',
            },
          },
          {
            $unwind: '$dealData',
          },
          {
            $addFields: {
              id: '$_id',
              tradeName: '$merchantData.tradeName',
              ratingParameters: '$dealData.categoryData.ratingParameters',
              totalRating: '$reviewData.totalRating',
              isReviewed: {
                $cond: [
                  {
                    $ifNull: ['$reviewData', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              dealData: 0,
              merchantData: 0,
              reviewData: 0,
              _id: 0,
              dealHeader: 0,
              // dealID: 0,
              // dealMongoID: 0,
              subDealHeader: 0,
              subDealID: 0,
              subDealMongoID: 0,
              merchantID: 0,
              merchantMongoID: 0,
              merchantPaymentStatus: 0,
              customerID: 0,
              customerMongoID: 0,
              affiliateName: 0,
              affiliateID: 0,
              affiliateMongoID: 0,
              affiliatePercentage: 0,
              affiliateFee: 0,
              affiliatePaymentStatus: 0,
              amount: 0,
              platformPercentage: 0,
              fee: 0,
              net: 0,
              paymentStatus: 0,
              boughtDate: 0,
              originalPrice: 0,
              discountedPercentage: 0,
              deletedCheck: 0,
              redeemQR: 0,
              createdAt: 0,
              updatedAt: 0,
              __v: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        filteredCount: filteredCount,
        data: customerVouchers,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async redeemVoucher(voucherId, req) {
    try {
      const voucherErrors = {
        Expired: 'Voucher Expired!',
        Redeemed: 'Voucher already Reedemed!',
        Refunded: 'Vocuher Refunded!',
        'In Dispute': 'Voucher is in dispute!',
      };

      const voucher = await this.voucherModel.findOne({
        voucherID: voucherId,
        deletedCheck: false,
      });

      if (req.user.id != voucher?.merchantMongoID) {
        throw new UnauthorizedException(
          'Merchant Not allowed to redeem voucher!',
        );
      }

      if (voucher) {
        if (voucher.expiryDate < new Date().getTime()) {
          voucher.status = 'Expired';
        }

        if (voucherErrors[voucher.status]) {
          return {
            status: 'error',
            message: voucherErrors[voucher.status],
            voucher,
          };
        }
      }

      if (!voucher) {
        throw new Error('Voucher Not found!');
      }

      let scheduledVoucher = await this._scheduleModel.findOne({
        dealID: voucher.voucherID,
        status: 0,
      });

      if (scheduledVoucher) {
        // this._scheduleService.cancelJob(scheduledVoucher.id);
      }

      const merchant = await this.userModel.findOne({
        merchantID: voucher.merchantID,
      });

      let redeemDate = new Date().getTime();

      // const calculatedFee = voucher.dealPrice * merchant.platformPercentage; //five percent goes to affiliate
      // const net = voucher.dealPrice - merchant.platformPercentage * voucher.dealPrice;
      // const calculatedFeeForAffiliate = calculatedFee * voucher.affiliatePercentage;

      await this.voucherModel.updateOne(
        { voucherID: voucherId },
        {
          status: VOUCHERSTATUSENUM.redeeemed,
          redeemDate: redeemDate,
          // net: net,
          // fee: calculatedFee,
          // affiliateFee: calculatedFeeForAffiliate
        },
      );

      let activityMessage = `Voucher ${voucher.voucherID} redeemed.`;

      this._activityService.createActivity({
        activityType: ACTIVITYENUM.voucherRedeemed,
        activityTime: Date.now(),
        merchantID: voucher.merchantID,
        merchantMongoID: voucher.merchantMongoID,
        message: activityMessage,
        deletedCheck: false,
      });

      // const res = await axios.get(`https://www.zohoapis.eu/crm/v2/functions/createvoucher/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&voucherid=${voucher.voucherID}`);

      // const deal = await this.dealModel.findOne({dealID: voucher.dealID});

      // const subDeal = deal.subDeals.find(
      //   (el) => el.subDealID == voucher.subDealID,
      // );

      // subDeal.grossEarning += voucher.dealPrice;
      // subDeal.netEarning += net;

      // await this.dealModel.updateOne({ dealID: voucher.dealID }, deal);

      await this.userModel.updateOne(
        { merchantID: voucher.merchantID },
        {
          redeemedVouchers: merchant.redeemedVouchers + 1,
          // totalEarnings: merchant.totalEarnings + net,
        },
      );

      const updtaedVoucher = await this.voucherModel.findOne({
        voucherID: voucherId,
      });

      return {
        status: 'success',
        message: 'Voucher redeemed successfully',
        voucher: updtaedVoucher,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getVoucherByMongoId(id) {
    try {
      const voucher = await this.voucherModel.aggregate([
        {
          $match: {
            _id: id,
            deletedCheck: false,
          },
        },
        {
          $lookup: {
            from: 'locations',
            let: {
              merchantID: '$merchantID',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$merchantID', '$$merchantID'],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  plusCode: 0,
                  location: 0,
                  locationName: 0,
                  zipCode: 0,
                  city: 0,
                  province: 0,
                  __v: 0,
                },
              },
            ],
            as: 'merchantData',
          },
        },
        {
          $unwind: '$merchantData',
        },
        {
          $addFields: {
            id: '$_id',
          },
        },
        {
          $project: {
            _id: 0,
            // __v: 0,
            // updatedAt: 0,
            // createdAt: 0,
            // imageURL: 0,
            // dealHeader: 0,
            // dealID: 0,
            // dealMongoID: 0,
            // subDealHeader: 0,
            // subDealID: 0,
            // subDealMongoID: 0,
            // merchantID: 0,
            // merchantMongoID: 0,
            // merchantPaymentStatus: 0,
            // customerID: 0,
            // customerMongoID: 0,
            // affiliateName: 0,
            // affiliateID: 0,
            // affiliateMongoID: 0,
            // affiliatePercentage: 0,
            // affiliateFee: 0,
            // affiliatePaymentStatus: 0,
            // amount: 0,
            // platformPercentage: 0,
            // fee: 0,
            // net: 0,
            // status: 0,
            // paymentStatus: 0,
            // boughtDate: 0,
            // deletedCheck: 0,
          },
        },
      ]);

      if (voucher.length == 0) {
        throw new Error('No Voucher Found!');
      }

      return voucher[0];
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async redeemVoucherByMerchantPin(redeemVoucherDto) {
    try {
      const voucherErrors = {
        Expired: 'Voucher Expired!',
        Redeemed: 'Voucher already Reedemed!',
        Refunded: 'Vocuher Refunded!',
        'In Dispute': 'Voucher is in dispute!',
      };

      const voucher = await this.voucherModel.findOne({
        voucherID: redeemVoucherDto.voucherID,
        deletedCheck: false,
      });

      if (voucher) {
        if (voucher.expiryDate < new Date().getTime()) {
          voucher.status = 'Expired';
        }

        if (voucherErrors[voucher.status]) {
          return {
            status: 'error',
            message: voucherErrors[voucher.status],
            voucher,
          };
        }
      }

      if (!voucher) {
        throw new Error(' Voucher Not found!');
      }

      let scheduledVoucher = await this._scheduleModel.findOne({
        dealID: voucher.voucherID,
        status: 0,
      });

      if (scheduledVoucher) {
        // this._scheduleService.cancelJob(scheduledVoucher.id);
      }

      const merchant = await this.userModel.findOne({
        merchantID: voucher.merchantID,
      });

      if (merchant.voucherPinCode != redeemVoucherDto.pin) {
        throw new Error('Inavlid Pin Code!');
      }

      let redeemDate = new Date().getTime();

      // const calculatedFee = voucher.dealPrice * 0.05; //five percent goes to affiliate
      // const net = voucher.dealPrice - 0.05 * voucher.dealPrice;

      await this.voucherModel.updateOne(
        { voucherID: redeemVoucherDto.voucherID },
        {
          status: VOUCHERSTATUSENUM.redeeemed,
          redeemDate: redeemDate,
          // net: net,
          // fee: calculatedFee
        },
      );

      let activityMessage = `Voucher ${voucher.voucherID} redeemed.`;

      this._activityService.createActivity({
        activityType: ACTIVITYENUM.voucherRedeemed,
        activityTime: Date.now(),
        merchantID: voucher.merchantID,
        merchantMongoID: voucher.merchantMongoID,
        message: activityMessage,
        deletedCheck: false,
      });

      // const res = await axios.get(`https://www.zohoapis.eu/crm/v2/functions/createvoucher/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&voucherid=${voucher.voucherID}`);

      // const deal = await this.dealModel.findOne({dealID: voucher.dealID});

      // const subDeal = deal.subDeals.find(
      //   (el) => el.subDealID == voucher.subDealID,
      // );

      // subDeal.grossEarning += voucher.dealPrice;
      // subDeal.netEarning += net;

      // await this.dealModel.updateOne({ dealID: voucher.dealID }, deal);

      await this.userModel.updateOne(
        { merchantID: voucher.merchantID },
        {
          redeemedVouchers: merchant.redeemedVouchers + 1,
          // totalEarnings: merchant.totalEarnings + net,
        },
      );

      const updtaedVoucher = await this.voucherModel.findOne({
        voucherID: redeemVoucherDto.voucherID,
      });

      return {
        status: 'success',
        message: 'Voucher redeemed successfully',
        voucher: updtaedVoucher,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getVoucherSoldPerDay(numberOfDays, req) {
    try {
      let startTime = Date.now() - numberOfDays * 24 * 60 * 60 * 1000;

      startTime =
        Math.floor(startTime / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);

      const data = await this.voucherModel.aggregate([
        {
          $match: {
            merchantMongoID: req.user.id,
            createdAt: { $gte: new Date(startTime) },
          },
        },
        {
          $group: {
            _id: { $dayOfYear: '$createdAt' },
            createdAt: { $last: '$createdAt' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      let counts = [];
      for (let i = 0; i < numberOfDays; i++) {
        let tempDate = Date.now() - (numberOfDays - i) * 24 * 60 * 60 * 1000;

        let tempNextDate = tempDate + 24 * 60 * 60 * 1000;

        const filtered = data?.filter(
          (item) =>
            new Date(item?.createdAt).getTime() >= tempDate &&
            new Date(item?.createdAt).getTime() <= tempNextDate,
        );

        if (filtered?.length) {
          counts.push({
            createdAt: filtered[0]?.createdAt,
            count: filtered[0]?.count,
          });
        } else {
          counts.push({ createdAt: new Date(tempDate), count: 0 });
        }
      }

      let maxCount = Math.max(...counts.map((el) => el.count));
      return { maxCount, counts };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  async getNetRevenue(req) {
    try {
      const timeStamp = Date.now() - 182 * 24 * 60 * 60 * 1000;

      const totalDeals = await this.dealModel.countDocuments({
        merchantMongoID: req.user.id,
        dealStatus: DEALSTATUS.published,
      });

      const merchant = await this.userModel.findOne({
        _id: req.user.id,
        merchantID: req.user.merchantID,
        deletedCheck: false,
        status: USERSTATUS.approved,
        role: USERROLE.merchant
      });

      const totalVouchersSold = merchant.purchasedVouchers;
      const overallRating = merchant.ratingsAverage;
      const netRevenue = merchant.totalEarnings;

      let vouchers = await this.voucherModel.aggregate([
        {
          $match: {
            merchantMongoID: req.user.id,
            createdAt: { $gte: new Date(timeStamp) },
          },
        },
        {
          $group: {
            _id: { $substr: ['$createdAt', 0, 7] },
            netRevenue: { $sum: '$net' },
          },
        },
        {
          $addFields: {
            month: '$_id',
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
        {
          $sort: {
            month: -1,
          },
        },
      ]);

      let maxRevenueForMonth = 0;

      let month = new Date().getMonth() + 2;
      let year = new Date().getFullYear();
      let yearlyRevenue = 0;

      for (let i = 0; i < 6; i++) {
        month = month - 1;
        if (month == 0) {
          month = 12;
          year = year - 1;
        }

        let checkMonth =
          month < 10
            ? year.toString() + '-' + '0' + month.toString()
            : year.toString() + '-' + month.toString();

        if (vouchers[i]?.month != checkMonth) {
          vouchers.splice(i, 0, {
            netRevenue: 0,
            month: checkMonth,
          });
        }
        yearlyRevenue += vouchers[i].netRevenue;
        maxRevenueForMonth =
          maxRevenueForMonth < vouchers[i]?.netRevenue
            ? vouchers[i]?.netRevenue
            : maxRevenueForMonth;
      }

      // let from = `${new Date(timeStamp).getMonth() + 1 < 10 ? '0' : ''}${
      //   new Date(timeStamp).getMonth() + 1
      // } ${new Date(timeStamp).getFullYear()}`;

      // let to = `${new Date().getMonth() + 1 < 10 ? '0' : ''}${
      //   new Date().getMonth() + 1
      // } ${new Date().getFullYear()}`;

      let from = `${vouchers[vouchers.length-1].month.split('-')[1]} ${vouchers[vouchers.length-1].month.split('-')[0]}`;
      let to = `${vouchers[0].month.split('-')[1]} ${vouchers[0].month.split('-')[0]}`;

      return {
        totalDeals,
        totalVouchersSold,
        overallRating,
        netRevenue,
        from,
        to,
        yearlyRevenue,
        maxRevenueForMonth,
        vouchers,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
