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
import { ThrottlerGuard } from '@nestjs/throttler';
import { ResetPasswordDto } from 'src/dto/resetPasswordDto/resetPassword.dto';
import { ApproveMerchantDTO } from 'src/dto/user/approveMerchant.dto';
import { IsPasswordExistsDto } from 'src/dto/user/is-password-exists.dto';
import { UpdateCustomerProfileDto } from 'src/dto/user/updatecustomerprofile.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatepassword.dto';
import { VoucherPinCodeDto } from 'src/dto/user/voucherpincode.dto';
import { SORT } from 'src/enum/sort/sort.enum';
import { USERSTATUS } from 'src/enum/user/userstatus.enum';
import { KycDto } from '../../dto/user/kyc.dto';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { UpdateMerchantProfileDto } from '../../dto/user/updatemerchantprofile.dto';
import { UsersDto } from '../../dto/user/users.dto';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtManagerAuthGuard } from '../auth/jwt-manager-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('addUser')
  addUser(@Body() usersDto: UsersDto) {
    return this._usersService.addUser(usersDto);
  }

  @UseGuards(ThrottlerGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('comparePassword/:userID')
  comparePassword(
    @Param('userID') userID: string,
    @Body() isPasswordExistsDto: IsPasswordExistsDto,
  ) {
    return this._usersService.comparePassword(userID, isPasswordExistsDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('changePassword/:id')
  changePassword(
    @Param('id') id: string,
    @Body() updatepasswordDto: UpdatePasswordDto,
  ) {
    return this._usersService.changePassword(id, updatepasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('completeKYC/:merchantID')
  completeKYC(@Param('merchantID') merchantID: string, @Body() kycDto: KycDto) {
    return this._usersService.completeKYC(merchantID, kycDto);
  }

  @Post('updateVoucherPinCode/:merchantID')
  updateVoucherPinCode(
    @Param('merchantID') merchantID: string,
    @Body() voucherPinCodeDto: VoucherPinCodeDto,
  ) {
    return this._usersService.updateVoucherPinCode(
      merchantID,
      voucherPinCodeDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('updateMerchantprofile/:merchantID')
  updateMerchantprofile(
    @Param('merchantID') merchantID: string,
    @Body() usersDto: UpdateMerchantProfileDto,
  ) {
    return this._usersService.updateMerchantprofile(merchantID, usersDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('updateCustomerProfile/:customerID')
  updateCustomerProfile(
    @Param('customerID') customerID: string,
    @Body() usersDto: UpdateCustomerProfileDto,
  ) {
    return this._usersService.updateCustomerProfile(customerID, usersDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('updateBusinessHours')
  updateBusinessHours(@Body() updateHoursDTO: UpdateHoursDto) {
    return this._usersService.updateBusinessHours(updateHoursDTO);
  }

  // @Post('deleteUser/:id')
  // deleteUser(@Param('id') id: string) {
  //   return this._usersService.deleteUser(id);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getUserById/:id')
  geUserById(@Param('id') id: string) {
    return this._usersService.getUserById(id);
  }

  @Get('getMerchantByID/:merchantID')
  getMerchantByID(@Param('merchantID') merchantID: string) {
    return this._usersService.getMerchantByID(merchantID);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getMerchantStats/:id')
  getUserStats(@Param('id') id: string) {
    return this._usersService.getMerchantStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getAllUsers')
  getAllUsers(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this._usersService.getAllUsers(offset, limit);
  }

  @ApiQuery({ name: 'searchAffiliates', required: false })
  @ApiQuery({ name: 'sortAffiliates', enum: SORT, required: false })
  @ApiQuery({ name: 'categories', required: false })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('searchAllAffiliates')
  searchAllAffiliates(
    @Query('searchAffiliates') searchAffiliates: string = '',
    @Query('categories') categories: string = '',
    @Query('sortAffiliates') sortAffiliates: SORT,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this._usersService.searchAllAffiliates(
      searchAffiliates,
      categories,
      sortAffiliates,
      offset,
      limit,
      req,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getPopularAffiliates')
  getPopularAffiliates(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this._usersService.getPopularAffiliates(offset, limit, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getFavouriteAffiliates')
  getFavouriteAffiliates(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this._usersService.getFavouriteAffiliates(offset, limit, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    return this._usersService.resetPassword(resetPasswordDto, req);
  }

  // @UseGuards(JwtAdminAuthGuard)
  // @ApiBearerAuth()
  @Get('getPendingUsers')
  getPendingUsers(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this._usersService.getPendingUsers(offset, limit);
  }

  // @UseGuards(JwtAdminAuthGuard)
  // @ApiBearerAuth()
  @ApiQuery({ name: 'status', enum: USERSTATUS, required: false })
  @Get('approvePendingUsers/:userID')
  approvePendingUsers(
    @Query('status') status: USERSTATUS,
    @Param('userID') userID: string,
  ) {
    return this._usersService.approvePendingUsers(status, userID);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('validateVatNumber/:vatNumber')
  validateVatNumber(
    // @Param('countryCode') countryCode: string,
    @Param('vatNumber') vatNumber: string,
  ) {
    return this._usersService.validateVatNumber(vatNumber);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'id', required: false })
  @Post('approveMerchant')
  approveMerchant(
    @Query('id') id: string,
    @Body() approveMerchantDto: ApproveMerchantDTO,
  ) {
    return this._usersService.approveMerchant(id, approveMerchantDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'id', required: false })
  @Post('approveAffiliate')
  approveAffiliate(
    @Query('id') id: string,
    @Body() approveAffiliateDto: ApproveMerchantDTO,
  ) {
    return this._usersService.approveAffiliate(id, approveAffiliateDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getCustomerByID/:customerID')
  getCustomerByID(@Param('customerID') customerID: string) {
    return this._usersService.getCustomerByID(customerID);
  }
}
