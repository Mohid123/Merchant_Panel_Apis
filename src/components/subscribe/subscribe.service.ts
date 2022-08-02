import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscribeInterface } from 'src/interface/subscribe/subscribe.interface';

@Injectable()
export class SubscribeService {
    constructor(@InjectModel('subscribe') private readonly _subscribeModel: Model<SubscribeInterface>) {}

    async addSubscription (subscribeDto) {
        try {
            return new this._subscribeModel(subscribeDto).save();
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteSubscription (id) {
        try {
            let subscription = await this._subscribeModel.updateOne({_id: id},{deletedCheck: true});

            if (!subscription) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }

            return {message: 'Subscription has been removed successfully'};
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getSubscription (email) {
        try {
            let subscription = await this._subscribeModel.findOne({email: email, deletedCheck: false});

            if (!subscription) {
                throw new HttpException('Subscription not found!', HttpStatus.BAD_REQUEST);
            } else {
                return subscription;
            } 
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllSubscriptions (offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            let totalCount = await this._subscribeModel.countDocuments({deletedCheck: false});

            let subscriptions = await this._subscribeModel.aggregate([
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
                data: subscriptions,
              };
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
