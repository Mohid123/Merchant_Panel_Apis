import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { categoriesDataSet } from './categories';
const fs = require('fs');
import { cityDataset } from './city';

@Injectable()
export class UtilService {
  async getCity(zipCode) {
    let obj = [];
    let city = '';
    const data = cityDataset;
    const cityData = data.filter((element) => element.zip == zipCode);

    return cityData;
  }

  async getAllCategoriesAndSubCategories() {
    const data = categoriesDataSet;
    return data;
  }

  async validateVatNumber(vatNumber) {
    try {
      const res = await axios.get(
        `https://api.vatcheckapi.com/v1/validate/${vatNumber}?apikey=${process.env.VATCHECKAPIKEY}&vat_id=32`,
        {
          headers: {
            apikey: process.env.VATCHECKAPIKEY,
          },
        },
      );

      console.log(res.data);
      if (res?.data?.success == 0) {
        throw new BadRequestException(res?.data?.error);
      }
      return res.data;
    } catch (err) {
      console.log(err?.message);
      throw new BadRequestException(err?.message);
    }
  }

  async searchCategory(searchCategory) {
    const data = categoriesDataSet;

    if (searchCategory) {
      searchCategory = searchCategory.trim();
      var query = new RegExp(`${searchCategory}`, 'i');

      const categoryData = data.filter((el) => query.test(el.category));
      // let subCategories = categoryData.map((a) => [a.category,...a.subCategories.map(item=>item)]);
      // let category = categoryData.map(a=> a.name);

      return categoryData;
    }
  }
}
