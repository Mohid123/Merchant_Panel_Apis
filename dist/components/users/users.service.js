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
    async completeKYC(kycDto) {
        return await this._userModel.updateOne({ _id: kycDto.id }, kycDto);
    }
    async updateUser(usersDto) {
        usersDto.profilePicBlurHash = await (0, utils_1.encodeImageToBlurhash)(usersDto.profilePicURL);
        return this._userModel.updateOne({ _id: usersDto.id }, usersDto);
    }
    async updateBusinessHours(updateHoursDTO) {
        let user = await this._userModel.findOne({ _id: updateHoursDTO.id });
        const newBusinessHours = user.businessHours.map((hour) => {
            var _a, _b;
            if (((_a = updateHoursDTO === null || updateHoursDTO === void 0 ? void 0 : updateHoursDTO.businessHours) === null || _a === void 0 ? void 0 : _a.findIndex(data => data.day == hour.day)) >= 0) {
                return updateHoursDTO === null || updateHoursDTO === void 0 ? void 0 : updateHoursDTO.businessHours[(_b = updateHoursDTO === null || updateHoursDTO === void 0 ? void 0 : updateHoursDTO.businessHours) === null || _b === void 0 ? void 0 : _b.findIndex(data => data.day == hour.day)];
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
    async geUserById(id) {
        return await this._userModel.aggregate([
            {
                $match: {
                    _id: id,
                    deletedCheck: false
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
        ]);
    }
    async getAllUsers(offset, limit) {
        offset = parseInt(offset) < 0 ? 0 : offset;
        limit = parseInt(limit) < 1 ? 10 : limit;
        const totalCount = await this._userModel.countDocuments({ deletedCheck: false });
        const users = await this._userModel.aggregate([
            {
                $match: {
                    deletedCheck: false
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
        return {
            totalCount: totalCount,
            data: users
        };
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map