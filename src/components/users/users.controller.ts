import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ResetPasswordDto } from 'src/dto/resetPasswordDto/resetPassword.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatepassword.dto';
import { USERSTATUS } from 'src/enum/user/userstatus.enum';
import { KycDto } from '../../dto/user/kyc.dto';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { UpdateMerchantProfileDto } from '../../dto/user/updatemerchantprofile.dto';
import { UsersDto } from '../../dto/user/users.dto';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post('addUser')
  addUser(@Body() usersDto: UsersDto) {
    return this._usersService.addUser(usersDto);
  }

  @Post('changePassword/:id')
  changePassword(
    @Param('id') id: string,
    @Body() updatepasswordDto: UpdatePasswordDto,
  ) {
    return this._usersService.changePassword(id, updatepasswordDto);
  }

  @Post('completeKYC/:merchantID')
  completeKYC(@Param('merchantID') merchantID: string, @Body() kycDto: KycDto) {
    return this._usersService.completeKYC(merchantID, kycDto);
  }

  @Post('updateMerchantprofile/:merchantID')
  updateMerchantprofile(
    @Param('merchantID') merchantID: string,
    @Body() usersDto: UpdateMerchantProfileDto) {
    return this._usersService.updateMerchantprofile(merchantID, usersDto);
  }

  @Post('updateBusinessHours')
  updateBusinessHours(@Body() updateHoursDTO: UpdateHoursDto) {
    return this._usersService.updateBusinessHours(updateHoursDTO);
  }

  @Post('deleteUser/:id')
  deleteUser(@Param('id') id: string) {
    return this._usersService.deleteUser(id);
  }

  @Get('getUserById/:id')
  geUserById(@Param('id') id: string) {
    return this._usersService.getUserById(id);
  }

  @Get('getMerchantStats/:id')
  getUserStats(@Param('id') id: string) {
    return this._usersService.getMerchantStats(id);
  }

  @Get('getAllUsers')
  getAllUsers(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this._usersService.getAllUsers(offset, limit);
  }

  @Post('/resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    return this._usersService.resetPassword(resetPasswordDto, req);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('getPendingUsers')
  getPendingUsers(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this._usersService.getPendingUsers(offset, limit);
  }

  @UseGuards(JwtAdminAuthGuard)
  @ApiQuery({ name: 'status', enum: USERSTATUS, required: false })
  @Get('approvePendingUsers/:userID')
  approvePendingUsers(
    @Query('status') status: USERSTATUS,
    @Param('userID') userID: string
  ) {
    return this._usersService.approvePendingUsers(status, userID);
  }

  @Post('validateVatNumber/:vatNumber')
  validateVatNumber (
    // @Param('countryCode') countryCode: string,
    @Param('vatNumber') vatNumber: string) {
    return this._usersService.validateVatNumber(vatNumber)
  }
}
