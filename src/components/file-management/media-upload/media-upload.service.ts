import { Injectable } from '@nestjs/common';
const { getColorFromURL } = require('color-thief-node');
import { getDominantColor } from '../utils/utils';
import * as jimp from 'jimp';

@Injectable()
export class MediaUploadService {
  async getDominantColor(imageUrl) {
    return await getDominantColor(imageUrl);
  }

  async compressImageTo300(file,folder='compressed/') {
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

    // if ((height < 200 && width < 300) || file.size <= 300 * 1000) {
    //   return '';
    // }

    compressionSizes.forEach((el) => {
      if (
        (height > el.height && width > el.width) ||
        file.size >= el.width * 1000
      ) {
        const heightRatio = height / width;
        const widthRatio = width / height;
        file['path'] = file['path'].replace(`${folder}${file['filename']}`, `${el.width}/${file['filename']}`);
        img.resize(el.width * widthRatio, jimp.AUTO).write(file['path']);
        file['path'] = file['path'].replace(`${el.width}/${file['filename']}`, `${folder}${file['filename']}`);
      }
    });

    // const heightRatio = height / width;
    // const widthRatio = width / height;
    // file['path'] = file['path'].replace(`compressed`, `300`);
    // img.resize(300 * widthRatio, jimp.AUTO).write(file['path']);
  }
}
