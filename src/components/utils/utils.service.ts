import { Injectable } from '@nestjs/common';
import axios from 'axios';
const fs = require('fs');
import {cityDataset} from './city'
@Injectable()
export class UtilService {
  async getCity(zipCode) {
    let obj = [];
    let city = '';
    const data = cityDataset;
    const cityData = data.filter((element) => element.zip == zipCode);

    return cityData;
  }

  async validateVatNumber (vatNumber) {
    const res = await axios.get(`https://vatcheckapi.com/api/validate/${vatNumber}?apikey=${process.env.VATCHECKAPIKEY}`,{
      headers:{
        "apikey": process.env.VATCHECKAPIKEY
      }
    });

    console.log(res.data);
    return res.data;
  }
}
