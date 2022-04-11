import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersInterface } from 'src/interface/user/users.interface';
import { encodeImageToBlurhash, generateStringId } from '../file-management/utils/utils';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly _userModel: Model<UsersInterface>) {}

    async addUser (usersDto) {
        usersDto.profilePicBlurHash = await encodeImageToBlurhash(
            usersDto.profilePicURL
          );

        const user = new this._userModel(usersDto).save();

        return user;
    }

    async updateUser (usersDto) {
        usersDto.profilePicBlurHash = await encodeImageToBlurhash(
            usersDto.profilePicURL
          );

        return this._userModel.updateOne({_id: usersDto.id}, usersDto);
    }

    async deleteUser (id) {
        return this._userModel.updateOne({_id: id} , {deletedCheck: true});
    }

    async geUserById (id) {
        return await this._userModel.aggregate([
            {
                $match: {
                    _id: id,
                    deletedCheck: false
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
        ]);
    }

    async getAllUsers (offset, limit) {
        offset = parseInt(offset) < 0 ? 0 : offset;
        limit = parseInt(limit) < 1 ? 10 : limit;

        const totalCount = await this._userModel.countDocuments({deletedCheck: false});

        const users = await this._userModel.aggregate([
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
            data: users
        };
    }
}
