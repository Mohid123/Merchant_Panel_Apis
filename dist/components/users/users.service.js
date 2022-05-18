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
let UsersService = class UsersService {
    constructor(_userModel) {
        this._userModel = _userModel;
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
        const salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(updatepasswordDto.newPassword, salt);
        if (!comaprePasswords) {
            throw new common_1.UnauthorizedException('Incorrect password!');
        }
        else {
            return await this._userModel.updateOne({ _id: id }, { password: hashedPassword, newUser: false });
        }
    }
    async completeKYC(merchantID, kycDto) {
        return await this._userModel.updateOne({ _id: merchantID }, kycDto);
    }
    async updateMerchantprofile(usersDto) {
        return this._userModel.updateOne({ _id: usersDto.id }, usersDto);
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
                    companyName: 0,
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
                    businessProfile: 0,
                    generalTermsAgreements: 0,
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
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map