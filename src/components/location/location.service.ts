import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from 'src/interface/location/location.interface';
var OpenLocationCode = require('open-location-code').OpenLocationCode;
var openLocationCode = new OpenLocationCode();
const NodeGeocoder = require('node-geocoder');

@Injectable()
export class LocationService {
  geocoder;
  constructor(
    @InjectModel('Location') private _locationModel: Model<Location>,
  ) {
    const options = {
      provider: 'google',
      apiKey: process.env.geocodingApiKey,
      formatter: null, // 'gpx'
    };

    this.geocoder = NodeGeocoder(options);
  }

  async createLocation(locationDto) {
    try {
      const res = await this.geocoder.geocode(
        `${locationDto.streetAddress},${locationDto.city}`,
      );

      let coordinates = [res[0].longitude, res[0].latitude];
      const locationObj = {
        ...locationDto,
        location: {
          coordinates: coordinates,
        },
      };

      return await new this._locationModel(locationObj).save();
    } catch (err) {
      console.log(err + ' ..........');
    }
  }

  async updateLocation(locationDto, merchantID) {
    try {
      const location = await this._locationModel.updateOne(
        { merchantID: merchantID },
        { ...locationDto },
      );

      return { message: 'Location updated successfully!' };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
