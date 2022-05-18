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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const email_dto_1 = require("../../dto/email/email.dto");
const otpEmail_dto_1 = require("../../dto/otp/otpEmail.dto");
const login_dto_1 = require("../../dto/user/login.dto");
const signup_dto_1 = require("../../dto/user/signup.dto");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(_authService) {
        this._authService = _authService;
    }
    loginToken(email, password) {
        if (email == 'test@gmail.com' && password == 'test@123') {
            return this._authService.loginToken();
        }
        else {
            return new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
    }
    login(loginDto) {
        return this._authService.login(loginDto);
    }
    signup(signupDto) {
        return this._authService.signup(signupDto);
    }
    sendEmail(emailDto) {
        return this._authService.sendMail(emailDto);
    }
    isEmailExists(email) {
        return this._authService.isEmailExists(email);
    }
    sendOtp(emailDto) {
        return this._authService.sendOtp(emailDto);
    }
    verifyOtp(otp) {
        return this._authService.verifyOtp(otp);
    }
};
__decorate([
    (0, common_1.Get)('login/:email/:password'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginToken", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('sendEmail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.EmailDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)('/:isEmailExists'),
    __param(0, (0, common_1.Param)('isEmailExists')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "isEmailExists", null);
__decorate([
    (0, common_1.Post)('/sendOtp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otpEmail_dto_1.OtpEmailDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('/verifyOtp/:otp'),
    __param(0, (0, common_1.Param)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map