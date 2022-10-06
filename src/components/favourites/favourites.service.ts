import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from 'src/enum/deal/dealstatus.enum';
import { USERSTATUS } from 'src/enum/user/userstatus.enum';
import { AffiliateFavouritesInterface } from 'src/interface/affiliate/affiliate.interface';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { FavouritesInterface } from 'src/interface/favourites/favourites.interface';
import { UsersInterface } from 'src/interface/user/users.interface';

@Injectable()
export class FavouritesService {
    constructor(
        @InjectModel('favourites') private readonly favouriteModel:Model<FavouritesInterface>,
        @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
        @InjectModel('affiliateFvaourites') private readonly affiliateFavouriteModel:Model<AffiliateFavouritesInterface>,
        @InjectModel('User') private readonly _userModel: Model<UsersInterface>
        ) {}

    async addToFavourites (favouritesDto, req) {
        try {
            const deal = await this.dealModel.findOne({_id: favouritesDto.dealMongoID, deletedCheck: false, dealStatus: DEALSTATUS.published});
            if (!deal) {
                throw new HttpException('Deal not found', HttpStatus.BAD_REQUEST);
            }

            const alreadyFavourite = await this.favouriteModel.findOne({
                dealID: favouritesDto.dealID,
                customerMongoID: req.user.id,
                deletedCheck: false,
            });

            if (alreadyFavourite) {
                return alreadyFavourite;
            } else {

                favouritesDto.customerMongoID = req.user.id;
                favouritesDto.customerID = req.user.customerID;

                await this.favouriteModel.updateOne(
                    { dealID: favouritesDto.dealID, customerMongoID: req.user.id},
                    {...favouritesDto, deletedCheck: false},
                    {upsert:true}
                );
                return {
                    message: 'Added to favourites'
                }
            }

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async addToAffiliateFavourites (affiliateFavouritesDto, req) {
        try {
            const affiliate = await this._userModel.findOne({_id: affiliateFavouritesDto.affiliateMongoID, deletedCheck: false, status: USERSTATUS.approved});
            if (!affiliate) {
                throw new HttpException('Affiliate not found', HttpStatus.BAD_REQUEST);
            }

            const alreadyFavouriteAffiliate = await this.affiliateFavouriteModel.findOne({
                affiliateID: affiliateFavouritesDto.affiliateID,
                customerMongoID: req.user.id,
                deletedCheck: false,
            });

            if (alreadyFavouriteAffiliate) {
                return alreadyFavouriteAffiliate;
            } else {
                
                affiliateFavouritesDto.customerMongoID = req.user.id;
                affiliateFavouritesDto.customerID = req.user.customerID;

                await this.affiliateFavouriteModel.updateOne(
                    {affiliateID: affiliateFavouritesDto.affiliateID, customerMongoID: req.user.id}, 
                    {...affiliateFavouritesDto ,deletedCheck: false},
                    {upsert: true}
                );
                return {
                    message: 'Added to favourites'
                }
            } 

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async removeFromFavourites(id, req) {
        await this.favouriteModel.updateOne({
            dealMongoID: id,
            customerMongoID: req.user.id,
        }, { deletedCheck: true });
        return {
            message: 'Removed from favourites'
        }
    }

    async removeFromAffiliateFavourites (id, req) {
        try {
            await this.affiliateFavouriteModel.updateOne(
                {
                    affiliateMongoID: id,
                    customerMongoID: req.user.id,
                }, 
                { 
                    deletedCheck: true
                }
                );
            return {
                message: 'Removed from favourites'
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getFavourite (id) {
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
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllFavourites (offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            const totalCount = await this.favouriteModel.countDocuments({
                deletedCheck: false
            })

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
            .limit(parseInt(limit))

            return {
                totalFavouriteDeals: totalCount,
                data: allFavourites
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }
}
