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
exports.MediaUploadController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const multer_1 = require("multer");
const path = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
const jimp = require('jimp');
const url_dto_1 = require("../dto/url.dto");
const utils_1 = require("../utils/utils");
const media_upload_service_1 = require("./media-upload.service");
const fileFilter = (req, file, callback) => {
    let ext = path.extname(file.originalname);
    console.log(ext);
    console.log(process.env.whiteListedExtensions);
    if (!process.env.whiteListedExtensions.includes(ext.toLowerCase())) {
        req.fileValidationError = 'Invalid file type';
        return callback(new common_1.HttpException('Invalid file type', common_1.HttpStatus.BAD_REQUEST), false);
    }
    return callback(null, true);
};
let MediaUploadController = class MediaUploadController {
    constructor(_mediaUploadService) {
        this._mediaUploadService = _mediaUploadService;
    }
    async uploadAvatar(file, folderName, req) {
        req.setTimeout(10 * 60 * 1000);
        file['url'] =
            process.env.URL +
                'media-upload/mediaFiles/' +
                folderName.toLowerCase() +
                '/' +
                file.filename;
        console.log('***************+++++++++++++++++++++++***************');
        console.log({ file });
        console.log('***************+++++++++++++++++++++++***************');
        let type = '';
        const nameSplit = file['filename'].split('.');
        if (nameSplit.length > 1) {
            type = nameSplit[1];
        }
        const allowTypes = ['.jpg', '.jpeg', '.png'];
        if (type && allowTypes.includes(`.${type}`)) {
            const img = await jimp.read(file['path']);
            const height = img.bitmap.height;
            const width = img.bitmap.width;
            this._mediaUploadService.compressImageTo300(file);
            if ((height < 500 && width < 275) || file.size <= 500 * 1000) {
                return file;
            }
            const heightRatio = height / width;
            const widthRatio = width / height;
            console.log({ height });
            console.log({ width });
            console.log({ heightRatio });
            console.log({ widthRatio });
            file['path'] = file['path'].replace(file['filename'], `compressed/${file['filename']}`);
            img.resize(500 * widthRatio, jimp.AUTO).write(file['path']);
        }
        console.log('***************====================***************');
        console.log(file);
        console.log('***************====================***************');
        return file;
    }
    async mediaFiles(folderName, fileName, res, req, size = 'original') {
        req.setTimeout(10 * 60 * 1000);
        const sizeArray = ['original', 'compressed'];
        size = sizeArray.includes(size) ? size : 'original';
        folderName = folderName.toLowerCase();
        if (size == 'original') {
            res.sendFile(fileName, {
                root: 'mediaFiles/NFT/' + folderName,
            });
        }
        else {
            const dir = 'mediaFiles/NFT/' + folderName + '/' + size + '/' + fileName;
            const exists = fs.existsSync(dir);
            if (!exists) {
                res.sendFile(fileName, {
                    root: 'mediaFiles/NFT/' + folderName,
                });
                return;
            }
            res.sendFile(fileName, {
                root: 'mediaFiles/NFT/' + folderName + '/' + size,
            });
        }
    }
    async getBlurhash(urlBody, req) {
        try {
            req.setTimeout(10 * 60 * 1000);
            const blurHash = await (0, utils_1.encodeImageToBlurhash)(urlBody.url);
            return { blurHash };
        }
        catch (error) {
            return { error, message: 'Bad Input' };
        }
    }
    getDominantColor(urlBody, req) {
        req.setTimeout(10 * 60 * 1000);
        return this._mediaUploadService.getDominantColor(urlBody.url);
    }
};
__decorate([
    (0, common_1.Post)('mediaFiles/:folderName'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: fileFilter,
        storage: (0, multer_1.diskStorage)({
            destination: function (req, file, cb) {
                const dir = 'mediaFiles/NFT/' + req.params.folderName.toLowerCase();
                fs.exists(dir, (exist) => {
                    if (!exist) {
                        return fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
                    }
                    return cb(null, dir);
                });
            },
            filename: (req, file, cb) => {
                console.log({ file });
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('folderName')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MediaUploadController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('mediaFiles/:folderName/:fileName'),
    __param(0, (0, common_1.Param)('folderName')),
    __param(1, (0, common_1.Param)('fileName')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], MediaUploadController.prototype, "mediaFiles", null);
__decorate([
    (0, common_1.Post)('getBlurhash'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [url_dto_1.URLBody, Object]),
    __metadata("design:returntype", Promise)
], MediaUploadController.prototype, "getBlurhash", null);
__decorate([
    (0, common_1.Post)('getDominantColor'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [url_dto_1.URLBody, Object]),
    __metadata("design:returntype", void 0)
], MediaUploadController.prototype, "getDominantColor", null);
MediaUploadController = __decorate([
    (0, swagger_1.ApiTags)('media-upload'),
    (0, common_1.Controller)('media-upload'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [media_upload_service_1.MediaUploadService])
], MediaUploadController);
exports.MediaUploadController = MediaUploadController;
//# sourceMappingURL=media-upload.controller.js.map