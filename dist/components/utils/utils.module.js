"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilModule = void 0;
const common_1 = require("@nestjs/common");
const utils_controller_1 = require("./utils.controller");
const utils_service_1 = require("./utils.service");
let UtilModule = class UtilModule {
};
UtilModule = __decorate([
    (0, common_1.Module)({
        controllers: [utils_controller_1.UtilController],
        providers: [utils_service_1.UtilService],
    })
], UtilModule);
exports.UtilModule = UtilModule;
//# sourceMappingURL=utils.module.js.map