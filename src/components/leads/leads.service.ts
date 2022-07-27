import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadInterface } from 'src/interface/lead/lead.interface';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel('Lead') private readonly _leadModel: Model<LeadInterface>,
  ) {}

  async createLead(leadDto) {
    return await new this._leadModel(leadDto).save();
  }
}
