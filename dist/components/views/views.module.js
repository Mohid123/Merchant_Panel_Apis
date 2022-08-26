"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const deal_schema_1 = require("../../schema/deal/deal.schema");
const users_schema_1 = require("../../schema/user/users.schema");
const views_schema_1 = require("../../schema/views/views.schema");
const views_controller_1 = require("./views.controller");
const views_service_1 = require("./views.service");
let ViewsModule = class ViewsModule {
};
ViewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'views', schema: views_schema_1.ViewsSchema },
                { name: 'Deal', schema: deal_schema_1.DealSchema },
                { name: 'User', schema: users_schema_1.UsersSchema }
            ]),
        ],
        controllers: [views_controller_1.ViewsController],
        providers: [views_service_1.ViewsService],
    })
], ViewsModule);
exports.ViewsModule = ViewsModule;
//# sourceMappingURL=views.module.js.map