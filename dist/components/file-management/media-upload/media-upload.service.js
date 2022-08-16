"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaUploadService = void 0;
const common_1 = require("@nestjs/common");
const { getColorFromURL } = require('color-thief-node');
const utils_1 = require("../utils/utils");
const jimp = require("jimp");
let MediaUploadService = class MediaUploadService {
    async getDominantColor(imageUrl) {
        return await (0, utils_1.getDominantColor)(imageUrl);
    }
    async compressImageTo300(file) {
        const img = await jimp.read(file['path']);
        const compressionSizes = [
            {
                height: 460,
                width: 764,
            },
            {
                height: 170,
                width: 281,
            },
            {
                height: 101,
                width: 168,
            },
            {
                height: 114,
                width: 142,
            },
        ];
        const height = img.bitmap.height;
        const width = img.bitmap.width;
        compressionSizes.forEach((el) => {
            if ((height > el.height && width > el.width) ||
                file.size >= el.width * 1000) {
                const heightRatio = height / width;
                const widthRatio = width / height;
                file['path'] = file['path'].replace(`compressed`, `${el.width}`);
                img.resize(el.width * widthRatio, jimp.AUTO).write(file['path']);
                file['path'] = file['path'].replace(`${el.width}`, `compressed`);
            }
        });
    }
};
MediaUploadService = __decorate([
    (0, common_1.Injectable)()
], MediaUploadService);
exports.MediaUploadService = MediaUploadService;
//# sourceMappingURL=media-upload.service.js.map