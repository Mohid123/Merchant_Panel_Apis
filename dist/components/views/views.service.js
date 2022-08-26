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
exports.ViewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ViewsService = class ViewsService {
    constructor(viewsModel, dealModel, _userModel) {
        this.viewsModel = viewsModel;
        this.dealModel = dealModel;
        this._userModel = _userModel;
    }
    async createDealView(viewsDto, req) {
        try {
            return await new this.viewsModel(viewsDto).save();
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getView(id) {
        try {
            return await this.viewsModel.aggregate([
                {
                    $match: {
                        _id: id
                    }
                },
                {
                    $addFields: {
                        id: '_$id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]).then((items) => items[0]);
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllViews(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.viewsModel.countDocuments({});
            const allViews = await this.viewsModel.aggregate([
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
                data: allViews
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllViewsByCustomer(customerID, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.viewsModel.countDocuments({ customerID: customerID });
            const allViews = await this.viewsModel.aggregate([
                {
                    $match: {
                        customerID: customerID
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
                data: allViews
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ViewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('views')),
    __param(1, (0, mongoose_1.InjectModel)('Deal')),
    __param(2, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ViewsService);
exports.ViewsService = ViewsService;
//# sourceMappingURL=views.service.js.map