/// <reference types="mongoose" />
import { KycDto } from 'src/dto/user/kyc.dto';
import { UpdateHoursDto } from 'src/dto/user/updatehours.dto';
import { UsersDto } from '../../dto/user/users.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly _usersService;
    constructor(_usersService: UsersService);
    addUser(usersDto: UsersDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/user/users.interface").UsersInterface> & import("../../interface/user/users.interface").UsersInterface & {
        _id: string;
    }>;
    completeKYC(kycDto: KycDto): Promise<import("mongodb").UpdateResult>;
    updateUser(usersDto: UsersDto): Promise<import("mongodb").UpdateResult>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: string): Promise<import("mongodb").UpdateResult>;
    geUserById(id: string): Promise<any[]>;
    getAllUsers(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
