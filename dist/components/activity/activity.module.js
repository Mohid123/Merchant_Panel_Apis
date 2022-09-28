"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const activity_schema_1 = require("../../schema/activity/activity.schema");
const activity_controller_1 = require("./activity.controller");
const activity_service_1 = require("./activity.service");
let ActivityModule = class ActivityModule {
};
ActivityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Activity', schema: activity_schema_1.ActivitySchema }]),
        ],
        controllers: [activity_controller_1.ActivityController],
        providers: [activity_service_1.ActivityService],
        exports: [activity_service_1.ActivityService],
    })
], ActivityModule);
exports.ActivityModule = ActivityModule;
//# sourceMappingURL=activity.module.js.map