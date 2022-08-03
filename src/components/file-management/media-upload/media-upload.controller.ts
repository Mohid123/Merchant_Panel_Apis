import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  Body,
  Req,
} from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiTags, ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';
// import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
const jimp = require('jimp');
import { URLBody } from '../dto/url.dto';
import { encodeImageToBlurhash } from '../utils/utils';
import { MediaUploadService } from './media-upload.service';

const fileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);
  console.log(ext);
  console.log(process.env.whiteListedExtensions);
  if (!process.env.whiteListedExtensions.includes(ext.toLowerCase())) {
    req.fileValidationError = 'Invalid file type';
    return callback(
      new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  return callback(null, true);
};

@ApiTags('media-upload')
@Controller('media-upload')
@ApiBearerAuth()
export class MediaUploadController {
  constructor(private _mediaUploadService: MediaUploadService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('mediaFiles/:folderName')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: function (req, file, cb) {
          const dir = 'mediaFiles/Divideals/' + req.params.folderName.toLowerCase();

          fs.exists(dir, (exist) => {
            if (!exist) {
              return fs.mkdir(dir, { recursive: true }, (error) =>
                cb(error, dir),
              );
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

          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file,
    @Param('folderName') folderName: string,
    @Req() req,
  ) {
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

      file['path'] = file['path'].replace(
        file['filename'],
        `compressed/${file['filename']}`,
      );

      img.resize(500 * widthRatio, jimp.AUTO).write(file['path']);
    }
    console.log('***************====================***************');
    console.log(file);
    console.log('***************====================***************');
    return file;
  }

  @Get('mediaFiles/:folderName/:fileName')
  async mediaFiles(
    @Param('folderName') folderName: string,
    @Param('fileName') fileName: string,
    @Res() res,
    @Req() req,
    @Query('size') size: string = 'original',
  ): Promise<any> {
    req.setTimeout(10 * 60 * 1000);
    const sizeArray = ['original', 'compressed'];
    size = sizeArray.includes(size) ? size : 'original';
    folderName = folderName.toLowerCase();
    if (size == 'original') {
      res.sendFile(fileName, {
        root: 'mediaFiles/NFT/' + folderName,
      });
    } else {
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

  @Post('getBlurhash')
  async getBlurhash(@Body() urlBody: URLBody, @Req() req) {
    try {
      req.setTimeout(10 * 60 * 1000);
      const blurHash = await encodeImageToBlurhash(urlBody.url);
      return { blurHash };
    } catch (error) {
      return { error, message: 'Bad Input' };
    }
  }

  @Post('getDominantColor')
  getDominantColor(@Body() urlBody: URLBody, @Req() req) {
    req.setTimeout(10 * 60 * 1000);
    return this._mediaUploadService.getDominantColor(urlBody.url);
  }
}
