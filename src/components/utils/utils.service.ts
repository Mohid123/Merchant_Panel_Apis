import { Injectable } from '@nestjs/common';
const fs = require('fs');
import {cityDataset} from './city'
@Injectable()
export class UtilService {
  async getCity(zipCode) {
    let obj = [];
    let city = '';
    const data = cityDataset;
    const cityData = data.find((element) => element.zip == zipCode);

    return cityData;
  }
}
