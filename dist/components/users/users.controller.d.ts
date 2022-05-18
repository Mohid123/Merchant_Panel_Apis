/// <reference types="mongoose" />
import { ResetPasswordDto } from 'src/dto/resetPasswordDto/resetPassword.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatepassword.dto';
import { KycDto } from '../../dto/user/kyc.dto';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { UpdateMerchantProfileDto } from '../../dto/user/updatemerchantprofile.dto';
import { UsersDto } from '../../dto/user/users.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly _usersService;
    constructor(_usersService: UsersService);
    addUser(usersDto: UsersDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/user/users.interface").UsersInterface> & import("../../interface/user/users.interface").UsersInterface & {
        _id: string;
    }>;
    changePassword(id: string, updatepasswordDto: UpdatePasswordDto): Promise<import("mongodb").UpdateResult>;
    completeKYC(merchantID: string, kycDto: KycDto): Promise<import("mongodb").UpdateResult>;
    updateMerchantprofile(usersDto: UpdateMerchantProfileDto): Promise<import("mongodb").UpdateResult>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: string): Promise<import("mongodb").UpdateResult>;
    geUserById(id: string): Promise<any>;
    getUserStats(id: string): Promise<any>;
    getAllUsers(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, req: any): Promise<{
        message: string;
    }>;
}
