import { Injectable } from '@nestjs/common';
const { getColorFromURL } = require('color-thief-node');
import { getDominantColor } from '../utils/utils';
import * as jimp from 'jimp';

@Injectable()
export class MediaUploadService {
  async getDominantColor(imageUrl) {
    return await getDominantColor(imageUrl);
  }

  async compressImageTo300(file) {
    const img = await jimp.read(file['path']);

    const height = img.bitmap.height;
    const width = img.bitmap.width;

    if ((height < 200 && width < 300) || file.size <= 300 * 1000) {
      return '';
    }
    const heightRatio = height / width;
    const widthRatio = width / height;
    file['path'] = file['path'].replace('compressed', `300`);
    img.resize(300 * widthRatio, jimp.AUTO).write(file['path']);
  }
}
