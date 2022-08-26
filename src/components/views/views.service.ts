import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEALSTATUS } from 'src/enum/deal/dealstatus.enum';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { ViewsInterface } from 'src/interface/views/views.interface';

@Injectable()
export class ViewsService {
    constructor(
    @InjectModel('views') private readonly viewsModel: Model<ViewsInterface>,
    @InjectModel('Deal') private readonly dealModel: Model<DealInterface>,
    @InjectModel('User') private readonly _userModel: Model<UsersInterface>) {}

    async createDealView (viewsDto, req) {
        try {
            // const deal = await this.dealModel.findOne({_id: viewsDto.dealMongoID, deletedCheck: false, dealStatus: DEALSTATUS.published});
            // if (!deal) {
            //     throw new HttpException('Deal not found', HttpStatus.BAD_REQUEST);
            // }

            // viewsDto.customerMongoID = req.user.id;
            // viewsDto.customerID = req.user.userID;
            // viewsDto.viewedTime = new Date().getTime();

            return await new this.viewsModel(viewsDto).save();

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getView (id) {
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

        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllViews (offset, limit) {
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
            .limit(parseInt(limit))

            return {
                totalCount: totalCount,
                data: allViews
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllViewsByCustomer (customerID, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            const totalCount = await this.viewsModel.countDocuments({customerID: customerID});

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
            .limit(parseInt(limit))

            return {
                totalCount: totalCount,
                data: allViews
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }
}
