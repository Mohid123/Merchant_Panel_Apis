import { Injectable } from '@nestjs/common';
const fs = require('fs');

@Injectable()
export class UtilService {
  async getCity(zipCode) {
    let obj = [];
    let city = '';
    const data = await fs.promises.readFile(
      '../DIVIDEALS_API/src/components/utils/city.json',
      'utf8',
    );
    obj = JSON.parse(data);
    const cityData = obj.find((element) => element.zip == zipCode);

    return cityData;
  }
}
