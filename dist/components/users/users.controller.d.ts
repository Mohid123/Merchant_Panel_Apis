/// <reference types="mongoose" />
import { ResetPasswordDto } from 'src/dto/resetPasswordDto/resetPassword.dto';
import { ApproveMerchantDTO } from 'src/dto/user/approveMerchant.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatepassword.dto';
import { USERSTATUS } from 'src/enum/user/userstatus.enum';
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
    completeKYC(merchantID: string, kycDto: KycDto): Promise<{
        message: string;
    }>;
    updateMerchantprofile(merchantID: string, usersDto: UpdateMerchantProfileDto): Promise<{
        message: string;
    }>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    geUserById(id: string): Promise<any>;
    getUserStats(id: string): Promise<any>;
    getAllUsers(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, req: any): Promise<{
        message: string;
    }>;
    getPendingUsers(offset?: number, limit?: number): Promise<{
        totalPendingUsers: number;
        pendingUsers: any[];
    }>;
    approvePendingUsers(status: USERSTATUS, userID: string): Promise<{
        message: string;
    }>;
    validateVatNumber(vatNumber: string): Promise<any>;
    approveMerchant(id: string, approveMerchantDto: ApproveMerchantDTO): Promise<{
        _id: any;
        merchantID: any;
    }>;
}
