import { Model } from 'mongoose';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { UsersInterface } from '../../interface/user/users.interface';
import { EmailDTO } from 'src/dto/email/email.dto';
import { VoucherCounterInterface } from 'src/interface/vouchers/vouchersCounter.interface';
export declare class UsersService {
    private readonly _userModel;
    private readonly voucherCounterModel;
    constructor(_userModel: Model<UsersInterface>, voucherCounterModel: Model<VoucherCounterInterface>);
    onModuleInit(): void;
    generateMerchantId(sequenceName: any): Promise<string>;
    addUser(usersDto: any): Promise<import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
        _id: string;
    }>;
    changePassword(id: any, updatepasswordDto: any): Promise<import("mongodb").UpdateResult>;
    validateVatNumber(vatNumber: any): Promise<any>;
    completeKYC(merchantID: any, kycDto: any): Promise<{
        message: string;
    }>;
    updateMerchantprofile(merchantID: any, usersDto: any): Promise<{
        message: string;
    }>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: any): Promise<import("mongodb").UpdateResult>;
    getUserById(id: any): Promise<any>;
    getMerchantStats(id: any): Promise<any>;
    getAllUsers(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    resetPassword(resetPasswordDto: any, req: any): Promise<{
        message: string;
    }>;
    getPendingUsers(offset: any, limit: any): Promise<{
        totalPendingUsers: number;
        pendingUsers: any[];
    }>;
    private generatePassword;
    sendMail(emailDto: EmailDTO): Promise<void>;
    approvePendingUsers(status: any, userID: any): Promise<{
        message: string;
    }>;
    approveMerchant(userID: any, approveMerchantDto: any): Promise<{
        message: string;
    }>;
}
