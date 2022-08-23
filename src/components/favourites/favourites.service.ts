import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from 'src/enum/deal/dealstatus.enum';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { FavouritesInterface } from 'src/interface/favourites/favourites.interface';

@Injectable()
export class FavouritesService {
    constructor(
        @InjectModel('favourites') private readonly favouriteModel:Model<FavouritesInterface>,
        @InjectModel('Deal') private readonly dealModel: Model<DealInterface>) {}

    async addToFavourites (favouritesDto, req) {
        try {
            const deal = await this.dealModel.findOne({_id: favouritesDto.dealMongoID, deletedCheck: false, dealStatus: DEALSTATUS.published});
            if (!deal) {
                throw new HttpException('Deal not found', HttpStatus.BAD_REQUEST);
            }

            const alreadyFavourite = await this.favouriteModel.findOne({
                dealID: favouritesDto.dealID,
                customerMongoID: req.user.id,
                deletedCheck:false,
            });
            debugger
            if (alreadyFavourite) {
                return alreadyFavourite;
            } else if(alreadyFavourite?.deletedCheck == true) {
                await this.favouriteModel.updateOne({_id: alreadyFavourite._id},{deletedCheck: false});
                return {
                    message: 'Added to favourites'
                }
            } else {
                favouritesDto.customerMongoID = req.user.id;
                favouritesDto.customerID = req.user.userID;

                return await new this.favouriteModel(favouritesDto).save();
            }

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async removeFromFavourites (id) {
        const favourite = await this.favouriteModel.findOne({_id: id, deletedCheck: false});

        if (!favourite) {
            throw new HttpException('Favourite not found', HttpStatus.BAD_REQUEST);
        } else {
            await this.favouriteModel.updateOne({_id: id}, {deletedCheck:true});
            return {
                message: 'Removed from favourites'
            }
        }
    }

    async getFavouriteDeal (id) {
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

    async getAllFavouriteDeals (offset, limit) {
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
