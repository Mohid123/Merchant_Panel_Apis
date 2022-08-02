import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogInterface } from 'src/interface/blog/blog.interface';
import { encodeImageToBlurhash, getDominantColor } from '../file-management/utils/utils';

export class BlogService {
    constructor(@InjectModel('blog') private readonly _blogModel: Model<BlogInterface>) {}

    async createBlog (blogDto) {
        try {

            if (blogDto.media && blogDto.media.length) {
                blogDto['type'] = blogDto.media[0].type;
                blogDto['captureFileURL'] = blogDto.media[0].captureFileURL;
                blogDto['path'] = blogDto.media[0].path;
                if(blogDto['type']=='Video'){
                    blogDto['thumbnailURL'] = blogDto.media[0].thumbnailURL;
                    blogDto['thumbnailPath'] = blogDto.media[0].thumbnailPath;
                }
                for await (let mediaObj of blogDto.media) {
          
                  await new Promise(async (resolve, reject) => {
                    try {
                      let mediaUrl = ''
                      if (mediaObj.type == 'Video') {
                        mediaUrl = mediaObj.thumbnailURL;
                      } else {
                        mediaUrl = mediaObj.captureFileURL;
                      }
          
                      mediaObj['blurHash'] = await encodeImageToBlurhash(mediaUrl);
                      if (!mediaObj.backgroundColorHex) {
                        const data = await getDominantColor(mediaObj.captureFileURL);
                        mediaObj['backgroundColorHex'] = data.hexCode;
                      }
                      resolve({})
                    } catch (err) {
                      console.log("Error", err);
                      reject(err)
                    }
                  })
          
                }
            }

            return await new this._blogModel(blogDto).save();
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async updateBlog (id, updateBlogDto) {
        try {
            let blog = await this._blogModel.findOne({_id: id});

            if (!blog) {
                throw new HttpException('Blog not found!', HttpStatus.BAD_REQUEST);
            }

            if (updateBlogDto.media && updateBlogDto.media.length) {
                updateBlogDto['type'] = updateBlogDto.media[0].type;
                updateBlogDto['captureFileURL'] = updateBlogDto.media[0].captureFileURL;
                updateBlogDto['path'] = updateBlogDto.media[0].path;
                if(updateBlogDto['type']=='Video'){
                    updateBlogDto['thumbnailURL'] = updateBlogDto.media[0].thumbnailURL;
                    updateBlogDto['thumbnailPath'] = updateBlogDto.media[0].thumbnailPath;
                }
                for await (let mediaObj of updateBlogDto.media) {
          
                  await new Promise(async (resolve, reject) => {
                    try {
                      let mediaUrl = ''
                      if (mediaObj.type == 'Video') {
                        mediaUrl = mediaObj.thumbnailURL;
                      } else {
                        mediaUrl = mediaObj.captureFileURL;
                      }
          
                      mediaObj['blurHash'] = await encodeImageToBlurhash(mediaUrl);
                      if (!mediaObj.backgroundColorHex) {
                        const data = await getDominantColor(mediaObj.captureFileURL);
                        mediaObj['backgroundColorHex'] = data.hexCode;
                      }
                      resolve({})
                    } catch (err) {
                      console.log("Error", err);
                      reject(err)
                    }
                  })
          
                }
            }

            await this._blogModel.updateOne({_id: id}, updateBlogDto);
            
            return { message: 'Blog has been updated successfully'};

        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteBlog (id) {
        try {
            let blog = await this._blogModel.updateOne({_id: id},{deletedCheck: true});

            if (!blog) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }

            return {message: 'Blog has been deleted successfully'};
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getBlog (id) {
        try {
            let blog = await this._blogModel.findOne({_id: id, deletedCheck: false});

            if (!blog) {
                throw new HttpException('Blog not found!', HttpStatus.BAD_REQUEST);
            } else {
                return blog;
            } 
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllBlogs (offset, limit) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            let totalCount = await this._blogModel.countDocuments({deletedCheck: false});

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
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
