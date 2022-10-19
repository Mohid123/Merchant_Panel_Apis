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
exports.FavouritesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dealstatus_enum_1 = require("../../enum/deal/dealstatus.enum");
const userstatus_enum_1 = require("../../enum/user/userstatus.enum");
let FavouritesService = class FavouritesService {
    constructor(favouriteModel, dealModel, affiliateFavouriteModel, _userModel) {
        this.favouriteModel = favouriteModel;
        this.dealModel = dealModel;
        this.affiliateFavouriteModel = affiliateFavouriteModel;
        this._userModel = _userModel;
    }
    async addToFavourites(favouritesDto, req) {
        try {
            const deal = await this.dealModel.findOne({ _id: favouritesDto.dealMongoID, deletedCheck: false, dealStatus: dealstatus_enum_1.DEALSTATUS.published });
            if (!deal) {
                throw new common_1.HttpException('Deal not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const alreadyFavourite = await this.favouriteModel.findOne({
                dealID: favouritesDto.dealID,
                customerMongoID: req.user.id,
                deletedCheck: false,
            });
            if (alreadyFavourite) {
                return alreadyFavourite;
            }
            else {
                favouritesDto.customerMongoID = req.user.id;
                favouritesDto.customerID = req.user.customerID;
                await this.favouriteModel.updateOne({ dealID: favouritesDto.dealID, customerMongoID: req.user.id }, Object.assign(Object.assign({}, favouritesDto), { deletedCheck: false }), { upsert: true });
                return {
                    message: 'Added to favourites'
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addToAffiliateFavourites(affiliateFavouritesDto, req) {
        try {
            const affiliate = await this._userModel.findOne({ _id: affiliateFavouritesDto.affiliateMongoID, deletedCheck: false, status: userstatus_enum_1.USERSTATUS.approved });
            if (!affiliate) {
                throw new common_1.HttpException('Affiliate not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const alreadyFavouriteAffiliate = await this.affiliateFavouriteModel.findOne({
                affiliateID: affiliateFavouritesDto.affiliateID,
                customerMongoID: req.user.id,
                deletedCheck: false,
            });
            if (alreadyFavouriteAffiliate) {
                return alreadyFavouriteAffiliate;
            }
            else {
                affiliateFavouritesDto.customerMongoID = req.user.id;
                affiliateFavouritesDto.customerID = req.user.customerID;
                await this.affiliateFavouriteModel.updateOne({ affiliateID: affiliateFavouritesDto.affiliateID, customerMongoID: req.user.id }, Object.assign(Object.assign({}, affiliateFavouritesDto), { deletedCheck: false }), { upsert: true });
                return {
                    message: 'Added to favourites'
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeFromFavourites(id, req) {
        await this.favouriteModel.updateOne({
            dealMongoID: id,
            customerMongoID: req.user.id,
        }, { deletedCheck: true });
        return {
            message: 'Removed from favourites'
        };
    }
    async removeFromAffiliateFavourites(id, req) {
        try {
            await this.affiliateFavouriteModel.updateOne({
                affiliateMongoID: id,
                customerMongoID: req.user.id,
            }, {
                deletedCheck: true
            });
            return {
                message: 'Removed from favourites'
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getFavourite(id) {
        try {
            const favourite = await this.favouriteModel.aggregate([
                {
                    $match: {
                        _id: id,
                        deletedCheck: false
                    }
                },
                {
                    $addFields: {
                        _id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]).then((items) => items[0]);
            return favourite;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllFavourites(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalCount = await this.favouriteModel.countDocuments({
                deletedCheck: false
            });
            const allFavourites = await this.favouriteModel.aggregate([
                {
                    $match: {
                        deletedCheck: false
                    }
                },
                {
                    $sort: {
                        cretedAt: -1
                    }
                },
                {
                    $addFields: {
                        id: "$_id"
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
                totalFavouriteDeals: totalCount,
                data: allFavourites
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
FavouritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('favourites')),
    __param(1, (0, mongoose_1.InjectModel)('Deal')),
    __param(2, (0, mongoose_1.InjectModel)('affiliateFvaourites')),
    __param(3, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], FavouritesService);
exports.FavouritesService = FavouritesService;
//# sourceMappingURL=favourites.service.js.map