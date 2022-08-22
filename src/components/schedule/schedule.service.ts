import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleDealDto } from 'src/dto/schedule/scheduleDeal.dto';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { Schedule } from 'src/interface/schedule/schedule.interface';
const nodeSchedule = require('node-schedule');

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('Schedule') private _scheduleModel: Model<Schedule>,
    @InjectModel('Deal') private _dealModel: Model<DealInterface>,
  ) {}

  async retrieveJobs() {
    let jobs = await this._scheduleModel.find({
      status: 0,
      deletedCheck: false,
      scheduleDate: { $gt: new Date() },
    });

    console.log(`${jobs.length} jobs scheduled...`);

    await this._scheduleModel.updateMany(
      { status: 0, scheduleDate: { $lte: new Date() } },
      { $set: { status: -1 } },
    );

    jobs = JSON.parse(JSON.stringify(jobs));

    jobs.forEach(async (jobDoc) => {
      let status = '';
      if (jobDoc.type == 'publishDeal') {
        status = 'Published';
      } else if (jobDoc.type == 'expireDeal') {
        status = 'Expired';
      }
      await this.scheduleDealsFromDatabase(
        jobDoc.id,
        jobDoc.dealID,
        jobDoc.scheduleDate,
        status,
      );
    });
  }

  async scheduleDeal(scheduleDealDto: ScheduleDealDto) {
    const job = await new this._scheduleModel(scheduleDealDto).save();

    nodeSchedule.scheduleJob(job.id, job.scheduleDate, async () => {
      let status = '';
      if (job.type == 'publishDeal') {
        status = 'Published';
      } else if (job.type == 'expireDeal') {
        status = 'Expired';
      }

      if (status == 'Published') {
        await this._dealModel.updateOne(
          { dealID: job.dealID },
          { dealStatus: status },
        );

        const deal = await this._dealModel.findOne({ dealID: job.dealID });

        await new this._scheduleModel({
          scheduleDate: new Date(deal.endDate),
          status: 0,
          type: 'expireDeal',
          dealID: deal.dealID,
          deletedCheck: false,
        }).save();

        await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
      } else if (status == 'Expired') {
        await this._dealModel.updateOne(
          { dealID: job.dealID },
          { dealStatus: status },
        );

        await this._scheduleModel.updateOne({ _id: job.id }, { status: -1 });
      }

      console.log(`Deal ${status}...`);
    });
  }

  async scheduleDealsFromDatabase(id, dealID, scheduleDate, status) {
    nodeSchedule.scheduleJob(id, scheduleDate, async () => {
      if (status == 'Published') {
        await this._dealModel.updateOne(
          { dealID: dealID },
          { dealStatus: status },
        );

        const deal = await this._dealModel.findOne({ dealID: dealID });

        await this.scheduleDeal({
          scheduleDate: new Date(deal.endDate),
          status: 0,
          type: 'expireDeal',
          dealID: deal.dealID,
          deletedCheck: false,
        });

        await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
      } else if (status == 'Expired') {
        await this._dealModel.updateOne(
          { dealID: dealID },
          { dealStatus: status },
        );
        await this._scheduleModel.updateOne({ _id: id }, { status: -1 });
      }

      console.log(`Deal ${status}...`);
    });
  }

  async cancelJob(jobId) {
    try {
      let myJob = await nodeSchedule.scheduledJobs[jobId];

      if (!myJob) {
        throw new Error('No Job Found');
      }

      myJob.cancel();
      console.log('Job deleted successfully!');
    } catch (err) {
      console.log('Error...');
    }

    return this._scheduleModel.updateOne(
      { _id: jobId },
      { deletedCheck: true, status: -1 },
    );
  }

  async getQueuedSchedules() {
    try {
      return await this._scheduleModel.find({ status: 0, deletedCheck: false });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
