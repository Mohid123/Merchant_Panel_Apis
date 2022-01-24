import * as blurhash from 'blurhash';
import { createCanvas, loadImage, Image } from 'canvas';
import { Types } from 'mongoose';
const { getColorFromURL } = require('color-thief-node');

const getImageData = (image: Image) => {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

export const encodeImageToBlurhash = async (url) => {
  const isValid = isValidURL(url);
  if (!isValid) {
    return '';
  }

  url = url + '?size=compressed';
  const image = await loadImage(url);
  const imageData = getImageData(image);
  return blurhash.encode(
    imageData.data,
    imageData.width,
    imageData.height,
    4,
    4,
  );
};

export const getDominantColor = async (imageUrl) => {
  const dominantColor = await getColorFromURL(imageUrl);
  const [r, g, b] = dominantColor;
  return { hexCode: rgb_to_hex(r, g, b) };
};

const rgb_to_hex = (red, green, blue) => {
  const rgb = (red << 16) | (green << 8) | (blue << 0);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
};

export const insertAt = (array, index, elements) => {
  array.splice(index, 0, elements);
};

export const isValidURL = (urlString) => {
  try {
    const url = new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
};

export const generateStringId = () => {
  return new Types.ObjectId().toHexString();
};
