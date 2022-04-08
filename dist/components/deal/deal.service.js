"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const utils_1 = require("../file-management/utils/utils");
let DealService = class DealService {
    constructor(dealModel, categorymodel) {
        this.dealModel = dealModel;
        this.categorymodel = categorymodel;
    }
    async createDeal(dealDto) {
        try {
            const category = await this.categorymodel.findOne({
                type: dealDto.categoryType,
            });
            let stamp = new Date(dealDto.startDate).getTime();
            dealDto.startDate = stamp;
            stamp = new Date(dealDto.endDate).getTime();
            dealDto.endDate = stamp;
            dealDto.categoryName = dealDto.categoryType;
            dealDto.categoryType = category.id;
            dealDto.vouchers = dealDto.vouchers.map((el) => {
                let startTime;
                let endTime;
                let discountPercentage = ((el.originalPrice - el.dealPrice) / el.originalPrice) * 100;
                el.discountPercentage = discountPercentage;
                if (el.voucherValidity > 0) {
                    startTime = new Date(new Date()).getTime();
                    endTime = startTime + el.voucherValidity * 24 * 60 * 60 * 1000;
                }
                else {
                    startTime = new Date(el.voucherStartDate).getTime();
                    endTime = new Date(el.voucherEndDate).getTime();
                }
                el._id = (0, utils_1.generateStringId)();
                el.voucherStartDate = startTime;
                el.voucherEndDate = endTime;
                return el;
            });
            const deal = await this.dealModel.create(dealDto);
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllDeals() {
        try {
            const deals = await this.dealModel.find();
            return deals;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDeal(id) {
        try {
            const deals = await this.dealModel.findById(id);
            return deals;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDealByMerchant(id) {
        try {
            const deal = await this.dealModel.find({ merchantId: id });
            return deal;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
DealService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Deal')),
    __param(1, (0, mongoose_1.InjectModel)('Category')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DealService);
exports.DealService = DealService;
//# sourceMappingURL=deal.service.js.map