import { Model } from 'mongoose';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { UsersInterface } from '../../interface/user/users.interface';
import { EmailDTO } from 'src/dto/email/email.dto';
import { VoucherCounterInterface } from 'src/interface/vouchers/vouchersCounter.interface';
import { Location } from 'src/interface/location/location.interface';
import { LeadInterface } from 'src/interface/lead/lead.interface';
export declare class UsersService {
    private readonly _userModel;
    private readonly _locationModel;
    private readonly voucherCounterModel;
    private readonly _leadModel;
    constructor(_userModel: Model<UsersInterface>, _locationModel: Model<Location>, voucherCounterModel: Model<VoucherCounterInterface>, _leadModel: Model<LeadInterface>);
    onModuleInit(): void;
    generateMerchantId(sequenceName: any): Promise<string>;
    generateAffiliateId(sequenceName: any): Promise<string>;
    addUser(usersDto: any): Promise<import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
        _id: string;
    }>;
    comparePassword(userID: any, isPasswordExistsDto: any): Promise<boolean>;
    changePassword(id: any, updatepasswordDto: any): Promise<import("mongodb").UpdateResult>;
    validateVatNumber(vatNumber: any): Promise<any>;
    completeKYC(merchantID: any, kycDto: any): Promise<{
        message: string;
    }>;
    updateVoucherPinCode(merchantID: any, voucherPinCodeDto: any): Promise<{
        message: string;
    }>;
    updateMerchantprofile(merchantID: any, usersDto: any): Promise<{
        message: string;
    }>;
    updateCustomerProfile(customerID: any, usersDto: any): Promise<{
        message: string;
    }>;
    getCustomer(id: any): Promise<any>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: any): Promise<import("mongodb").UpdateResult>;
    getUserById(id: any): Promise<any>;
    getMerchantByID(merchantID: any): Promise<any>;
    getMerchantStats(id: any): Promise<any>;
    getAllUsers(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    searchAllAffiliates(searchAffiliates: any, categories: any, Affiliates: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getPopularAffiliates(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getFavouriteAffiliates(offset: any, limit: any, req: any): Promise<{
        totalCount: any;
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
        enquiryID: any;
        merchantID: string;
    }>;
    approveAffiliate(userID: any, affliateID: any): Promise<{
        enquiryID: any;
        affliateID: string;
    }>;
    getCustomerByID(customerID: any): Promise<any>;
    updatePasswordForAllMerchant(): Promise<void>;
}
