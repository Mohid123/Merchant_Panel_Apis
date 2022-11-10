/// <reference types="mongoose" />
import { ResetPasswordDto } from 'src/dto/resetPasswordDto/resetPassword.dto';
import { ApproveMerchantDTO } from 'src/dto/user/approveMerchant.dto';
import { UpdateAffiliateProfileDto } from 'src/dto/user/updateaffiliateprofile.dto';
import { UpdateCustomerProfileDto } from 'src/dto/user/updatecustomerprofile.dto';
import { UpdateMerchantFromCrmDto } from 'src/dto/user/updatemerchantfromcrm.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatepassword.dto';
import { VoucherPinCodeDto } from 'src/dto/user/voucherpincode.dto';
import { SORT } from 'src/enum/sort/sort.enum';
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
    completeKYC(id: string, kycDto: KycDto): Promise<{
        message: string;
    }>;
    updateVoucherPinCode(merchantID: string, voucherPinCodeDto: VoucherPinCodeDto): Promise<{
        message: string;
    }>;
    updateMerchantprofile(merchantID: string, usersDto: UpdateMerchantProfileDto): Promise<{
        message: string;
    }>;
    updateAffiliateProfile(affiliateID: string, usersDto: UpdateAffiliateProfileDto): Promise<{
        message: string;
    }>;
    updateCustomerProfile(customerID: string, usersDto: UpdateCustomerProfileDto): Promise<{
        message: string;
    }>;
    getCustomer(id: string): Promise<any>;
    getAffiliate(id: string): Promise<any>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    geUserById(id: string): Promise<any>;
    getMerchantByID(merchantID: string): Promise<any>;
    getMerchantForCRM(merchantID: string): Promise<any>;
    updateMerchantFromCRM(merchantID: string, updateMerchantFromCrmDto: UpdateMerchantFromCrmDto): Promise<{
        message: string;
    }>;
    getUserStats(id: string): Promise<any>;
    getAllUsers(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    searchAllAffiliates(searchAffiliates: string, categories: string, sortAffiliates: SORT, offset: number, limit: number, req: any): Promise<{
        totalCount: any;
        filteredCount: any;
        data: any[];
    }>;
    getPopularAffiliates(offset: number, limit: number, req: any): Promise<{
        totalCount: any;
        data: any[];
    }>;
    getFavouriteAffiliates(offset: number, limit: number, req: any): Promise<{
        totalCount: any;
        data: any[];
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, req: any): Promise<{
        message: string;
    }>;
    getPendingUsers(offset?: number, limit?: number): Promise<{
        totalPendingUsers: number;
        pendingUsers: any[];
    }>;
    approvePendingMerchants(status: USERSTATUS, userID: string): Promise<{
        message: string;
    }>;
    approvePendingAffiliates(status: USERSTATUS, userID: string): Promise<{
        message: string;
    }>;
    validateVatNumber(vatNumber: string): Promise<any>;
    approveMerchant(id: string, approveMerchantDto: ApproveMerchantDTO): Promise<{
        enquiryID: any;
        merchantID: string;
    }>;
    approveAffiliate(id: string, approveAffiliateDto: ApproveMerchantDTO): Promise<{
        enquiryID: any;
        affliateID: string;
    }>;
    getCustomerByID(customerID: string): Promise<any>;
}
