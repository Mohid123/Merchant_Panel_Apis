import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { USERSTATUS } from '../../enum/user/userstatus.enum';
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

    async changePassword(id, updatepasswordDto){
        let user = await this._userModel.findOne({_id:id});
        if (!user) {
          throw new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED)
        };
  
        const comaprePasswords = bcrypt.compare(updatepasswordDto.password,user.password);

        const salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(updatepasswordDto.newPassword, salt);
  
        if (!comaprePasswords) {
          throw new UnauthorizedException('Incorrect password!');
        } else {
          return await this._userModel.updateOne({_id: id}, {password: hashedPassword, newUser: false});
        }
      }

    async completeKYC (merchantID, kycDto) {
        return await this._userModel.updateOne({_id: merchantID}, kycDto)
    }

    async updateMerchantprofile (usersDto) {
        // usersDto.profilePicBlurHash = await encodeImageToBlurhash(
        //     usersDto.profilePicURL
        //   );

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

    async getUserById (id) {
        return await this._userModel.aggregate([
            {
                $match: {
                    _id: id,
                    deletedCheck: false,
                    status: USERSTATUS.approved
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

    async getMerchantStats (id) {
        return await this._userModel.aggregate([
            {
                $match: {
                    _id: id,
                    deletedCheck: false,
                    status: USERSTATUS.approved
                }
            },
            {
                $addFields: {
                    id: '$_id'
                }
            },
            {
                $project: {
                    _id: 0,
                    email: 0,
                    password: 0,
                    firstName: 0,
                    lastName: 0,
                    phoneNumber: 0,
                    role: 0,
                    businessType: 0,
                    companyName: 0,
                    streetAddress: 0,
                    zipCode: 0,
                    city: 0,
                    vatNumber: 0,
                    iban: 0,
                    bankName: 0,
                    kycStatus: 0,
                    province: 0,
                    website_socialAppLink: 0,
                    googleMapPin: 0,
                    businessHours: 0,
                    businessProfile: 0,
                    generalTermsAgreements: 0,
                    profilePicURL: 0,
                    profilePicBlurHash: 0,
                    deletedCheck: 0,
                    status: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0
                }
            }
        ]).then(items=>items[0]);
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
