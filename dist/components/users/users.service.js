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
    async addUser(usersDto) {
        usersDto.profilePicBlurHash = await (0, utils_1.encodeImageToBlurhash)(usersDto.profilePicURL);
        const user = new this._userModel(usersDto).save();
        return user;
    }
    async changePassword(id, updatepasswordDto) {
        let user = await this._userModel.findOne({ _id: id });
        if (!user) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const comaprePasswords = bcrypt.compare(updatepasswordDto.password, user.password);
        if (!comaprePasswords) {
            throw new common_1.UnauthorizedException('Incorrect password!');
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
    async completeKYC(merchantID, kycDto) {
        await this._userModel.updateOne({ _id: merchantID }, kycDto);
        await this._userModel.updateOne({ _id: merchantID }, { kycStatus: true });
        return {
            message: 'KYC has been updated successfully!',
        };
    }
    async updateMerchantprofile(merchantID, usersDto) {
        let user = await this._userModel.findOne({ _id: merchantID });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (usersDto === null || usersDto === void 0 ? void 0 : usersDto.profilePicURL) {
            usersDto.profilePicBlurHash = await (0, utils_1.encodeImageToBlurhash)(usersDto.profilePicURL);
        }
        await this._userModel.updateOne({ _id: merchantID }, usersDto);
        return {
            message: 'User has been updated succesfully',
        };
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
                { $match: { status: 'Pending', role: 'Merchant' } },
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
    async approvePendingUsers(status, userID) {
        try {
            let user = await this._userModel.findOne({
                _id: userID,
                status: userstatus_enum_1.USERSTATUS.pending,
            });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            let generatedPassword = await this.generatePassword();
            const salt = await bcrypt.genSalt();
            let hashedPassword = await bcrypt.hash(generatedPassword, salt);
            const pinCode = otpGenerator.generate(6, {
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
            });
            return { message: 'Merchant Approved Successfully!' };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approveMerchant(userID, approveMerchantDto) {
        try {
            const lead = await this._leadModel.findOne({
                _id: userID,
                deletedCheck: false,
            });
            if (!lead) {
                throw new common_1.BadRequestException('Merchent already approved');
            }
            let generatedPassword = await this.generatePassword();
            const salt = await bcrypt.genSalt();
            let hashedPassword = await bcrypt.hash(generatedPassword, salt);
            const pinCode = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            approveMerchantDto.tradeName = approveMerchantDto.companyName;
            approveMerchantDto.businessType = approveMerchantDto.categoryType;
            approveMerchantDto.pinCode = pinCode;
            approveMerchantDto.password = hashedPassword;
            approveMerchantDto.status = userstatus_enum_1.USERSTATUS.approved;
            approveMerchantDto.zipCode = approveMerchantDto.zipCode.toString();
            approveMerchantDto.userID = await this.generateMerchantId('merchantID');
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
                merchantID: approveMerchantDto.userID,
                streetAddress: approveMerchantDto.streetAddress,
                zipCode: approveMerchantDto.zipCode,
                city: approveMerchantDto.city,
                googleMapPin: approveMerchantDto.googleMapPin,
                province: approveMerchantDto.province,
                phoneNumber: approveMerchantDto.phoneNumber,
            };
            await this._leadModel.updateOne({ _id: userID }, { deletedCheck: true });
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
            const merchant = await new this._userModel(approveMerchantDto).save();
            return { enquiryID: userID, merchantID: merchant === null || merchant === void 0 ? void 0 : merchant.userID };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
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