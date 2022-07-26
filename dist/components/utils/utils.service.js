"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const categories_1 = require("./categories");
const fs = require('fs');
const city_1 = require("./city");
let UtilService = class UtilService {
    async getCity(zipCode) {
        let obj = [];
        let city = '';
        const data = city_1.cityDataset;
        const cityData = data.filter((element) => element.zip == zipCode);
        return cityData;
    }
    async getAllCategoriesAndSubCategories() {
        const data = categories_1.categoriesDataSet;
        return data;
    }
    async validateVatNumber(vatNumber) {
        try {
            const res = await axios_1.default.get(`https://vatcheckapi.com/api/validate/${vatNumber}?apikey=${process.env.VATCHECKAPIKEY}`, {
                headers: {
                    "apikey": process.env.VATCHECKAPIKEY
                }
            });
            console.log(res.data);
            return res.data;
        }
        catch (err) {
            console.log(err === null || err === void 0 ? void 0 : err.message);
            throw new common_1.BadRequestException(err === null || err === void 0 ? void 0 : err.message);
        }
    }
};
UtilService = __decorate([
    (0, common_1.Injectable)()
], UtilService);
exports.UtilService = UtilService;
//# sourceMappingURL=utils.service.js.map