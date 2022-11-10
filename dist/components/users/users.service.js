"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const userstatus_enum_1 = require("../../enum/user/userstatus.enum");
const utils_1 = require("../file-management/utils/utils");
const nodemailer = require("nodemailer");
const axios_1 = require("axios");
const userrole_enum_1 = require("../../enum/user/userrole.enum");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const businesshours_1 = require("../utils/businesshours");
var htmlencode = require('htmlencode');
var generator = require('generate-password');
var otpGenerator = require('otp-generator');
let transporter;
let UsersService = class UsersService {
    constructor(_userModel, _locationModel, voucherCounterModel, _leadModel) {
        this._userModel = _userModel;
        this._locationModel = _locationModel;
        this.voucherCounterModel = voucherCounterModel;
        this._leadModel = _leadModel;
    }
    onModuleInit() {
        transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'noreplydivideals@gmail.com',
                pass: 'eyccuiqvdskyaknn',
            },
        });
    }
    async generateMerchantId(sequenceName) {
        const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
            $inc: {
                sequenceValue: 1,
            },
        }, { new: true });
        const year = new Date().getFullYear() % 2000;
        return `MBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${sequenceDocument.sequenceValue < 10000 ? '0' : ''}${sequenceDocument.sequenceValue}`;
    }
    async generateCustomerId(sequenceName) {
        const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
            $inc: {
                sequenceValue: 1,
            },
        }, { new: true });
        const year = new Date().getFullYear() % 2000;
        return `CBE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${sequenceDocument.sequenceValue < 10000 ? '0' : ''}${sequenceDocument.sequenceValue}`;
    }
    async generateAffiliateId(sequenceName) {
        const sequenceDocument = await this.voucherCounterModel.findByIdAndUpdate(sequenceName, {
            $inc: {
                sequenceValue: 1,
            },
        }, { new: true });
        const year = new Date().getFullYear() % 2000;
        return `ABE${year}${sequenceDocument.sequenceValue < 100000 ? '0' : ''}${sequenceDocument.sequenceValue < 10000 ? '0' : ''}${sequenceDocument.sequenceValue}`;
    }
    async addUser(usersDto) {
        usersDto.profilePicBlurHash = await (0, utils_1.encodeImageToBlurhash)(usersDto.profilePicURL);
        const user = new this._userModel(usersDto).save();
        return user;
    }
    async changePassword(id, updatepasswordDto) {
        let user = await this._userModel.findOne({ _id: id, deletedCheck: false });
        if (!user) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const comaprePasswords = await bcrypt.compare(updatepasswordDto.password, user.password);
        if (!comaprePasswords) {
            throw new common_1.HttpException('Incorrect password!', common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(updatepasswordDto.newPassword, salt);
            return await this._userModel.updateOne({ _id: id }, { password: hashedPassword, newUser: false });
        }
    }
    async validateVatNumber(vatNumber) {
        const res = await axios_1.default.get(`https://vatcheckapi.com/api/validate/${vatNumber}?apikey=${process.env.VATCHECKAPIKEY}`, {
            headers: {
                apikey: process.env.VATCHECKAPIKEY,
            },
        });
        console.log(res.data);
        return res.data;
    }
    async completeKYC(id, kycDto) {
        let user = await this._userModel.findOne({
            _id: id,
            deletedCheck: false,
            status: userstatus_enum_1.USERSTATUS.approved
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this._userModel.updateOne({ _id: id }, kycDto);
        await this._userModel.updateOne({ _id: id }, { kycStatus: true });
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
        var e_1, _a;
        let user = await this._userModel.findOne({ _id: merchantID });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
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
            try {
                for (var _b = __asyncValues(usersDto.gallery), _c; _c = await _b.next(), !_c.done;) {
                    let mediaObj = _c.value;
                    await new Promise(async (resolve, reject) => {
                        try {
                            let urlMedia = '';
                            if (mediaObj.type == 'Video') {
                                urlMedia = mediaObj.thumbnailURL;
                            }
                            else {
                                urlMedia = mediaObj.captureFileURL;
                            }
                            mediaObj['blurHash'] = await (0, utils_1.encodeImageToBlurhash)(urlMedia);
                            let data = (mediaObj['backgroundColorHex'] = await (0, utils_1.getDominantColor)(urlMedia));
                            mediaObj['backgroundColorHex'] = data.hexCode;
                            resolve({});
                        }
                        catch (err) {
                            console.log('Error', err);
                            reject(err);
                        }
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        await this._userModel.updateOne({ _id: merchantID }, usersDto);
        return {
            message: 'User has been updated succesfully',
        };
    }
    async updateAffiliateProfile(affiliateID, usersDto) {
        var e_2, _a;
        let affiliate = await this._userModel.findOne({
            _id: affiliateID,
            deletedCheck: false,
            status: userstatus_enum_1.USERSTATUS.approved,
            role: userrole_enum_1.USERROLE.affiliate
        });
        if (!affiliate) {
            throw new common_1.HttpException('Affiliate not found', common_1.HttpStatus.NOT_FOUND);
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
            try {
                for (var _b = __asyncValues(usersDto.gallery), _c; _c = await _b.next(), !_c.done;) {
                    let mediaObj = _c.value;
                    await new Promise(async (resolve, reject) => {
                        try {
                            let urlMedia = '';
                            if (mediaObj.type == 'Video') {
                                urlMedia = mediaObj.thumbnailURL;
                            }
                            else {
                                urlMedia = mediaObj.captureFileURL;
                            }
                            mediaObj['blurHash'] = await (0, utils_1.encodeImageToBlurhash)(urlMedia);
                            let data = (mediaObj['backgroundColorHex'] = await (0, utils_1.getDominantColor)(urlMedia));
                            mediaObj['backgroundColorHex'] = data.hexCode;
                            resolve({});
                        }
                        catch (err) {
                            console.log('Error', err);
                            reject(err);
                        }
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        await this._userModel.updateOne({ _id: affiliateID }, usersDto);
        return {
            message: 'Affiliate has been updated succesfully',
        };
    }
    async updateCustomerProfile(customerID, usersDto) {
        try {
            let user = await this._userModel.findOne({
                _id: customerID,
                deletedCheck: false,
            });
            if (!user) {
                throw new common_1.HttpException('Customer not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (usersDto.password) {
                const comaprePasswords = await bcrypt.compare(usersDto.password, user.password);
                if (!comaprePasswords) {
                    throw new common_1.HttpException('Incorrect password!', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (usersDto.password && usersDto.newPassword) {
                const comaprePasswords = await bcrypt.compare(usersDto.password, user.password);
                if (!comaprePasswords) {
                    throw new common_1.HttpException('Incorrect password!', common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    const salt = await bcrypt.genSalt();
                    const hashedPassword = await bcrypt.hash(usersDto.newPassword, salt);
                    usersDto.password = hashedPassword;
                }
            }
            if (!(usersDto.password && usersDto.newPassword)) {
                delete usersDto.password;
                delete usersDto.newPassword;
            }
            await this._userModel.updateOne({ _id: customerID }, usersDto);
            return {
                message: 'Customer has been updated succesfully',
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCustomer(id) {
        try {
            let customer = await this._userModel
                .aggregate([
                {
                    $match: {
                        _id: id,
                        deletedCheck: false,
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
                .then((items) => items[0]);
            if (!customer) {
                throw new common_1.HttpException('Customer not found', common_1.HttpStatus.NOT_FOUND);
            }
            return customer;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAffiliate(id) {
        try {
            let affiliate = await this._userModel.aggregate([
                {
                    $match: {
                        _id: id,
                        deletedCheck: false,
                        status: userstatus_enum_1.USERSTATUS.approved,
                        role: userrole_enum_1.USERROLE.affiliate
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        password: 0,
                        role: 0,
                        googleMapPin: 0,
                        businessHours: 0,
                        finePrint: 0,
                        deletedCheck: 0,
                        status: 0,
                        bankStatement: 0,
                        totalVoucherSales: 0,
                        redeemedVouchers: 0,
                        purchasedVouchers: 0,
                        expiredVouchers: 0,
                        totalEarnings: 0,
                        paidEarnings: 0,
                        pendingEarnings: 0,
                        totalDeals: 0,
                        scheduledDeals: 0,
                        pendingDeals: 0,
                        soldDeals: 0,
                        countryCode: 0,
                        leadSource: 0,
                        ratingsAverage: 0,
                        totalReviews: 0,
                        maxRating: 0,
                        minRating: 0,
                        isSubscribed: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                        popularCount: 0,
                        platformPercentage: 0,
                        merchantID: 0
                    }
                }
            ]).then(items => items[0]);
            if (!affiliate) {
                throw new common_1.HttpException('Affiliate not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            return affiliate;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateBusinessHours(updateHoursDTO) {
        let user = await this._userModel.findOne({ _id: updateHoursDTO.id });
        const newBusinessHours = user.businessHours.map((hour) => {
            var _a, _b;
            if (((_a = updateHoursDTO === null || updateHoursDTO === void 0 ? void 0 : updateHoursDTO.businessHours) === null || _a === void 0 ? void 0 : _a.findIndex((data) => data.day == hour.day)) >= 0) {
                return updateHoursDTO === null || updateHoursDTO === void 0 ? void 0 : updateHoursDTO.businessHours[(_b = updateHoursDTO === null || updateHoursDTO === void 0 ? void 0 : updateHoursDTO.businessHours) === null || _b === void 0 ? void 0 : _b.findIndex((data) => data.day == hour.day)];
            }
            else {
                return hour;
            }
        });
        return await this._userModel.updateOne({ _id: updateHoursDTO.id }, { businessHours: newBusinessHours });
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
                    status: userstatus_enum_1.USERSTATUS.approved,
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    as: 'personalDetail',
                    localField: 'merchantID',
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
                    status: userstatus_enum_1.USERSTATUS.approved,
                    role: userrole_enum_1.USERROLE.merchant,
                },
            },
            {
                $lookup: {
                    from: 'locations',
                    as: 'personalDetail',
                    localField: 'merchantID',
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
    async getMerchantForCRM(merchantID) {
        try {
            let merchant = await this._userModel.findOne({
                merchantID: merchantID,
                deletedCheck: false,
                role: userrole_enum_1.USERROLE.merchant,
            });
            if (!merchant) {
                throw new common_1.HttpException('Merchant not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            let locationMerchant = await this._locationModel.findOne({
                merchantID: merchantID,
            });
            if (!locationMerchant) {
                throw new common_1.HttpException('Merchant location not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            merchant = JSON.parse(JSON.stringify(merchant));
            locationMerchant = JSON.parse(JSON.stringify(locationMerchant));
            merchant.tradeName = locationMerchant === null || locationMerchant === void 0 ? void 0 : locationMerchant.tradeName;
            merchant.ratingsAverage = merchant === null || merchant === void 0 ? void 0 : merchant.ratingsAverage;
            merchant.profilePicURL = merchant === null || merchant === void 0 ? void 0 : merchant.profilePicURL;
            merchant.platformPercentage = merchant === null || merchant === void 0 ? void 0 : merchant.platformPercentage;
            merchant === null || merchant === void 0 ? true : delete merchant.id;
            merchant === null || merchant === void 0 ? true : delete merchant.merchantID;
            merchant === null || merchant === void 0 ? true : delete merchant.customerID;
            merchant === null || merchant === void 0 ? true : delete merchant.email;
            merchant === null || merchant === void 0 ? true : delete merchant.password;
            merchant === null || merchant === void 0 ? true : delete merchant.firstName;
            merchant === null || merchant === void 0 ? true : delete merchant.lastName;
            merchant === null || merchant === void 0 ? true : delete merchant.phoneNumber;
            merchant === null || merchant === void 0 ? true : delete merchant.role;
            merchant === null || merchant === void 0 ? true : delete merchant.businessType;
            merchant === null || merchant === void 0 ? true : delete merchant.legalName;
            merchant === null || merchant === void 0 ? true : delete merchant.streetAddress;
            merchant === null || merchant === void 0 ? true : delete merchant.zipCode;
            merchant === null || merchant === void 0 ? true : delete merchant.city;
            merchant === null || merchant === void 0 ? true : delete merchant.vatNumber;
            merchant === null || merchant === void 0 ? true : delete merchant.iban;
            merchant === null || merchant === void 0 ? true : delete merchant.bic_swiftCode;
            merchant === null || merchant === void 0 ? true : delete merchant.accountHolder;
            merchant === null || merchant === void 0 ? true : delete merchant.bankName;
            merchant === null || merchant === void 0 ? true : delete merchant.kycStatus;
            merchant === null || merchant === void 0 ? true : delete merchant.province;
            merchant === null || merchant === void 0 ? true : delete merchant.website_socialAppLink;
            merchant === null || merchant === void 0 ? true : delete merchant.googleMapPin;
            merchant === null || merchant === void 0 ? true : delete merchant.businessHours;
            merchant === null || merchant === void 0 ? true : delete merchant.finePrint;
            merchant === null || merchant === void 0 ? true : delete merchant.aboutUs;
            merchant === null || merchant === void 0 ? true : delete merchant.profilePicBlurHash;
            merchant === null || merchant === void 0 ? true : delete merchant.gallery;
            merchant === null || merchant === void 0 ? true : delete merchant.voucherPinCode;
            merchant === null || merchant === void 0 ? true : delete merchant.deletedCheck;
            merchant === null || merchant === void 0 ? true : delete merchant.status;
            merchant === null || merchant === void 0 ? true : delete merchant.newUser;
            merchant === null || merchant === void 0 ? true : delete merchant.totalVoucherSales;
            merchant === null || merchant === void 0 ? true : delete merchant.redeemedVouchers;
            merchant === null || merchant === void 0 ? true : delete merchant.purchasedVouchers;
            merchant === null || merchant === void 0 ? true : delete merchant.expiredVouchers;
            merchant === null || merchant === void 0 ? true : delete merchant.totalEarnings;
            merchant === null || merchant === void 0 ? true : delete merchant.paidEarnings;
            merchant === null || merchant === void 0 ? true : delete merchant.pendingEarnings;
            merchant === null || merchant === void 0 ? true : delete merchant.totalDeals;
            merchant === null || merchant === void 0 ? true : delete merchant.scheduledDeals;
            merchant === null || merchant === void 0 ? true : delete merchant.pendingDeals;
            merchant === null || merchant === void 0 ? true : delete merchant.soldDeals;
            merchant === null || merchant === void 0 ? true : delete merchant.countryCode;
            merchant === null || merchant === void 0 ? true : delete merchant.leadSource;
            merchant === null || merchant === void 0 ? true : delete merchant.stripeCustomerID;
            merchant === null || merchant === void 0 ? true : delete merchant.totalReviews;
            merchant === null || merchant === void 0 ? true : delete merchant.maxRating;
            merchant === null || merchant === void 0 ? true : delete merchant.minRating;
            merchant === null || merchant === void 0 ? true : delete merchant.isSubscribed;
            merchant === null || merchant === void 0 ? true : delete merchant.popularCount;
            delete merchant.createdAt;
            delete merchant.updatedAt;
            return merchant;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateMerchantFromCRM(merchantID, updateMerchantFromCrmDto) {
        try {
            let merchant = await this._userModel.findOne({
                merchantID: merchantID,
                deletedCheck: false,
                role: userrole_enum_1.USERROLE.merchant,
            });
            if (!merchant) {
                throw new common_1.HttpException('Merchant not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            await this._locationModel.updateOne({ merchantID: merchantID }, updateMerchantFromCrmDto);
            delete updateMerchantFromCrmDto.tradeName;
            await this._userModel.updateOne({ merchantID: merchantID }, updateMerchantFromCrmDto);
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/updatemerchant/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&MerchantID=${merchantID}`);
            return {
                message: 'Merchant has been updated successfully',
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getMerchantStats(id) {
        return await this._userModel
            .aggregate([
            {
                $match: {
                    _id: id,
                    deletedCheck: false,
                    status: userstatus_enum_1.USERSTATUS.approved,
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
    async searchAllAffiliates(searchAffiliates, categories, Affiliates, offset, limit, req) {
        var _a, _b, _c;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let matchFilter = {};
            if (categories) {
                matchFilter = Object.assign(Object.assign({}, matchFilter), { businessType: categories });
            }
            if (searchAffiliates.trim().length) {
                var query = new RegExp(`${searchAffiliates}`, 'i');
                matchFilter = Object.assign(Object.assign({}, matchFilter), { firstName: query });
            }
            let sort = {};
            if (Affiliates) {
                let sortAffiliates = Affiliates == sort_enum_1.SORT.ASC ? 1 : -1;
                console.log('sortAffiliates');
                sort = Object.assign(Object.assign({}, sort), { firstName: sortAffiliates });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            console.log(sort);
            console.log(matchFilter);
            const totalCount = await this._userModel
                .aggregate([
                {
                    $match: {
                        role: userrole_enum_1.USERROLE.affiliate,
                        status: userstatus_enum_1.USERSTATUS.approved,
                        deletedCheck: false,
                    },
                },
                {
                    $sort: sort,
                },
                {
                    $lookup: {
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
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
                    $count: 'totalCount'
                }
            ]);
            const filteredCount = await this._userModel
                .aggregate([
                {
                    $match: Object.assign({ role: userrole_enum_1.USERROLE.affiliate, status: userstatus_enum_1.USERSTATUS.approved, deletedCheck: false }, matchFilter),
                },
                {
                    $sort: sort,
                },
                {
                    $lookup: {
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
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
                    $count: 'filteredCount'
                }
            ]);
            const affiliates = await this._userModel
                .aggregate([
                {
                    $match: Object.assign({ role: userrole_enum_1.USERROLE.affiliate, status: userstatus_enum_1.USERSTATUS.approved, deletedCheck: false }, matchFilter),
                },
                {
                    $sort: sort,
                },
                {
                    $lookup: {
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id,
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
                        karibuURL: 0,
                        bankStatement: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        merchantID: 0,
                        customerID: 0,
                        deletedCheck: 0,
                        status: 0,
                        platformPercentage: 0,
                        favouriteAffiliate: 0,
                        campaignData: 0
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: (totalCount === null || totalCount === void 0 ? void 0 : totalCount.length) > 0 ? totalCount[0].totalCount : 0,
                filteredCount: (filteredCount === null || filteredCount === void 0 ? void 0 : filteredCount.length) > 0 ? filteredCount[0].filteredCount : 0,
                data: affiliates,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPopularAffiliates(offset, limit, req) {
        var _a, _b;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this._userModel
                .aggregate([
                {
                    $match: {
                        role: userrole_enum_1.USERROLE.affiliate,
                        status: userstatus_enum_1.USERSTATUS.approved,
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
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
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
                    $count: 'totalCount'
                }
            ]);
            const affiliates = await this._userModel
                .aggregate([
                {
                    $match: {
                        role: userrole_enum_1.USERROLE.affiliate,
                        status: userstatus_enum_1.USERSTATUS.approved,
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
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
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
                        karibuURL: 0,
                        bankStatement: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        merchantID: 0,
                        customerID: 0,
                        deletedCheck: 0,
                        status: 0,
                        platformPercentage: 0,
                        favouriteAffiliate: 0,
                        campaignData: 0
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: (totalCount === null || totalCount === void 0 ? void 0 : totalCount.length) > 0 ? totalCount[0].totalCount : 0,
                data: affiliates,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getFavouriteAffiliates(offset, limit, req) {
        var _a, _b;
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let totalCount = await this._userModel.aggregate([
                {
                    $match: {
                        role: userrole_enum_1.USERROLE.affiliate,
                        status: userstatus_enum_1.USERSTATUS.approved,
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
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
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
                        role: userrole_enum_1.USERROLE.affiliate,
                        status: userstatus_enum_1.USERSTATUS.approved,
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
                        from: 'campaigns',
                        as: 'campaignData',
                        let: {
                            affiliateID: '$affiliateID',
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
                    $unwind: '$campaignData'
                },
                {
                    $lookup: {
                        from: 'affiliateFvaourites',
                        as: 'favouriteAffiliate',
                        let: {
                            affiliateID: '$affiliateID',
                            customerMongoID: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
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
                        karibuURL: 0,
                        bankStatement: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        merchantID: 0,
                        customerID: 0,
                        deletedCheck: 0,
                        status: 0,
                        platformPercentage: 0,
                        favouriteAffiliate: 0,
                        campaignData: 0
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: (totalCount === null || totalCount === void 0 ? void 0 : totalCount.length) > 0 ? totalCount[0].totalCount : 0,
                data: affiliates,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(resetPasswordDto, req) {
        try {
            if (req.user.isResetPassword) {
                let encryptedPassword = await bcrypt.hash(resetPasswordDto.password, 12);
                await this._userModel.findByIdAndUpdate(req.user.id, {
                    password: encryptedPassword,
                });
                return { message: 'Password reset successfully!' };
            }
            else {
                return { message: 'Token is not valid for password reset!' };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
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
                { $match: { status: userstatus_enum_1.USERSTATUS.new, role: userrole_enum_1.USERROLE.merchant } },
                {
                    $sort: { createdAt: -1 },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return { totalPendingUsers: totalCount, pendingUsers: users };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generatePassword() {
        let password = generator.generate({
            length: 12,
            numbers: true,
            symbols: true,
            lowercase: true,
            uppercase: true,
        });
        return password;
    }
    async sendMail(emailDto) {
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
            }
            else {
            }
        });
    }
    async approvePendingMerchants(status, userID) {
        try {
            let user = await this._userModel.findOne({
                _id: userID,
                status: userstatus_enum_1.USERSTATUS.new,
            });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (user && user.role == userrole_enum_1.USERROLE.merchant) {
                let generatedMerchantID = await this.generateMerchantId('merchantID');
                let generatedCustomerID = await this.generateCustomerId('customerID');
                let generatedPassword = await this.generatePassword();
                const salt = await bcrypt.genSalt();
                let hashedPassword = await bcrypt.hash(generatedPassword, salt);
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
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
                    merchantID: generatedMerchantID,
                    streetAddress: user.streetAddress,
                    zipCode: user.zipCode,
                    city: user.city,
                    googleMapPin: user.googleMapPin,
                    province: user.province,
                    phoneNumber: user.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
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
                                      <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${userObj.firstName} ${userObj.lastName}</h1>
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
                                              <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(userObj.password)}</b></a></td>
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
                const updatedUser = await this._userModel.updateOne({ _id: userID }, {
                    status: status,
                    password: hashedPassword,
                    voucherPinCode: pinCode,
                    merchantID: generatedMerchantID,
                    customerID: generatedCustomerID,
                    finePrint: `<p><strong>Purchase:</strong> let us know how many voucher one person can purchase<br><strong>Reservations:</strong> let us know how/where people can make a reservation<br><strong>Cancellation:</strong> let us know your cancellation policy<br><strong>More info:</strong> is there anything else important people should be aware of?</p>`,
                });
                return { message: 'Merchant Approved Successfully!' };
            }
            else if (user && user.role == userrole_enum_1.USERROLE.customer) {
                let generatedMerchantID = await this.generateMerchantId('merchantID');
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email.toLowerCase(),
                    legalName: user.legalName,
                    vatNumber: user.vatNumber,
                    phoneNumber: user.phoneNumber,
                    city: user.city,
                    streetAddress: user.streetAddress,
                    province: user.province,
                    zipCode: user.zipCode,
                };
                const locObj = {
                    merchantID: generatedMerchantID,
                    streetAddress: user.streetAddress,
                    zipCode: user.zipCode,
                    city: user.city,
                    googleMapPin: user.googleMapPin,
                    province: user.province,
                    phoneNumber: user.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
                    from: `"Divideals" <${process.env.EMAIL}>`,
                    to: userObj.email,
                    subject: 'Your account has been approved',
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
                          <table border="0" cellpadding="0" cellspacing="0" width="450" >
                              <tr>
                                  <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h6 style="margin:0px"> Dear</h6>
                                    <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${userObj.firstName} ${userObj.lastName}</h1>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <!-- COPY BLOCK -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="450" >
                            <!-- COPY -->
                            <tr>
                              <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; text-align: center" >
                                <p style="margin: 0;"<p>Your account on&nbsp;<b>Divideals Merchant Panel</b> has been approved. Please login to access your account.</p>
                              </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                          </table>
                      </td>
                  </tr>
                  <!-- COPY CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="450" >
                          </table>
                      </td>
                  </tr>
                  <!-- SUPPORT CALLOUT -->
                  <tr>
                      <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="450" >
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
                          <table border="0" cellpadding="0" cellspacing="0" width="450" >
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
                const updatedUser = await this._userModel.updateOne({ _id: userID }, {
                    status: status,
                    role: userrole_enum_1.USERROLE.merchant,
                    voucherPinCode: pinCode,
                    merchantID: generatedMerchantID,
                    finePrint: `<p><strong>Purchase:</strong> let us know how many voucher one person can purchase<br><strong>Reservations:</strong> let us know how/where people can make a reservation<br><strong>Cancellation:</strong> let us know your cancellation policy<br><strong>More info:</strong> is there anything else important people should be aware of?</p>`,
                });
                return { message: 'Merchant Approved Successfully!' };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approvePendingAffiliates(status, userID) {
        try {
            let user = await this._userModel.findOne({
                _id: userID,
                status: userstatus_enum_1.USERSTATUS.new,
            });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (user && user.role == userrole_enum_1.USERROLE.affiliate) {
                let generatedAffiliateID = await this.generateAffiliateId('affiliateID');
                let generatedCustomerID = await this.generateCustomerId('customerID');
                let generatedPassword = await this.generatePassword();
                const salt = await bcrypt.genSalt();
                let hashedPassword = await bcrypt.hash(generatedPassword, salt);
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
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
                    affiliateID: generatedAffiliateID,
                    streetAddress: user.streetAddress,
                    zipCode: user.zipCode,
                    city: user.city,
                    googleMapPin: user.googleMapPin,
                    province: user.province,
                    phoneNumber: user.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
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
                                      <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${userObj.firstName} ${userObj.lastName}</h1>
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
                                  <p style="margin: 0;">Your temporary password on <b>Divideals Affiliate Panel</b> is generated. Please use this password to login into your account. </p>
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
                                              <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(userObj.password)}</b></a></td>
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
                const updatedUser = await this._userModel.updateOne({ _id: userID }, {
                    status: status,
                    password: hashedPassword,
                    voucherPinCode: pinCode,
                    affiliateID: generatedAffiliateID,
                    customerID: generatedCustomerID,
                });
                return { message: 'Affiliate Approved Successfully!' };
            }
            else if (user && user.role == userrole_enum_1.USERROLE.customer) {
                let generatedAffiliateID = await this.generateAffiliateId('affiliateID');
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email.toLowerCase(),
                    legalName: user.legalName,
                    vatNumber: user.vatNumber,
                    phoneNumber: user.phoneNumber,
                    city: user.city,
                    streetAddress: user.streetAddress,
                    province: user.province,
                    zipCode: user.zipCode,
                };
                const locObj = {
                    affiliateID: generatedAffiliateID,
                    streetAddress: user.streetAddress,
                    zipCode: user.zipCode,
                    city: user.city,
                    googleMapPin: user.googleMapPin,
                    province: user.province,
                    phoneNumber: user.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
                    from: `"Divideals" <${process.env.EMAIL}>`,
                    to: userObj.email,
                    subject: 'Your password is generated',
                    text: '',
                    html: `
                  <html>
                  <head>
                    <title></title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <style type="text/css">
                      /* FONTS */
                      @media screen {
                        @font-face {
                          font-family: 'Lato';
                          font-style: normal;
                          font-weight: 400;
                          src: local('Lato Regular'), local('Lato-Regular'),
                            url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff)
                              format('woff');
                        }
                        @font-face {
                          font-family: 'Lato';
                          font-style: normal;
                          font-weight: 700;
                          src: local('Lato Bold'), local('Lato-Bold'),
                            url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff)
                              format('woff');
                        }
                        @font-face {
                          font-family: 'Lato';
                          font-style: italic;
                          font-weight: 400;
                          src: local('Lato Italic'), local('Lato-Italic'),
                            url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff)
                              format('woff');
                        }
                        @font-face {
                          font-family: 'Lato';
                          font-style: italic;
                          font-weight: 700;
                          src: local('Lato Bold Italic'), local('Lato-BoldItalic'),
                            url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff)
                              format('woff');
                        }
                      }
                      /* CLIENT-SPECIFIC STYLES */
                      body,
                      table,
                      td,
                      a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                      }
                      table,
                      td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                      }
                      img {
                        -ms-interpolation-mode: bicubic;
                      }
                      /* RESET STYLES */
                      img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                      }
                      table {
                        border-collapse: collapse !important;
                      }
                      body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                      }
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
                      div[style*='margin: 16px 0;'] {
                        margin: 0 !important;
                      }
                    </style>
                  </head>
                  <body
                    style="
                      background-color: #0081e9;
                      margin: 0 !important;
                      padding: 0 !important;
                    "
                  >
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <!-- LOGO -->
                      <tr>
                        <td bgcolor="#0081E9" align="center">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <tr>
                              <td
                                align="center"
                                valign="top"
                                style="padding: 40px 10px 40px 10px"
                              >
                                <div
                                  style="
                                    padding: 40px 20px 20px 20px;
                                    border-radius: 4px 4px 0px 0px;
                                    color: #ffffff;
                                    font-family: 'Lato', Helvetica, Arial, sans-serif;
                                    font-size: 48px;
                                    font-weight: 400;
                                    letter-spacing: 4px;
                                    line-height: 48px;
                                  "
                                >
                                  <h6 style="margin: 0px">DIVIDEALS</h6>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- HERO -->
                      <tr>
                        <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <tr>
                              <td
                                bgcolor="#FFFFFF"
                                align="center"
                                valign="top"
                                style="
                                  padding: 40px 20px 20px 20px;
                                  border-radius: 4px 4px 0px 0px;
                                  color: #111111;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 48px;
                                  font-weight: 400;
                                  letter-spacing: 4px;
                                  line-height: 48px;
                                "
                              >
                                <h6 style="margin: 0px">Dear</h6>
                                <h1 style="font-size: 32px; font-weight: 400; margin: 0">
                                  ${userObj.firstName} ${userObj.lastName}
                                </h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- COPY BLOCK -->
                      <tr>
                        <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <!-- COPY -->
                            <tr>
                              <td
                                bgcolor="#FFFFFF"
                                align="left"
                                style="
                                  padding: 20px 30px 40px 30px;
                                  color: #666666;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 18px;
                                  font-weight: 400;
                                  line-height: 25px;
                                  text-align: center;
                                "
                              >
                                <p style="margin: 0">
                                  Your account on&nbsp;<b>Divideals Affiliate Panel</b> has been
                                  approved. Please login to access your account.
                                </p>
                              </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                          </table>
                        </td>
                      </tr>
                      <!-- COPY CALLOUT -->
                      <tr>
                        <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450"></table>
                        </td>
                      </tr>
                      <!-- SUPPORT CALLOUT -->
                      <tr>
                        <td
                          bgcolor="#F4F4F4"
                          align="center"
                          style="padding: 30px 10px 0px 10px"
                        >
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <!-- HEADLINE -->
                            <tr>
                              <td
                                bgcolor="#0081E9"
                                align="center"
                                style="
                                  padding: 30px 30px 30px 30px;
                                  border-radius: 4px 4px 4px 4px;
                                  color: #666666;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 18px;
                                  font-weight: 400;
                                  line-height: 25px;
                                "
                              >
                                <h2
                                  style="
                                    font-size: 20px;
                                    font-weight: 400;
                                    color: #ffffff;
                                    margin: 0;
                                  "
                                >
                                  Need more help?
                                </h2>
                                <p style="margin: 0">
                                  <a style="color: #ffffff">We&rsquo;re here, ready to talk</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- FOOTER -->
                      <tr>
                        <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <!-- PERMISSION REMINDER -->
                            <tr>
                              <td
                                bgcolor="#F4F4F4"
                                align="left"
                                style="
                                  padding: 0px 30px 30px 30px;
                                  color: #666666;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  font-weight: 400;
                                  line-height: 18px;
                                "
                              >
                                <p style="margin: 0">
                                  You received this email because you requested for a password.
                                  If you did not,
                                  <a style="color: #111111; font-weight: 700"
                                    >please contact us.</a
                                  >.
                                </p>
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
                const updatedUser = await this._userModel.updateOne({ _id: userID }, {
                    status: status,
                    voucherPinCode: pinCode,
                    affiliateID: generatedAffiliateID,
                });
            }
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approveMerchant(userID, approveMerchantDto) {
        try {
            const user = await this._userModel.findOne({
                _id: userID,
                deletedCheck: false,
                role: userrole_enum_1.USERROLE.customer,
                newUser: false,
                status: userstatus_enum_1.USERSTATUS.approved,
            });
            if (user) {
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                delete approveMerchantDto.leadSource;
                approveMerchantDto.legalName = approveMerchantDto.companyName;
                approveMerchantDto.businessType = approveMerchantDto.categoryType;
                approveMerchantDto.voucherPinCode = pinCode;
                approveMerchantDto.zipCode = approveMerchantDto.zipCode.toString();
                approveMerchantDto.merchantID = await this.generateMerchantId('merchantID');
                approveMerchantDto.finePrint = `<p><strong>Purchase:</strong> let us know how many voucher one person can purchase<br><strong>Reservations:</strong> let us know how/where people can make a reservation<br><strong>Cancellation:</strong> let us know your cancellation policy<br><strong>More info:</strong> is there anything else important people should be aware of?</p>`;
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
                    firstName: approveMerchantDto.firstName,
                    lastName: approveMerchantDto.lastName,
                    email: approveMerchantDto.email.toLowerCase(),
                    legalName: approveMerchantDto.legalName,
                    vatNumber: approveMerchantDto.vatNumber,
                    phoneNumber: approveMerchantDto.phoneNumber,
                    city: approveMerchantDto.city,
                    streetAddress: approveMerchantDto.streetAddress,
                    province: approveMerchantDto.province,
                    zipCode: approveMerchantDto.zipCode,
                };
                const locObj = {
                    merchantID: approveMerchantDto.merchantID,
                    tradeName: approveMerchantDto.legalName,
                    streetAddress: approveMerchantDto.streetAddress,
                    zipCode: approveMerchantDto.zipCode,
                    city: approveMerchantDto.city,
                    googleMapPin: approveMerchantDto.googleMapPin,
                    province: approveMerchantDto.province,
                    phoneNumber: approveMerchantDto.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
                    from: `"Divideals" <${process.env.EMAIL}>`,
                    to: userObj.email,
                    subject: 'Your merchant account has been approved',
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
                              <table border="0" cellpadding="0" cellspacing="0" width="450" >
                                  <tr>
                                      <td bgcolor="#FFFFFF" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <h6 style="margin:0px"> Dear</h6>
                                        <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${userObj.firstName} ${userObj.lastName}</h1>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <!-- COPY BLOCK -->
                      <tr>
                          <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                              <table border="0" cellpadding="0" cellspacing="0" width="450" >
                                <!-- COPY -->
                                <tr>
                                  <td bgcolor="#FFFFFF" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; text-align: center" >
                                    <p style="margin: 0;"<p>Your account on&nbsp;<b>Divideals Merchant Panel</b> has been approved. Please login to access your account.</p>
                                  </td>
                                </tr>
                                <!-- BULLETPROOF BUTTON -->
                              </table>
                          </td>
                      </tr>
                      <!-- COPY CALLOUT -->
                      <tr>
                          <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px;">
                              <table border="0" cellpadding="0" cellspacing="0" width="450" >
                              </table>
                          </td>
                      </tr>
                      <!-- SUPPORT CALLOUT -->
                      <tr>
                          <td bgcolor="#F4F4F4" align="center" style="padding: 30px 10px 0px 10px;">
                              <table border="0" cellpadding="0" cellspacing="0" width="450" >
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
                              <table border="0" cellpadding="0" cellspacing="0" width="450" >
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
                approveMerchantDto.businessHours = businesshours_1.businessHours;
                await this._userModel.updateOne({ _id: userID }, approveMerchantDto);
                const merchant = await this._userModel.findOne({ _id: userID });
                return { enquiryID: userID, merchantID: merchant === null || merchant === void 0 ? void 0 : merchant.merchantID };
            }
            else {
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
                approveMerchantDto.status = userstatus_enum_1.USERSTATUS.approved;
                approveMerchantDto.zipCode = approveMerchantDto.zipCode.toString();
                approveMerchantDto.merchantID = await this.generateMerchantId('merchantID');
                approveMerchantDto.customerID = await this.generateCustomerId('customerID');
                approveMerchantDto.finePrint = `<p><strong>Purchase:</strong> let us know how many voucher one person can purchase<br><strong>Reservations:</strong> let us know how/where people can make a reservation<br><strong>Cancellation:</strong> let us know your cancellation policy<br><strong>More info:</strong> is there anything else important people should be aware of?</p>`;
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
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
                    merchantID: approveMerchantDto.merchantID,
                    tradeName: approveMerchantDto.legalName,
                    streetAddress: approveMerchantDto.streetAddress,
                    zipCode: approveMerchantDto.zipCode,
                    city: approveMerchantDto.city,
                    googleMapPin: approveMerchantDto.googleMapPin,
                    province: approveMerchantDto.province,
                    phoneNumber: approveMerchantDto.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
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
                                      <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${userObj.firstName} ${userObj.lastName}</h1>
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
                                              <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(generatedPassword)}</b></a></td>
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
                const lead = await this._leadModel.findOne({ _id: userID });
                approveMerchantDto.businessHours = lead.businessHours;
                const merchant = await new this._userModel(approveMerchantDto).save();
                return { enquiryID: userID, merchantID: merchant === null || merchant === void 0 ? void 0 : merchant.merchantID };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approveAffiliate(userID, affliateID) {
        try {
            const user = await this._userModel.findOne({
                _id: userID,
                deletedCheck: false,
                role: userrole_enum_1.USERROLE.customer,
                newUser: false,
                status: userstatus_enum_1.USERSTATUS.approved,
            });
            if (user) {
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                delete affliateID.leadSource;
                affliateID.legalName = affliateID === null || affliateID === void 0 ? void 0 : affliateID.companyName;
                affliateID.businessType = affliateID === null || affliateID === void 0 ? void 0 : affliateID.categoryType;
                affliateID.voucherPinCode = pinCode;
                affliateID.status = userstatus_enum_1.USERSTATUS.approved;
                affliateID.zipCode = affliateID === null || affliateID === void 0 ? void 0 : affliateID.zipCode.toString();
                affliateID.affiliateID = await this.generateAffiliateId('affiliateID');
                affliateID.customerID = await this.generateCustomerId('customerID');
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
                    firstName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.firstName,
                    lastName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.lastName,
                    email: affliateID === null || affliateID === void 0 ? void 0 : affliateID.email.toLowerCase(),
                    legalName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.legalName,
                    vatNumber: affliateID === null || affliateID === void 0 ? void 0 : affliateID.vatNumber,
                    phoneNumber: affliateID === null || affliateID === void 0 ? void 0 : affliateID.phoneNumber,
                    city: affliateID === null || affliateID === void 0 ? void 0 : affliateID.city,
                    streetAddress: affliateID === null || affliateID === void 0 ? void 0 : affliateID.streetAddress,
                    province: affliateID === null || affliateID === void 0 ? void 0 : affliateID.province,
                    zipCode: affliateID === null || affliateID === void 0 ? void 0 : affliateID.zipCode,
                };
                const locObj = {
                    merchantID: affliateID === null || affliateID === void 0 ? void 0 : affliateID.affiliateID,
                    tradeName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.legalName,
                    streetAddress: affliateID === null || affliateID === void 0 ? void 0 : affliateID.streetAddress,
                    zipCode: affliateID === null || affliateID === void 0 ? void 0 : affliateID.zipCode,
                    city: affliateID === null || affliateID === void 0 ? void 0 : affliateID.city,
                    googleMapPin: affliateID === null || affliateID === void 0 ? void 0 : affliateID.googleMapPin,
                    province: affliateID === null || affliateID === void 0 ? void 0 : affliateID.province,
                    phoneNumber: affliateID === null || affliateID === void 0 ? void 0 : affliateID.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
                    from: `"Divideals" <${process.env.EMAIL}>`,
                    to: userObj.email,
                    subject: 'Your password is generated',
                    text: '',
                    html: `
                  <html>
                  <head>
                    <title></title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <style type="text/css">
                      /* FONTS */
                      @media screen {
                        @font-face {
                          font-family: 'Lato';
                          font-style: normal;
                          font-weight: 400;
                          src: local('Lato Regular'), local('Lato-Regular'),
                            url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff)
                              format('woff');
                        }
                        @font-face {
                          font-family: 'Lato';
                          font-style: normal;
                          font-weight: 700;
                          src: local('Lato Bold'), local('Lato-Bold'),
                            url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff)
                              format('woff');
                        }
                        @font-face {
                          font-family: 'Lato';
                          font-style: italic;
                          font-weight: 400;
                          src: local('Lato Italic'), local('Lato-Italic'),
                            url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff)
                              format('woff');
                        }
                        @font-face {
                          font-family: 'Lato';
                          font-style: italic;
                          font-weight: 700;
                          src: local('Lato Bold Italic'), local('Lato-BoldItalic'),
                            url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff)
                              format('woff');
                        }
                      }
                      /* CLIENT-SPECIFIC STYLES */
                      body,
                      table,
                      td,
                      a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                      }
                      table,
                      td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                      }
                      img {
                        -ms-interpolation-mode: bicubic;
                      }
                      /* RESET STYLES */
                      img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                      }
                      table {
                        border-collapse: collapse !important;
                      }
                      body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                      }
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
                      div[style*='margin: 16px 0;'] {
                        margin: 0 !important;
                      }
                    </style>
                  </head>
                  <body
                    style="
                      background-color: #0081e9;
                      margin: 0 !important;
                      padding: 0 !important;
                    "
                  >
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <!-- LOGO -->
                      <tr>
                        <td bgcolor="#0081E9" align="center">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <tr>
                              <td
                                align="center"
                                valign="top"
                                style="padding: 40px 10px 40px 10px"
                              >
                                <div
                                  style="
                                    padding: 40px 20px 20px 20px;
                                    border-radius: 4px 4px 0px 0px;
                                    color: #ffffff;
                                    font-family: 'Lato', Helvetica, Arial, sans-serif;
                                    font-size: 48px;
                                    font-weight: 400;
                                    letter-spacing: 4px;
                                    line-height: 48px;
                                  "
                                >
                                  <h6 style="margin: 0px">DIVIDEALS</h6>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- HERO -->
                      <tr>
                        <td bgcolor="#0081E9" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <tr>
                              <td
                                bgcolor="#FFFFFF"
                                align="center"
                                valign="top"
                                style="
                                  padding: 40px 20px 20px 20px;
                                  border-radius: 4px 4px 0px 0px;
                                  color: #111111;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 48px;
                                  font-weight: 400;
                                  letter-spacing: 4px;
                                  line-height: 48px;
                                "
                              >
                                <h6 style="margin: 0px">Dear</h6>
                                <h1 style="font-size: 32px; font-weight: 400; margin: 0">
                                  ${userObj.firstName} ${userObj.lastName}
                                </h1>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- COPY BLOCK -->
                      <tr>
                        <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <!-- COPY -->
                            <tr>
                              <td
                                bgcolor="#FFFFFF"
                                align="left"
                                style="
                                  padding: 20px 30px 40px 30px;
                                  color: #666666;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 18px;
                                  font-weight: 400;
                                  line-height: 25px;
                                  text-align: center;
                                "
                              >
                                <p style="margin: 0">
                                  Your account on&nbsp;<b>Divideals Affiliate Panel</b> has been
                                  approved. Please login to access your account.
                                </p>
                              </td>
                            </tr>
                            <!-- BULLETPROOF BUTTON -->
                          </table>
                        </td>
                      </tr>
                      <!-- COPY CALLOUT -->
                      <tr>
                        <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450"></table>
                        </td>
                      </tr>
                      <!-- SUPPORT CALLOUT -->
                      <tr>
                        <td
                          bgcolor="#F4F4F4"
                          align="center"
                          style="padding: 30px 10px 0px 10px"
                        >
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <!-- HEADLINE -->
                            <tr>
                              <td
                                bgcolor="#0081E9"
                                align="center"
                                style="
                                  padding: 30px 30px 30px 30px;
                                  border-radius: 4px 4px 4px 4px;
                                  color: #666666;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 18px;
                                  font-weight: 400;
                                  line-height: 25px;
                                "
                              >
                                <h2
                                  style="
                                    font-size: 20px;
                                    font-weight: 400;
                                    color: #ffffff;
                                    margin: 0;
                                  "
                                >
                                  Need more help?
                                </h2>
                                <p style="margin: 0">
                                  <a style="color: #ffffff">We&rsquo;re here, ready to talk</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- FOOTER -->
                      <tr>
                        <td bgcolor="#F4F4F4" align="center" style="padding: 0px 10px 0px 10px">
                          <table border="0" cellpadding="0" cellspacing="0" width="450">
                            <!-- PERMISSION REMINDER -->
                            <tr>
                              <td
                                bgcolor="#F4F4F4"
                                align="left"
                                style="
                                  padding: 0px 30px 30px 30px;
                                  color: #666666;
                                  font-family: 'Lato', Helvetica, Arial, sans-serif;
                                  font-size: 14px;
                                  font-weight: 400;
                                  line-height: 18px;
                                "
                              >
                                <p style="margin: 0">
                                  You received this email because you requested for a password.
                                  If you did not,
                                  <a style="color: #111111; font-weight: 700"
                                    >please contact us.</a
                                  >.
                                </p>
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
                const affiliate = await this._userModel.findOne({ _id: userID });
                await this._userModel.updateOne({ _id: userID }, affliateID);
                return { enquiryID: userID, affliateID: affiliate === null || affiliate === void 0 ? void 0 : affiliate.affiliateID };
            }
            else {
                let generatedPassword = await this.generatePassword();
                const salt = await bcrypt.genSalt();
                let hashedPassword = await bcrypt.hash(generatedPassword, salt);
                const pinCode = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                delete affliateID.leadSource;
                affliateID.legalName = affliateID === null || affliateID === void 0 ? void 0 : affliateID.companyName;
                affliateID.businessType = affliateID === null || affliateID === void 0 ? void 0 : affliateID.categoryType;
                affliateID.voucherPinCode = pinCode;
                affliateID.password = hashedPassword;
                affliateID.status = userstatus_enum_1.USERSTATUS.approved;
                affliateID.zipCode = affliateID === null || affliateID === void 0 ? void 0 : affliateID.zipCode.toString();
                affliateID.affiliateID = await this.generateAffiliateId('affiliateID');
                affliateID.customerID = await this.generateCustomerId('customerID');
                const userObj = {
                    ID: new mongoose_2.Types.ObjectId().toHexString(),
                    firstName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.firstName,
                    lastName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.lastName,
                    email: affliateID === null || affliateID === void 0 ? void 0 : affliateID.email.toLowerCase(),
                    password: hashedPassword,
                    legalName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.legalName,
                    vatNumber: affliateID === null || affliateID === void 0 ? void 0 : affliateID.vatNumber,
                    phoneNumber: affliateID === null || affliateID === void 0 ? void 0 : affliateID.phoneNumber,
                    city: affliateID === null || affliateID === void 0 ? void 0 : affliateID.city,
                    streetAddress: affliateID === null || affliateID === void 0 ? void 0 : affliateID.streetAddress,
                    province: affliateID === null || affliateID === void 0 ? void 0 : affliateID.province,
                    zipCode: affliateID === null || affliateID === void 0 ? void 0 : affliateID.zipCode,
                };
                const locObj = {
                    merchantID: affliateID === null || affliateID === void 0 ? void 0 : affliateID.affiliateID,
                    tradeName: affliateID === null || affliateID === void 0 ? void 0 : affliateID.legalName,
                    streetAddress: affliateID === null || affliateID === void 0 ? void 0 : affliateID.streetAddress,
                    zipCode: affliateID === null || affliateID === void 0 ? void 0 : affliateID.zipCode,
                    city: affliateID === null || affliateID === void 0 ? void 0 : affliateID.city,
                    googleMapPin: affliateID === null || affliateID === void 0 ? void 0 : affliateID.googleMapPin,
                    province: affliateID === null || affliateID === void 0 ? void 0 : affliateID.province,
                    phoneNumber: affliateID === null || affliateID === void 0 ? void 0 : affliateID.phoneNumber,
                };
                if (userID) {
                    await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
                }
                const location = await new this._locationModel(locObj).save();
                const emailDto = {
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
                                      <h1 style="font-size: 32px; font-weight: 400; margin: 0;">${userObj.firstName} ${userObj.lastName}</h1>
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
                                              <td align="center" style="border-radius: 3px;" ><a style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; color: black; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0081E9; display: inline-block;"><b>${htmlencode.htmlEncode(generatedPassword)}</b></a></td>
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
                const affiliate = await new this._userModel(affliateID).save();
                return { enquiryID: userID, affliateID: affiliate === null || affiliate === void 0 ? void 0 : affiliate.affiliateID };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCustomerByID(customerID) {
        try {
            let customer = await this._userModel.aggregate([
                {
                    $match: {
                        customerID: customerID,
                        role: userrole_enum_1.USERROLE.customer,
                        deletedCheck: false,
                    },
                },
                {
                    $project: {
                        _id: 0,
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
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addNewIDs() {
        var e_3, _a;
        try {
            let docs = await this._userModel.find({ role: userrole_enum_1.USERROLE.merchant });
            let num = 0;
            try {
                for (var docs_1 = __asyncValues(docs), docs_1_1; docs_1_1 = await docs_1.next(), !docs_1_1.done;) {
                    let doc = docs_1_1.value;
                    num++;
                    console.log(`${num}`);
                    await this._userModel.updateOne({ _id: doc._id }, { $set: { affiliateID: '' } });
                    await this._userModel.updateOne({ _id: doc._id }, { $rename: { userID: 'merchantID' } });
                    let genereatedCustomerID = await this.generateCustomerId('customerID');
                    await this._userModel.updateOne({ _id: doc._id }, { $set: { customerID: genereatedCustomerID } });
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (docs_1_1 && !docs_1_1.done && (_a = docs_1.return)) await _a.call(docs_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updatePasswordForAllMerchant() {
        var e_4, _a;
        try {
            let merchants = await this._userModel.find({ role: 'Merchant' });
            merchants = JSON.parse(JSON.stringify(merchants));
            let newPassword = 'Belgium@123';
            try {
                for (var merchants_1 = __asyncValues(merchants), merchants_1_1; merchants_1_1 = await merchants_1.next(), !merchants_1_1.done;) {
                    let merchantItem = merchants_1_1.value;
                    const salt = await bcrypt.genSalt();
                    const hashedPassword = await bcrypt.hash(newPassword, salt);
                    await this._userModel.updateOne({ _id: merchantItem === null || merchantItem === void 0 ? void 0 : merchantItem.id }, { password: hashedPassword, newUser: false });
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (merchants_1_1 && !merchants_1_1.done && (_a = merchants_1.return)) await _a.call(merchants_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException(err === null || err === void 0 ? void 0 : err.message);
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('Location')),
    __param(2, (0, mongoose_1.InjectModel)('Counter')),
    __param(3, (0, mongoose_1.InjectModel)('Lead')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map