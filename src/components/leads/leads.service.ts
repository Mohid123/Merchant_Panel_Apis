import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { LeadInterface } from 'src/interface/lead/lead.interface';
import { generateStringId } from '../file-management/utils/utils';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel('Lead') private readonly _leadModel: Model<LeadInterface>,
  ) {}

  async createLead(leadDto) {
    leadDto.email = leadDto?.email?.toLowerCase();
    let user = await this._leadModel.findOne({
      email: leadDto.email,
    });
    if (user) {
      throw new ForbiddenException('Email already exists');
    }

    leadDto.tradeName = leadDto.companyName;

    leadDto.countryCode = 'BE';

    leadDto.leadSource = 'web';

    const lead = await new this._leadModel(leadDto).save();

    const res = await axios.get(
      `https://sandbox.zohoapis.eu/crm/v2/functions/createleadinzoho/actions/execute?auth_type=apikey&zapikey=1003.527925363aa0ee3a8c9cf0be2f92f93a.5464e31887b65bfe3e373beb87462db7&enquiryid=${lead.id}`,
    );

    return lead;
  }

  async getLead(id) {
    const lead = await this._leadModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $addFields: {
          companyName: '$tradeName',
          categoryType: '$businessType',
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          role: 1,
          status: 1,
          categoryType: 1,
          companyName: 1,
          streetAddress: 1,
          zipCode: 1,
          city: 1,
          vatNumber: 1,
          province: 1,
          website_socialAppLink: 1,
          countryCode: 1,
          leadSource: 1,
        },
      },
    ]);

    if (lead.length == 0) {
      throw new HttpException('No Record Found!', HttpStatus.BAD_REQUEST);
    }

    // let _locationId = generateStringId();

    // lead[0].locations = [
    //   {
    //     _id: _locationId,
    //     locationName: '',
    //     streetAddress: lead[0].streetAddress,
    //     zipCode: lead[0].zipCode.toString(),
    //     city: lead[0].city,
    //     googleMapPin: lead[0].googleMapPin,
    //     province: lead[0].province,
    //     phoneNumber: lead[0].phoneNumber,
    //   },
    // ];

    // delete lead[0].streetAddress;
    // delete lead[0].zipCode;
    // delete lead[0].city;
    // delete lead[0].googleMapPin;
    // delete lead[0].province;
    // delete lead[0].phoneNumber;

    return lead[0];
  }
}
