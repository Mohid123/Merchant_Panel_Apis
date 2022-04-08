"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStringId = exports.isValidURL = exports.insertAt = exports.getDominantColor = exports.encodeImageToBlurhash = void 0;
const blurhash = require("blurhash");
const canvas_1 = require("canvas");
const mongoose_1 = require("mongoose");
const { getColorFromURL } = require('color-thief-node');
const getImageData = (image) => {
    const canvas = (0, canvas_1.createCanvas)(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
};
const encodeImageToBlurhash = async (url) => {
    const isValid = (0, exports.isValidURL)(url);
    if (!isValid) {
        return '';
    }
    url = url + '?size=compressed';
    const image = await (0, canvas_1.loadImage)(url);
    const imageData = getImageData(image);
    return blurhash.encode(imageData.data, imageData.width, imageData.height, 4, 4);
};
exports.encodeImageToBlurhash = encodeImageToBlurhash;
const getDominantColor = async (imageUrl) => {
    const dominantColor = await getColorFromURL(imageUrl);
    const [r, g, b] = dominantColor;
    return { hexCode: rgb_to_hex(r, g, b) };
};
exports.getDominantColor = getDominantColor;
const rgb_to_hex = (red, green, blue) => {
    const rgb = (red << 16) | (green << 8) | (blue << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
};
const insertAt = (array, index, elements) => {
    array.splice(index, 0, elements);
};
exports.insertAt = insertAt;
const isValidURL = (urlString) => {
    try {
        const url = new URL(urlString);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.isValidURL = isValidURL;
const generateStringId = () => {
    return new mongoose_1.Types.ObjectId().toHexString();
};
exports.generateStringId = generateStringId;
//# sourceMappingURL=utils.js.map