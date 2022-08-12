import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from 'src/interface/location/location.interface';
var OpenLocationCode = require('open-location-code').OpenLocationCode;
var openLocationCode = new OpenLocationCode();

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location') private _locationModel: Model<Location>,
  ) {}

  async createLocation(locationDto) {
    const coord = await openLocationCode.decode(locationDto.plusCode);

    let coordinates = [coord.longitudeCenter, coord.latitudeCenter];
    const locationObj = {
      ...locationDto,
      location: {
        coordinates: coordinates,
      },
    };

    return await new this._locationModel(locationObj).save();
  }

  async updateLocation(locationDto, merchantID) {
    try {
      const location = await this._locationModel.updateOne(
        merchantID,
        locationDto,
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
