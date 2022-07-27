import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { categoriesDataSet } from './categories';
const fs = require('fs');
import {cityDataset} from './city';

@Injectable()
export class UtilService {
  async getCity(zipCode) {
    let obj = [];
    let city = '';
    const data = cityDataset;
    const cityData = data.filter((element) => element.zip == zipCode);

    return cityData;
  }

  async getAllCategoriesAndSubCategories () {
    const data = categoriesDataSet;
    return data;
  }

  async validateVatNumber (vatNumber) {
    try{
      const res = await axios.get(`https://vatcheckapi.com/api/validate/${vatNumber}?apikey=${process.env.VATCHECKAPIKEY}`,{
        headers:{
          "apikey": process.env.VATCHECKAPIKEY
        }
      });
  
      console.log(res.data);
      if(res?.data?.success == 0) {
        throw new BadRequestException(res?.data?.error);
      }
      return res.data;
    }catch(err){
      console.log(err?.message);
      throw new BadRequestException(err?.message);
    }
  }
}
