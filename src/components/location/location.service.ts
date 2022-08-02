import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from 'src/interface/location/location.interface';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location') private _locationModel: Model<Location>,
  ) {}

  async createLocation(locationDto) {
    let coordinates = [33.5705073, 73.1434092];
    const locationObj = {
      ...locationDto,
      location: {
        coordinates: coordinates,
      },
    };

    return await new this._locationModel(locationObj).save();
  }
}
