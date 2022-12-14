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
const userrole_enum_1 = require("../../enum/user/userrole.enum");
const userstatus_enum_1 = require("../../enum/user/userstatus.enum");
let LeadsService = class LeadsService {
    constructor(_leadModel, _userModel) {
        this._leadModel = _leadModel;
        this._userModel = _userModel;
    }
    async createLead(leadDto) {
        var _a;
        leadDto.email = (_a = leadDto === null || leadDto === void 0 ? void 0 : leadDto.email) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const user = await this._userModel.findOne({
            email: leadDto.email,
            role: userrole_enum_1.USERROLE.customer,
            status: userstatus_enum_1.USERSTATUS.approved,
        });
        if (user) {
            let leadData = await this._leadModel.findOne({
                email: leadDto.email,
                deletedCheck: false,
            });
            if (leadData) {
                throw new common_1.ForbiddenException('Email already exists');
            }
            leadDto._id = user._id;
            leadDto.tradeName = leadDto.companyName;
            leadDto.status = userstatus_enum_1.USERSTATUS.new;
            leadDto.role = userrole_enum_1.USERROLE.merchant;
            leadDto.countryCode = 'BE';
            leadDto.leadSource = 'web';
            const lead = await new this._leadModel(leadDto).save();
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createleadinzoho/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&enquiryid=${lead.id}`);
            return lead;
        }
        else {
            let leadData = await this._leadModel.findOne({
                email: leadDto.email,
                deletedCheck: false,
            });
            if (leadData) {
                throw new common_1.ForbiddenException('Email already exists');
            }
            leadDto.id = new mongoose_2.Types.ObjectId().toHexString();
            leadDto.tradeName = leadDto.companyName;
            leadDto.status = userstatus_enum_1.USERSTATUS.new;
            leadDto.role = userrole_enum_1.USERROLE.merchant;
            leadDto.countryCode = 'BE';
            leadDto.leadSource = 'web';
            const lead = await new this._leadModel(leadDto).save();
            const res = await axios_1.default.get(`https://www.zohoapis.eu/crm/v2/functions/createleadinzoho/actions/execute?auth_type=apikey&zapikey=1003.1477a209851dd22ebe19aa147012619a.4009ea1f2c8044d36137bf22c22235d2&enquiryid=${lead.id}`);
            return lead;
        }
    }
    async getLead(id) {
        const lead = await this._leadModel.aggregate([
            {
                $match: {
                    _id: id,
                    deletedCheck: false,
                },
            },
            {
                $addFields: {
                    companyName: '$legalName',
                    categoryType: '$businessType',
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
                    countryCode: 1,
                    leadSource: 1,
                    platformPercentage: 1,
                },
            },
        ]);
        if (lead.length == 0) {
            throw new common_1.HttpException('No Record Found!', common_1.HttpStatus.BAD_REQUEST);
        }
        return lead[0];
    }
};
LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Lead')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], LeadsService);
exports.LeadsService = LeadsService;
//# sourceMappingURL=leads.service.js.map