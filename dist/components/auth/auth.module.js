"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const lead_schema_1 = require("../../schema/lead/lead.schema");
const otp_schema_1 = require("../../schema/otp/otp.schema");
const vouchersCounter_schema_1 = require("../../schema/vouchers/vouchersCounter.schema");
const users_schema_1 = require("../../schema/user/users.schema");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./jwt.strategy");
let AuthModule = AuthModule_1 = class AuthModule {
    static forRoot() {
        return {
            imports: [
                jwt_1.JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '9999999999s' },
                }),
                mongoose_1.MongooseModule.forFeature([
                    { name: 'User', schema: users_schema_1.UsersSchema },
                    { name: 'OTP', schema: otp_schema_1.OtpSchema },
                    { name: 'Counter', schema: vouchersCounter_schema_1.VoucherCounterSchema },
                    { name: 'Lead', schema: lead_schema_1.LeadSchema },
                ]),
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
            module: AuthModule_1,
        };
    }
};
AuthModule = AuthModule_1 = __decorate([
    (0, common_1.Module)({})
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map