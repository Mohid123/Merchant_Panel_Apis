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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const utils_1 = require("../file-management/utils/utils");
let BlogService = class BlogService {
    constructor(_blogModel) {
        this._blogModel = _blogModel;
    }
    async createBlog(blogDto) {
        var e_1, _a;
        try {
            if (blogDto.media && blogDto.media.length) {
                blogDto['type'] = blogDto.media[0].type;
                blogDto['captureFileURL'] = blogDto.media[0].captureFileURL;
                blogDto['path'] = blogDto.media[0].path;
                if (blogDto['type'] == 'Video') {
                    blogDto['thumbnailURL'] = blogDto.media[0].thumbnailURL;
                    blogDto['thumbnailPath'] = blogDto.media[0].thumbnailPath;
                }
                try {
                    for (var _b = __asyncValues(blogDto.media), _c; _c = await _b.next(), !_c.done;) {
                        let mediaObj = _c.value;
                        await new Promise(async (resolve, reject) => {
                            try {
                                let mediaUrl = '';
                                if (mediaObj.type == 'Video') {
                                    mediaUrl = mediaObj.thumbnailURL;
                                }
                                else {
                                    mediaUrl = mediaObj.captureFileURL;
                                }
                                mediaObj['blurHash'] = await (0, utils_1.encodeImageToBlurhash)(mediaUrl);
                                if (!mediaObj.backgroundColorHex) {
                                    const data = await (0, utils_1.getDominantColor)(mediaObj.captureFileURL);
                                    mediaObj['backgroundColorHex'] = data.hexCode;
                                }
                                resolve({});
                            }
                            catch (err) {
                                console.log("Error", err);
                                reject(err);
                            }
                        });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return await new this._blogModel(blogDto).save();
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateBlog(id, updateBlogDto) {
        var e_2, _a;
        try {
            let blog = await this._blogModel.findOne({ _id: id });
            if (!blog) {
                throw new common_1.HttpException('Blog not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            if (updateBlogDto.media && updateBlogDto.media.length) {
                updateBlogDto['type'] = updateBlogDto.media[0].type;
                updateBlogDto['captureFileURL'] = updateBlogDto.media[0].captureFileURL;
                updateBlogDto['path'] = updateBlogDto.media[0].path;
                if (updateBlogDto['type'] == 'Video') {
                    updateBlogDto['thumbnailURL'] = updateBlogDto.media[0].thumbnailURL;
                    updateBlogDto['thumbnailPath'] = updateBlogDto.media[0].thumbnailPath;
                }
                try {
                    for (var _b = __asyncValues(updateBlogDto.media), _c; _c = await _b.next(), !_c.done;) {
                        let mediaObj = _c.value;
                        await new Promise(async (resolve, reject) => {
                            try {
                                let mediaUrl = '';
                                if (mediaObj.type == 'Video') {
                                    mediaUrl = mediaObj.thumbnailURL;
                                }
                                else {
                                    mediaUrl = mediaObj.captureFileURL;
                                }
                                mediaObj['blurHash'] = await (0, utils_1.encodeImageToBlurhash)(mediaUrl);
                                if (!mediaObj.backgroundColorHex) {
                                    const data = await (0, utils_1.getDominantColor)(mediaObj.captureFileURL);
                                    mediaObj['backgroundColorHex'] = data.hexCode;
                                }
                                resolve({});
                            }
                            catch (err) {
                                console.log("Error", err);
                                reject(err);
                            }
                        });
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            await this._blogModel.updateOne({ _id: id }, updateBlogDto);
            return { message: 'Blog has been updated successfully' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteBlog(id) {
        try {
            let blog = await this._blogModel.updateOne({ _id: id }, { deletedCheck: true });
            if (!blog) {
                throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.BAD_REQUEST);
            }
            return { message: 'Blog has been deleted successfully' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getBlog(id) {
        try {
            let blog = await this._blogModel.findOne({ _id: id, deletedCheck: false });
            if (!blog) {
                throw new common_1.HttpException('Blog not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                return blog;
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllBlogs(offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let totalCount = await this._blogModel.countDocuments({ deletedCheck: false });
            let blogs = await this._blogModel.aggregate([
                {
                    $match: {
                        deletedCheck: false
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            return {
                totalCount: totalCount,
                data: blogs,
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
BlogService = __decorate([
    __param(0, (0, mongoose_1.InjectModel)('blog')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogService);
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map