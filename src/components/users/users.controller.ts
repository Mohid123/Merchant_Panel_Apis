import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersDto } from 'src/dto/user/users.dto';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly _usersService:UsersService) {}
   
     @Post('addUser')
     addUser (@Body() usersDto:UsersDto) {
        return this._usersService.addUser(usersDto)
     }

     @Post('updateUser')
     updateUser (@Body() usersDto:UsersDto) {
        return this._usersService.updateUser(usersDto)
     }

     @Post('deleteUser/:id')
     deleteUser (@Param('id') id:string) {
        return this._usersService.deleteUser(id)
     }

     @Get('geUserById/:id')
     geUserById (@Param('id') id:string) {
        return this._usersService.geUserById(id)
     }

     @Get('getAllUsers')
     getAllUsers (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10
     ) {
        return this._usersService.getAllUsers(offset, limit)
     }
}
