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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const FileLogger_logger_1 = require("../logger/FileLogger.logger");
let LoggingInterceptor = class LoggingInterceptor {
    constructor() {
        this.logger = new FileLogger_logger_1.FileLogger();
    }
    intercept(context, next) {
        console.log('**********************************************************************');
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const ip = request.ip;
        const url = request.originalUrl;
        console.log('method', method);
        console.log('url', url);
        console.log('ip', ip);
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            console.log(`After... ${Date.now() - now}ms | Date:${new Date()}`);
            console.log('**********************************************************************');
        }), (0, operators_1.catchError)(response => {
            console.log(response);
            console.log('Logging into file');
            let message = '';
            message += '**********************************************************************\n';
            message += `Date ${new Date()}\n`;
            message += `method ${method}\n`;
            message += `url ${url}\n`;
            message += `ip ${ip}\n`;
            message += response;
            message += '\n';
            message += '**********************************************************************\n';
            console.log();
            this.logger.log(message);
            return (0, rxjs_1.throwError)(response);
        }));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map