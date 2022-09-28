import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityInterface } from '../../interface/activity/activity.interface';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel('Activity')
    private readonly activityModel: Model<ActivityInterface>,
  ) {}

  async createActivity(activityDto) {
    try {
      const activity = await new this.activityModel(activityDto).save();
      if (!activity) {
        throw new HttpException(
          'Unable to create document',
          HttpStatus.BAD_REQUEST,
        );
      }
      return activity;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getActivity(id) {
    try {
      const activity = await this.activityModel.findById(id);
      if (!activity) {
        throw new HttpException('No Activity Found', HttpStatus.NOT_FOUND);
      }
      return activity;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllActivities(offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;
      const totalActivities = await this.activityModel.countDocuments();
      let activities = await this.activityModel
        .aggregate([
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
        totalActivities,
        data: activities,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getActivitiesByMerchant(req, offset, limit) {
    try {
      offset = parseInt(offset) < 0 ? 0 : offset;
      limit = parseInt(limit) < 1 ? 10 : limit;
      const totalActivities = await this.activityModel.countDocuments({
        merchantMongoID: req.user.id,
      });
      let activities = await this.activityModel
        .aggregate([
          {
            $match: {
              merchantMongoID: req.user.id,
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
          {
            $sort: {
              createdAt: -1,
            },
          },
        ])
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      return {
        totalActivities,
        data: activities,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
