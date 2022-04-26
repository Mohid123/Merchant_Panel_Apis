import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateHoursDto } from 'src/dto/user/updatehours.dto';
import { UsersInterface } from '../../interface/user/users.interface';
import { encodeImageToBlurhash } from '../file-management/utils/utils';

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

    async completeKYC (kycDto) {
        return await this._userModel.updateOne({_id: kycDto.id}, kycDto)
    }

    async updateUser (usersDto) {
        usersDto.profilePicBlurHash = await encodeImageToBlurhash(
            usersDto.profilePicURL
          );

        return this._userModel.updateOne({_id: usersDto.id}, usersDto);
    }

    async updateBusinessHours (updateHoursDTO:UpdateHoursDto) {

        let user = await this._userModel.findOne({_id: updateHoursDTO.id});

        const newBusinessHours = user.businessHours.map((hour)=>{
            if(updateHoursDTO?.businessHours?.findIndex(data=>data.day==hour.day)>=0){
                return updateHoursDTO?.businessHours[updateHoursDTO?.businessHours?.findIndex(data=>data.day==hour.day)];
            }else{
                return hour;
            }
        });

        return await this._userModel.updateOne({_id:updateHoursDTO.id},{businessHours: newBusinessHours});
        
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
