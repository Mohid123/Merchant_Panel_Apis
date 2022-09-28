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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ActivityService = class ActivityService {
    constructor(activityModel) {
        this.activityModel = activityModel;
    }
    async createActivity(activityDto) {
        try {
            const activity = await new this.activityModel(activityDto).save();
            if (!activity) {
                throw new common_1.HttpException('Unable to create document', common_1.HttpStatus.BAD_REQUEST);
            }
            return activity;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActivity(id) {
        try {
            const activity = await this.activityModel.findById(id);
            if (!activity) {
                throw new common_1.HttpException('No Activity Found', common_1.HttpStatus.NOT_FOUND);
            }
            return activity;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllActivities(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalActivities = await this.activityModel.countDocuments();
            let activities = await this.activityModel
                .aggregate([
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $addFields: {
                        id: '$_id',
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalActivities,
                data: activities,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActivitiesByMerchant(req, offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            const totalActivities = await this.activityModel.countDocuments({
                merchantMongoID: req.user.id,
            });
            let activities = await this.activityModel
                .aggregate([
                {
                    $match: {
                        merchantMongoID: req.user.id,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $addFields: {
                        id: '$_id',
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalActivities,
                data: activities,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Activity')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ActivityService);
exports.ActivityService = ActivityService;
//# sourceMappingURL=activity.service.js.map