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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("axios");
const mongoose_2 = require("mongoose");
const utils_1 = require("../file-management/utils/utils");
let LeadsService = class LeadsService {
    constructor(_leadModel) {
        this._leadModel = _leadModel;
    }
    async createLead(leadDto) {
        var _a;
        leadDto.email = (_a = leadDto === null || leadDto === void 0 ? void 0 : leadDto.email) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        let user = await this._leadModel.findOne({
            email: leadDto.email,
        });
        if (user) {
            throw new common_1.ForbiddenException('Email already exists');
        }
        leadDto.tradeName = leadDto.companyName;
        const lead = await new this._leadModel(leadDto).save();
        const res = await axios_1.default.get(`https://sandbox.zohoapis.eu/crm/v2/functions/createleadinzoho/actions/execute?auth_type=apikey&zapikey=1003.527925363aa0ee3a8c9cf0be2f92f93a.5464e31887b65bfe3e373beb87462db7&enquiryid=${lead.id}`);
        return lead;
    }
    async getLead(id) {
        const lead = await this._leadModel.aggregate([
            {
                $match: {
                    _id: id,
                },
            },
            {
                $addFields: {
                    companyName: '$tradeName',
                },
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    phoneNumber: 1,
                    role: 1,
                    status: 1,
                    categoryType: 1,
                    companyName: 1,
                    streetAddress: 1,
                    zipCode: 1,
                    city: 1,
                    vatNumber: 1,
                    province: 1,
                    website_socialAppLink: 1,
                    googleMapPin: 1,
                },
            },
        ]);
        if (lead.length == 0) {
            throw new common_1.HttpException('No Record Found!', common_1.HttpStatus.BAD_REQUEST);
        }
        let _locationId = (0, utils_1.generateStringId)();
        lead[0].locations = [
            {
                _id: _locationId,
                locationName: '',
                streetAddress: lead[0].streetAddress,
                zipCode: lead[0].zipCode.toString(),
                city: lead[0].city,
                googleMapPin: lead[0].googleMapPin,
                province: lead[0].province,
                phoneNumber: lead[0].phoneNumber,
            },
        ];
        delete lead[0].streetAddress;
        delete lead[0].zipCode;
        delete lead[0].city;
        delete lead[0].googleMapPin;
        delete lead[0].province;
        delete lead[0].phoneNumber;
        return lead[0];
    }
};
LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Lead')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LeadsService);
exports.LeadsService = LeadsService;
//# sourceMappingURL=leads.service.js.map