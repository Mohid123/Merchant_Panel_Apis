import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { USERSTATUS } from '../../enum/user/userstatus.enum';
import { UsersInterface } from '../../interface/user/users.interface';
import {
  encodeImageToBlurhash,
  getDominantColor,
} from '../file-management/utils/utils';
import { EmailDTO } from 'src/dto/email/email.dto';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { VoucherCounterInterface } from 'src/interface/vouchers/vouchersCounter.interface';
import { Location } from 'src/interface/location/location.interface';
import { LeadInterface } from 'src/interface/lead/lead.interface';
import { USERROLE } from 'src/enum/user/userrole.enum';
import { SORT } from 'src/enum/sort/sort.enum';

var htmlencode = require('htmlencode');
var generator = require('generate-password');
var otpGenerator = require('otp-generator');

let transporter;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly _userModel: Model<UsersInterface>,
    @InjectModel('Location') private readonly _locationModel: Model<Location>,
    @InjectModel('Counter')
    private readonly voucherCounterModel: Model<VoucherCounterInterface>,
    @InjectModel('Lead') private readonly _leadModel: Model<LeadInterface>,
  ) {}

  onModuleInit() {
    transporter = nodemailer.createTransport({
      // host: 'boostingthemovement.com',
      // port: 465,
      // secure: true,
      service: 'Gmail',
      auth: {
        user: 'noreplydivideals@gmail.com',
        pass: 'eyccuiqvdskyaknn',
      },
    });
  }

  async generateMerchantId(sequenceName) {
    const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(
      sequenceName,
      {
        $inc: {
          sequenceValue: 1,
        },
      },
      { new: true },
    );

    // if (sequenceDocument.sequenceValue < 5902) {
    //   await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
    //     sequenceValue: 5903,
    //   });

    //   const year = new Date().getFullYear() % 2000;

    //   return `MBE${year}005902`;
    // }

    const year = new Date().getFullYear() % 2000;

    return `MBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${
      sequenceDocument.sequenceValue < 10000 ? '0' : ''
    }${sequenceDocument.sequenceValue}`;
  }

  async generateAffiliateId(sequenceName) {
    const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(
      sequenceName,
      {
        $inc: {
          sequenceValue: 1,
        },
      },
      { new: true },
    );

    // if (sequenceDocument.sequenceValue < 5902) {
    //   await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
    //     sequenceValue: 5903,
    //   });

    //   const year = new Date().getFullYear() % 2000;

    //   return `MBE${year}005902`;
    // }

    const year = new Date().getFullYear() % 2000;

    return `ABE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${
      sequenceDocument.sequenceValue < 10000 ? '0' : ''
    }${sequenceDocument.sequenceValue}`;
  }

  async addUser(usersDto) {
    usersDto.profilePicBlurHash = await encodeImageToBlurhash(
      usersDto.profilePicURL,
    );

    const user = new this._userModel(usersDto).save();

    return user;
  }

  async comparePassword(userID, isPasswordExistsDto) {
    try {
      let user = await this._userModel.findOne({ _id: userID });
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const comaprePasswords = await bcrypt.compare(
        isPasswordExistsDto.password,
        user.password,
      );

      return comaprePasswords ? true : false;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(id, updatepasswordDto) {
    let user = await this._userModel.findOne({ _id: id, deletedCheck: false });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const comaprePasswords = await bcrypt.compare(
      updatepasswordDto.password,
      user.password,
    );

    if (!comaprePasswords) {
      throw new UnauthorizedException('Incorrect password!');
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        updatepasswordDto.newPassword,
        salt,
      );
      return await this._userModel.updateOne(
        { _id: id },
        { password: hashedPassword, newUser: false },
      );
    }
  }

  async validateVatNumber(vatNumber) {
    const res = await axios.get(
      `https://vatcheckapi.com/api/validate/${vatNumber}?apikey=${process.env.VATCHECKAPIKEY}`,
      {
        headers: {
          apikey: process.env.VATCHECKAPIKEY,
        },
      },
    );

    console.log(res.data);
    return res.data;
  }

  async completeKYC(merchantID, kycDto) {
    await this._userModel.updateOne({ _id: merchantID }, kycDto);
    await this._userModel.updateOne({ _id: merchantID }, { kycStatus: true });

    return {
      message: 'KYC has been updated successfully!',
    };
  }

  async updateVoucherPinCode(merchantID, voucherPinCodeDto) {
    await this._userModel.updateOne({ _id: merchantID }, voucherPinCodeDto);

    return {
      message: 'Voucher pin code has been updated successfully!',
    };
  }

  async updateMerchantprofile(merchantID, usersDto) {
    let user = await this._userModel.findOne({ _id: merchantID });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (usersDto.gallery && usersDto.gallery.length) {
      usersDto['type'] = usersDto.gallery[0].type;
      usersDto['captureFileURL'] = usersDto.gallery[0].captureFileURL;
      usersDto['path'] = usersDto.gallery[0].path;
      if (usersDto['type'] == 'Video') {
        usersDto['thumbnailURL'] = usersDto.gallery[0].thumbnailURL;
        usersDto['thumbnailPath'] = usersDto.gallery[0].thumbnailPath;
      }
      if (usersDto.gallery) {
        for (let i = 0; i < usersDto.gallery.length; i++) {
          if (usersDto.gallery[i].type == 'Video') {
            console.log('Inside if');
            var item = usersDto.gallery.splice(i, 1);
            usersDto.gallery.splice(0, 0, item[0]);
          }
        }
      }
      for await (let mediaObj of usersDto.gallery) {
        await new Promise(async (resolve, reject) => {
          try {
            let urlMedia = '';
            if (mediaObj.type == 'Video') {
              urlMedia = mediaObj.thumbnailURL;
            } else {
              urlMedia = mediaObj.captureFileURL;
            }
            mediaObj['blurHash'] = await encodeImageToBlurhash(urlMedia);
            let data = (mediaObj['backgroundColorHex'] = await getDominantColor(
              urlMedia,
            ));
            mediaObj['backgroundColorHex'] = data.hexCode;

            resolve({});
          } catch (err) {
            console.log('Error', err);
            reject(err);
          }
        });
      }
    }

    await this._userModel.updateOne({ _id: merchantID }, usersDto);

    return {
      message: 'User has been updated succesfully',
    };
  }

  async updateCustomerProfile(customerID, usersDto) {
    try {
      let user = await this._userModel.findOne({ _id: customerID, deletedCheck: false });
      if (!user) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      debugger

      if(usersDto.password){

        const comaprePasswords = await bcrypt.compare(
          usersDto.password,
          user.password,
        );
    
        if (!comaprePasswords) {
          throw new UnauthorizedException('Incorrect password!');
        }

      }

      if(usersDto.password && usersDto.newPassword) {
        const comaprePasswords = await bcrypt.compare(
          usersDto.password,
          user.password,
        );
    
        if (!comaprePasswords) {
          throw new UnauthorizedException('Incorrect password!');
        } else {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(
            usersDto.newPassword,
            salt,
          );

          usersDto.password = hashedPassword;
        }

      }

      if(!(usersDto.password && usersDto.newPassword)){
        delete usersDto.password;
        delete usersDto.newPassword;
      }

      await this._userModel.updateOne({ _id: customerID }, usersDto);
      return {
        message: 'Customer has been updated succesfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCustomer (id) {
    try {
      let customer = await this._userModel.aggregate([
        {
          $match: {
            _id: id,
            deletedCheck: false,
            role: USERROLE.customer
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
      ]).then(items=>items[0]);

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      return customer;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateBusinessHours(updateHoursDTO: UpdateHoursDto) {
    let user = await this._userModel.findOne({ _id: updateHoursDTO.id });

    const newBusinessHours = user.businessHours.map((hour) => {
      if (
        updateHoursDTO?.businessHours?.findIndex(
          (data) => data.day == hour.day,
        ) >= 0
      ) {
        return updateHoursDTO?.businessHours[
          updateHoursDTO?.businessHours?.findIndex(
            (data) => data.day == hour.day,
          )
        ];
      } else {
        return hour;
      }
    });

    return await this._userModel.updateOne(
      { _id: updateHoursDTO.id },
      { businessHours: newBusinessHours },
    );
  }

  async deleteUser(id) {
    return this._userModel.updateOne({ _id: id }, { deletedCheck: true });
  }

  async getUserById(id) {
    return await this._userModel
      .aggregate([
        {
          $match: {
            _id: id,
            deletedCheck: false,
            status: USERSTATUS.approved,
          },
        },
        {
          $lookup: {
            from: 'locations',
            as: 'personalDetail',
            localField: 'userID',
            foreignField: 'merchantID',
          },
        },
        {
          $unwind: '$personalDetail',
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
      .then((items) => items[0]);
  }

  async getMerchantByID(merchantID) {
    let merchant = await this._userModel
      .aggregate([
        {
          $match: {
            _id: merchantID,
            deletedCheck: false,
            status: USERSTATUS.approved,
            role: USERROLE.merchant,
          },
        },
        {
          $lookup: {
            from: 'locations',
            as: 'personalDetail',
            localField: 'userID',
            foreignField: 'merchantID',
          },
        },
        {
          $unwind: '$personalDetail',
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
      .then((items) => items[0]);

    let foundTime = false;
    let foundWorkingDay = false;

    merchant.businessHours.forEach((el) => {
      if (el.firstStartTime != '' && el.secondStartTime != '') {
        foundTime = true;
      }
      if (el.isWorkingDay != false) {
        foundWorkingDay = true;
      }
    });

    if (!foundTime || !foundWorkingDay) {
      merchant.businessHours = [];
    }

    return merchant;
  }

  async getMerchantForCRM (merchantID) {
    try {
      let merchant: any = await this._userModel.findOne({
        userID: merchantID,
        deletedCheck: false,
        role: USERROLE.merchant
      });

      if (!merchant) {
        throw new HttpException('Merchant not found!', HttpStatus.BAD_REQUEST);
      }

      let locationMerchant = await this._locationModel.findOne({
        merchantID: merchantID
      });

      if (!locationMerchant) {
        throw new HttpException('Merchant location not found!', HttpStatus.BAD_REQUEST);
      }

      merchant = JSON.parse(JSON.stringify(merchant));
      locationMerchant = JSON.parse(JSON.stringify(locationMerchant));

      merchant.tradeName = locationMerchant?.tradeName;
      merchant.ratingsAverage = merchant?.ratingsAverage;
      merchant.profilePicURL = merchant?.profilePicURL;
      merchant.platformPercentage = merchant?.platformPercentage;

      delete merchant?.id; 
      delete merchant?.userID;
      delete merchant?.email;
      delete merchant?.password;
      delete merchant?.firstName;
      delete merchant?.lastName;
      delete merchant?.phoneNumber; 
      delete merchant?.role;
      delete merchant?.businessType; 
      delete merchant?.legalName;
      delete merchant?.streetAddress; 
      delete merchant?.zipCode;
      delete merchant?.city;
      delete merchant?.vatNumber;
      delete merchant?.iban;
      delete merchant?.bic_swiftCode;
      delete merchant?.accountHolder;
      delete merchant?.bankName;
      delete merchant?.kycStatus;
      delete merchant?.province;
      delete merchant?.website_socialAppLink;
      delete merchant?.googleMapPin;
      delete merchant?.businessHours;
      delete merchant?.finePrint;
      delete merchant?.aboutUs;
      delete merchant?.profilePicBlurHash;
      delete merchant?.gallery;
      delete merchant?.voucherPinCode;
      delete merchant?.deletedCheck;
      delete merchant?.status;
      delete merchant?.newUser;
      delete merchant?.totalVoucherSales;
      delete merchant?.redeemedVouchers;
      delete merchant?.purchasedVouchers;
      delete merchant?.expiredVouchers;
      delete merchant?.totalEarnings;
      delete merchant?.paidEarnings;
      delete merchant?.pendingEarnings;
      delete merchant?.totalDeals;
      delete merchant?.scheduledDeals;
      delete merchant?.pendingDeals;
      delete merchant?.soldDeals;
      delete merchant?.countryCode;
      delete merchant?.leadSource;
      delete merchant?.stripeCustomerID;
      delete merchant?.totalReviews;
      delete merchant?.maxRating;
      delete merchant?.minRating;
      delete merchant?.isSubscribed;
      delete merchant?.popularCount;
      delete merchant.createdAt;
      delete merchant.updatedAt;

      return merchant;

    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateMerchantFromCRM (merchantID, updateMerchantFromCrmDto) {
    try {
      let merchant: any = await this._userModel.findOne({
        userID: merchantID,
        deletedCheck: false,
        role: USERROLE.merchant
      });

      if (!merchant) {
        throw new HttpException('Merchant not found!', HttpStatus.BAD_REQUEST);
      }

      await this._locationModel.updateOne({ merchantID: merchantID }, updateMerchantFromCrmDto);

      delete updateMerchantFromCrmDto.tradeName;

      await this._userModel.updateOne({ userID: merchantID }, updateMerchantFromCrmDto);

      return {
        message: 'Merchant has been updated successfully'
      };

    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMerchantStats(id) {
    return await this._userModel
      .aggregate([
        {
          $match: {
            _id: id,
            deletedCheck: false,
            status: USERSTATUS.approved,
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
            email: 0,
            password: 0,
            firstName: 0,
            lastName: 0,
            phoneNumber: 0,
            role: 0,
            businessType: 0,
            legalName: 0,
            streetAddress: 0,
            zipCode: 0,
            city: 0,
            vatNumber: 0,
            iban: 0,
            bankName: 0,
            kycStatus: 0,
            province: 0,
            website_socialAppLink: 0,
            googleMapPin: 0,
            businessHours: 0,
            finePrint: 0,
            aboutUs: 0,
            profilePicURL: 0,
            profilePicBlurHash: 0,
            deletedCheck: 0,
            status: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ])
      .then((items) => items[0]);
  }

  async getAllUsers(offset, limit) {
    offset = parseInt(offset) < 0 ? 0 : offset;
    limit = parseInt(limit) < 1 ? 10 : limit;

    const totalCount = await this._userModel.countDocuments({
      deletedCheck: false,
    });

    const users = await this._userModel
      .aggregate([
        {
          $match: {
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
      data: users,
    };
  }

  async searchAllAffiliates(
    searchAffiliates,
    categories,
    Affiliates,
    offset,
    limit,
    req,
  ) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let matchFilter = {};

      if (categories) {
        matchFilter = {
          ...matchFilter,
          businessType: categories,
        };
      }

      if (searchAffiliates.trim().length) {
        var query = new RegExp(`${searchAffiliates}`, 'i');
        matchFilter = {
          ...matchFilter,
          firstName: query,
        };
      }

      let sort = {};

      if (Affiliates) {
        let sortAffiliates = Affiliates == SORT.ASC ? 1 : -1;
        console.log('sortAffiliates');
        sort = {
          ...sort,
          firstName: sortAffiliates,
        };
      }

      if (Object.keys(sort).length === 0 && sort.constructor === Object) {
        sort = {
          createdAt: -1,
        };
      }

      console.log(sort);
      console.log(matchFilter);

      const totalCount = await this._userModel.countDocuments({
        role: USERROLE.affiliate,
        status: USERSTATUS.approved,
        deletedCheck: false,
      });

      const filteredCount = await this._userModel.countDocuments({
        role: USERROLE.affiliate,
        status: USERSTATUS.approved,
        deletedCheck: false,
        ...matchFilter,
      });

      const affiliates = await this._userModel
        .aggregate([
          {
            $match: {
              role: USERROLE.affiliate,
              status: USERSTATUS.approved,
              deletedCheck: false,
              ...matchFilter,
            },
          },
          {
            $sort: sort,
          },
          {
            $lookup: {
              from: 'affiliateFvaourites',
              as: 'favouriteAffiliate',
              let: {
                affiliateID: '$userID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$affiliateID', '$affiliateID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteAffiliate',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              id: '$_id',
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteAffiliate', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              email: 0,
              password: 0,
              phoneNumber: 0,
              businessType: 0,
              legalName: 0,
              tradeName: 0,
              streetAddress: 0,
              zipCode: 0,
              city: 0,
              vatNumber: 0,
              iban: 0,
              bic_swiftCode: 0,
              accountHolder: 0,
              bankName: 0,
              kycStatus: 0,
              province: 0,
              website_socialAppLink: 0,
              googleMapPin: 0,
              businessHours: 0,
              finePrint: 0,
              aboutUs: 0,
              gallery: 0,
              newUser: 0,
              totalVoucherSales: 0,
              redeemedVouchers: 0,
              purchasedVouchers: 0,
              expiredVouchers: 0,
              totalEarnings: 0,
              paidEarnings: 0,
              pendingEarnings: 0,
              soldDeals: 0,
              pendingDeals: 0,
              totalDeals: 0,
              scheduledDeals: 0,
              countryCode: 0,
              leadSource: 0,
              ratingsAverage: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              isSubscribed: 0,
              __v: 0,
              favouriteAffiliate: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        filteredCount: filteredCount,
        data: affiliates,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPopularAffiliates(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this._userModel.countDocuments({
        role: USERROLE.affiliate,
        status: USERSTATUS.approved,
        deletedCheck: false,
      });

      const affiliates = await this._userModel
        .aggregate([
          {
            $match: {
              role: USERROLE.affiliate,
              status: USERSTATUS.approved,
              deletedCheck: false,
            },
          },
          {
            $sort: {
              popularCount: -1,
            },
          },
          {
            $lookup: {
              from: 'affiliateFvaourites',
              as: 'favouriteAffiliate',
              let: {
                affiliateID: '$userID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$affiliateID', '$affiliateID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteAffiliate',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              id: '$_id',
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteAffiliate', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              email: 0,
              password: 0,
              phoneNumber: 0,
              businessType: 0,
              legalName: 0,
              tradeName: 0,
              streetAddress: 0,
              zipCode: 0,
              city: 0,
              vatNumber: 0,
              iban: 0,
              bic_swiftCode: 0,
              accountHolder: 0,
              bankName: 0,
              kycStatus: 0,
              province: 0,
              website_socialAppLink: 0,
              googleMapPin: 0,
              businessHours: 0,
              finePrint: 0,
              aboutUs: 0,
              gallery: 0,
              newUser: 0,
              totalVoucherSales: 0,
              redeemedVouchers: 0,
              purchasedVouchers: 0,
              expiredVouchers: 0,
              totalEarnings: 0,
              paidEarnings: 0,
              pendingEarnings: 0,
              soldDeals: 0,
              pendingDeals: 0,
              totalDeals: 0,
              scheduledDeals: 0,
              countryCode: 0,
              leadSource: 0,
              ratingsAverage: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              isSubscribed: 0,
              __v: 0,
              favouriteAffiliate: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount,
        data: affiliates,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getFavouriteAffiliates(offset, limit, req) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      let totalCount: any = await this._userModel.aggregate([
        {
          $match: {
            role: USERROLE.affiliate,
            status: USERSTATUS.approved,
            deletedCheck: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: 'affiliateFvaourites',
            as: 'favouriteAffiliate',
            let: {
              affiliateID: '$userID',
              customerMongoID: req?.user?.id,
              deletedCheck: '$deletedCheck',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$affiliateID', '$affiliateID'],
                      },
                      {
                        $eq: ['$$customerMongoID', '$customerMongoID'],
                      },
                      {
                        $eq: ['$deletedCheck', false],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$favouriteAffiliate',
          },
        },
        {
          $addFields: {
            id: '$_id',
            isFavourite: {
              $cond: [
                {
                  $ifNull: ['$favouriteAffiliate', false],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $count: 'totalCount',
        },
      ]);

      const affiliates = await this._userModel
        .aggregate([
          {
            $match: {
              role: USERROLE.affiliate,
              status: USERSTATUS.approved,
              deletedCheck: false,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $lookup: {
              from: 'affiliateFvaourites',
              as: 'favouriteAffiliate',
              let: {
                affiliateID: '$userID',
                customerMongoID: req?.user?.id,
                deletedCheck: '$deletedCheck',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$affiliateID', '$affiliateID'],
                        },
                        {
                          $eq: ['$$customerMongoID', '$customerMongoID'],
                        },
                        {
                          $eq: ['$deletedCheck', false],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$favouriteAffiliate',
            },
          },
          {
            $addFields: {
              id: '$_id',
              isFavourite: {
                $cond: [
                  {
                    $ifNull: ['$favouriteAffiliate', false],
                  },
                  true,
                  false,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              email: 0,
              password: 0,
              phoneNumber: 0,
              businessType: 0,
              legalName: 0,
              tradeName: 0,
              streetAddress: 0,
              zipCode: 0,
              city: 0,
              vatNumber: 0,
              iban: 0,
              bic_swiftCode: 0,
              accountHolder: 0,
              bankName: 0,
              kycStatus: 0,
              province: 0,
              website_socialAppLink: 0,
              googleMapPin: 0,
              businessHours: 0,
              finePrint: 0,
              aboutUs: 0,
              gallery: 0,
              newUser: 0,
              totalVoucherSales: 0,
              redeemedVouchers: 0,
              purchasedVouchers: 0,
              expiredVouchers: 0,
              totalEarnings: 0,
              paidEarnings: 0,
              pendingEarnings: 0,
              soldDeals: 0,
              pendingDeals: 0,
              totalDeals: 0,
              scheduledDeals: 0,
              countryCode: 0,
              leadSource: 0,
              ratingsAverage: 0,
              totalReviews: 0,
              maxRating: 0,
              minRating: 0,
              isSubscribed: 0,
              __v: 0,
              favouriteAffiliate: 0,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalCount: totalCount?.length > 0 ? totalCount[0].totalCount : 0,
        data: affiliates,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(resetPasswordDto, req) {
    try {
      if (req.user.isResetPassword) {
        let encryptedPassword = await bcrypt.hash(
          resetPasswordDto.password,
          12,
        );

        await this._userModel.findByIdAndUpdate(req.user.id, {
          password: encryptedPassword,
        });
        return { message: 'Password reset successfully!' };
      } else {
        return { message: 'Token is not valid for password reset!' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getPendingUsers(offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;

      const totalCount = await this._userModel.countDocuments({
        status: 'Pending',
        role: 'Merchant',
      });

      const users = await this._userModel
        .aggregate([
          { $match: { status: 'Pending', role: 'Merchant' } },
          {
            $sort: { createdAt: -1 },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return { totalPendingUsers: totalCount, pendingUsers: users };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  private async generatePassword() {
    let password = generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      // strict: true
    });

    return password;
  }

  async sendMail(emailDto: EmailDTO) {
    // create reusable transporter object using the default SMTP transport

    // send mail with defined transport object
    var mailOptions = {
      from: emailDto.from,
      to: emailDto.to,
      subject: emailDto.subject,
      text: emailDto.text,
      html: emailDto.html,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        // res.redirect('/');
      }
    });
  }

  async approvePendingUsers(status, userID) {
    try {
      let user = await this._userModel.findOne({
        _id: userID,
        status: USERSTATUS.new,
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      let generatedUserID = await this.generateMerchantId('merchantID');

      let generatedPassword = await this.generatePassword();
      const salt = await bcrypt.genSalt();
      let hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const pinCode = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      const userObj = {
        ID: new Types.ObjectId().toHexString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        password: generatedPassword,
        legalName: user.legalName,
        vatNumber: user.vatNumber,
        phoneNumber: user.phoneNumber,
        city: user.city,
        streetAddress: user.streetAddress,
        province: user.province,
        zipCode: user.zipCode,
      };

      const locObj = {
        merchantID: generatedUserID,
        streetAddress: user.streetAddress,
        zipCode: user.zipCode,
        city: user.city,
        googleMapPin: user.googleMapPin,
        province: user.province,
        phoneNumber: user.phoneNumber,
      };
      if (userID) {
        await this._leadModel.updateOne(
          { _id: userID },
          { deletedCheck: true },
        );
      }
      const location = await new this._locationModel(locObj).save();

      const emailDto: EmailDTO = {
        from: `"Divideals" <${process.env.EMAIL}>`,
        to: userObj.email,
        subject: 'Your password is generated',
        text: '',
        html: `
            <html>
              <head>
              <title></title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <style type="text/css">
                /* FONTS */
                  @media screen {
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                  }
                  }
                  /* CLIENT-SPECIFIC STYLES */
                  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                  img { -ms-interpolation-mode: bicubic; }
                  /* RESET STYLES */
                  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                  table { border-collapse: collapse !important; }
                  body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
                  /* iOS BLUE LINKS */
                  a[x-apple-data-detectors] {
                      color: inherit !important;
                      text-decoration: none !important;
                      font-size: inherit !important;
                      font-family: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                  }
                  /* ANDROID CENTER FIX */
                  div[style*="margin: 16px 0;"] { margin: 0 !important; }
              </style>
              </head>
              <body style="background-color: #0081E9; margin: 0 !important; padding: 0 !important;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- LOGO -->
                  <tr>
                      <td bgcolor="#0081E9" align="center">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <tr>
                                  <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                    <div style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #FFFFFF; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                      <h6 style="margin:0px"> DIVIDEALS</h6>
                                    </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- HERO -->
                  <tr>
                      <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <tr>
                                  <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h6 style="margin:0px"> Dear</h6>
                                    <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${
                                      userObj.firstName
                                    } ${userObj.lastName}</h1>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY BLOCK -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                            <!-- COPY -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                <p style="margin: 0;">Your temporary password on <b>Divideals Merchant Panel</b> is generated. Please use this password to login into your account. </p>
                              </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td bgcolor="#FFFFFF" align="center" style="padding: 20px 30px 60px 30px;">
                                      <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(
                                              userObj.password,
                                            )}</b></a></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          </table>
                      </td>
                  </tr>
                  <!-- SUPPORT CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <!-- HEADLINE -->
                              <tr>
                                <td bgcolor="#0081E9" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                  <h2 style="font-size: 20px; font-weight: 400; color: #FFFFFF; margin: 0;">Need more help?</h2>
                                  <p style="margin: 0;"><a style="color: #FFFFFF;">We&rsquo;re here, ready to talk</a></p>
                                </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- FOOTER -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                            <!-- PERMISSION REMINDER -->
                            <tr>
                              <td bgcolor="#F4F4F4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                                <p style="margin: 0;">You received this email because you requested for a password. If you did not, <a  style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                              </td>
                            </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              </body>
              </html>
            `,
      };

      this.sendMail(emailDto);

      // user.password = generatedPassword;

      const updatedUser = await this._userModel.updateOne(
        { _id: userID },
        {
          status: status,
          password: hashedPassword,
          voucherPinCode: pinCode,
          userID: generatedUserID,
          finePrint: `<p><strong>Purchase:</strong> let us know how many voucher one person can purchase<br><strong>Reservations:</strong> let us know how/where people can make a reservation<br><strong>Cancellation:</strong> let us know your cancellation policy<br><strong>More info:</strong> is there anything else important people should be aware of?</p>`
        },
      );

      return { message: 'Merchant Approved Successfully!' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async approveMerchant(userID, approveMerchantDto) {
    try {
      console.log('Approve Merchant body', approveMerchantDto);
      let generatedPassword = await this.generatePassword();
      const salt = await bcrypt.genSalt();
      let hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const pinCode = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      delete approveMerchantDto.leadSource;

      approveMerchantDto.legalName = approveMerchantDto.companyName;
      approveMerchantDto.businessType = approveMerchantDto.categoryType;
      approveMerchantDto.voucherPinCode = pinCode;
      approveMerchantDto.password = hashedPassword;
      approveMerchantDto.status = USERSTATUS.approved;
      approveMerchantDto.zipCode = approveMerchantDto.zipCode.toString();
      approveMerchantDto.userID = await this.generateMerchantId('merchantID');
      approveMerchantDto.finePrint = `<p><strong>Purchase:</strong> let us know how many voucher one person can purchase<br><strong>Reservations:</strong> let us know how/where people can make a reservation<br><strong>Cancellation:</strong> let us know your cancellation policy<br><strong>More info:</strong> is there anything else important people should be aware of?</p>`

      const userObj = {
        ID: new Types.ObjectId().toHexString(),
        firstName: approveMerchantDto.firstName,
        lastName: approveMerchantDto.lastName,
        email: approveMerchantDto.email.toLowerCase(),
        password: hashedPassword,
        legalName: approveMerchantDto.legalName,
        vatNumber: approveMerchantDto.vatNumber,
        phoneNumber: approveMerchantDto.phoneNumber,
        city: approveMerchantDto.city,
        streetAddress: approveMerchantDto.streetAddress,
        province: approveMerchantDto.province,
        zipCode: approveMerchantDto.zipCode,
      };

      const locObj = {
        merchantID: approveMerchantDto.userID,
        tradeName: approveMerchantDto.legalName,
        streetAddress: approveMerchantDto.streetAddress,
        zipCode: approveMerchantDto.zipCode,
        city: approveMerchantDto.city,
        googleMapPin: approveMerchantDto.googleMapPin,
        province: approveMerchantDto.province,
        phoneNumber: approveMerchantDto.phoneNumber,
      };
      if (userID) {
        await this._leadModel.updateOne(
          { _id: userID },
          { deletedCheck: true },
        );
      }
      const location = await new this._locationModel(locObj).save();

      const emailDto: EmailDTO = {
        from: `"Divideals" <${process.env.EMAIL}>`,
        to: userObj.email,
        subject: 'Your password is generated',
        text: '',
        html: `
            <html>
              <head>
              <title></title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <style type="text/css">
                /* FONTS */
                  @media screen {
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                  }
                  }
                  /* CLIENT-SPECIFIC STYLES */
                  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                  img { -ms-interpolation-mode: bicubic; }
                  /* RESET STYLES */
                  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                  table { border-collapse: collapse !important; }
                  body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
                  /* iOS BLUE LINKS */
                  a[x-apple-data-detectors] {
                      color: inherit !important;
                      text-decoration: none !important;
                      font-size: inherit !important;
                      font-family: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                  }
                  /* ANDROID CENTER FIX */
                  div[style*="margin: 16px 0;"] { margin: 0 !important; }
              </style>
              </head>
              <body style="background-color: #0081E9; margin: 0 !important; padding: 0 !important;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- LOGO -->
                  <tr>
                      <td bgcolor="#0081E9" align="center">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <tr>
                                  <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                    <div style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #FFFFFF; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                      <h6 style="margin:0px"> DIVIDEALS</h6>
                                    </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- HERO -->
                  <tr>
                      <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <tr>
                                  <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h6 style="margin:0px"> Dear</h6>
                                    <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${
                                      userObj.firstName
                                    } ${userObj.lastName}</h1>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY BLOCK -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                            <!-- COPY -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                <p style="margin: 0;">Your temporary password on <b>Divideals Merchant Panel</b> is generated. Please use this password to login into your account. </p>
                              </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td bgcolor="#FFFFFF" align="center" style="padding: 20px 30px 60px 30px;">
                                      <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(
                                              generatedPassword,
                                            )}</b></a></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          </table>
                      </td>
                  </tr>
                  <!-- SUPPORT CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <!-- HEADLINE -->
                              <tr>
                                <td bgcolor="#0081E9" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                  <h2 style="font-size: 20px; font-weight: 400; color: #FFFFFF; margin: 0;">Need more help?</h2>
                                  <p style="margin: 0;"><a style="color: #FFFFFF;">We&rsquo;re here, ready to talk</a></p>
                                </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- FOOTER -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                            <!-- PERMISSION REMINDER -->
                            <tr>
                              <td bgcolor="#F4F4F4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                                <p style="margin: 0;">You received this email because you requested for a password. If you did not, <a  style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                              </td>
                            </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              </body>
              </html>
            `,
      };

      this.sendMail(emailDto);

      // user.password = generatedPassword;

      const lead = await this._leadModel.findOne({_id: userID});

      approveMerchantDto.businessHours = lead.businessHours;

      if (!approveMerchantDto.platformPercentage) {
        approveMerchantDto.platformPercentage = 25;
      }

      const merchant = await new this._userModel(approveMerchantDto).save();

      return { enquiryID: userID, merchantID: merchant?.userID };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async approveAffiliate(userID, affliateID) {
    try {
      let generatedPassword = await this.generatePassword();
      const salt = await bcrypt.genSalt();
      let hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const pinCode = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      delete affliateID.leadSource;

      affliateID.legalName = affliateID?.companyName;
      affliateID.businessType = affliateID?.categoryType;
      affliateID.voucherPinCode = pinCode;
      affliateID.password = hashedPassword;
      affliateID.status = USERSTATUS.approved;
      affliateID.zipCode = affliateID?.zipCode.toString();
      affliateID.userID = await this.generateAffiliateId('affiliateID');

      const userObj = {
        ID: new Types.ObjectId().toHexString(),
        firstName: affliateID?.firstName,
        lastName: affliateID?.lastName,
        email: affliateID?.email.toLowerCase(),
        password: hashedPassword,
        legalName: affliateID?.legalName,
        vatNumber: affliateID?.vatNumber,
        phoneNumber: affliateID?.phoneNumber,
        city: affliateID?.city,
        streetAddress: affliateID?.streetAddress,
        province: affliateID?.province,
        zipCode: affliateID?.zipCode,
      };

      const locObj = {
        merchantID: affliateID?.userID,
        tradeName: affliateID?.legalName,
        streetAddress: affliateID?.streetAddress,
        zipCode: affliateID?.zipCode,
        city: affliateID?.city,
        googleMapPin: affliateID?.googleMapPin,
        province: affliateID?.province,
        phoneNumber: affliateID?.phoneNumber,
      };
      if (userID) {
        await this._leadModel.updateOne(
          { _id: userID },
          { deletedCheck: true },
        );
      }
      const location = await new this._locationModel(locObj).save();

      const emailDto: EmailDTO = {
        from: `"Divideals" <${process.env.EMAIL}>`,
        to: userObj.email,
        subject: 'Your password is generated',
        text: '',
        html: `
            <html>
              <head>
              <title></title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <style type="text/css">
                /* FONTS */
                  @media screen {
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                  }
                  
                  @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                  }
                  }
                  /* CLIENT-SPECIFIC STYLES */
                  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                  img { -ms-interpolation-mode: bicubic; }
                  /* RESET STYLES */
                  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                  table { border-collapse: collapse !important; }
                  body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
                  /* iOS BLUE LINKS */
                  a[x-apple-data-detectors] {
                      color: inherit !important;
                      text-decoration: none !important;
                      font-size: inherit !important;
                      font-family: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                  }
                  /* ANDROID CENTER FIX */
                  div[style*="margin: 16px 0;"] { margin: 0 !important; }
              </style>
              </head>
              <body style="background-color: #0081E9; margin: 0 !important; padding: 0 !important;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <!-- LOGO -->
                  <tr>
                      <td bgcolor="#0081E9" align="center">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <tr>
                                  <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                    <div style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #FFFFFF; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                      <h6 style="margin:0px"> DIVIDEALS</h6>
                                    </div>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- HERO -->
                  <tr>
                      <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <tr>
                                  <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h6 style="margin:0px"> Dear</h6>
                                    <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${
                                      userObj.firstName
                                    } ${userObj.lastName}</h1>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY BLOCK -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                            <!-- COPY -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                <p style="margin: 0;">Your temporary password on <b>Divideals Merchant Panel</b> is generated. Please use this password to login into your account. </p>
                              </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td bgcolor="#FFFFFF" align="center" style="padding: 20px 30px 60px 30px;">
                                      <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(
                                              generatedPassword,
                                            )}</b></a></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                          </table>
                      </td>
                  </tr>
                  <!-- SUPPORT CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                              <!-- HEADLINE -->
                              <tr>
                                <td bgcolor="#0081E9" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                  <h2 style="font-size: 20px; font-weight: 400; color: #FFFFFF; margin: 0;">Need more help?</h2>
                                  <p style="margin: 0;"><a style="color: #FFFFFF;">We&rsquo;re here, ready to talk</a></p>
                                </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- FOOTER -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="480" >
                            <!-- PERMISSION REMINDER -->
                            <tr>
                              <td bgcolor="#F4F4F4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                                <p style="margin: 0;">You received this email because you requested for a password. If you did not, <a  style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                              </td>
                            </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              </body>
              </html>
            `,
      };

      this.sendMail(emailDto);

      // user.password = generatedPassword;

      const affiliate = await new this._userModel(affliateID).save();

      return { enquiryID: userID, affliateID: affiliate?.userID };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getCustomerByID(customerID) {
    try {
      let customer = await this._userModel.aggregate([
        {
          $match: { userID: customerID, role: 'Customer', deletedCheck: false },
        },
        {
          $project: {
            _id: 0,
          },
        },
        {
          $addFields: {
            customerID: '$userID',
          },
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            customerID: 1,
          },
        },
      ]);

      if (customer.length == 0) {
        throw new Error('Customer not found!');
      }

      return customer[0];
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePasswordForAllMerchant(){
    try{
      let merchants = await this._userModel.find({role:'Merchant'});

      merchants = JSON.parse(JSON.stringify(merchants));
      let newPassword = 'Belgium@123';
      for await(let merchantItem of merchants){
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(
          newPassword,
          salt,
        );

        await this._userModel.updateOne({_id:merchantItem?.id},{password:hashedPassword,newUser:false})
      }
    }
    catch(err){
      console.log(err);
      throw new BadRequestException(err?.message);
    }
  }
}
