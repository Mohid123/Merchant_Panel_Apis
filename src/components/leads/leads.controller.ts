import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LeadDto } from 'src/dto/lead/lead.dto';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtManagerAuthGuard } from '../auth/jwt-manager-auth.guard';
import { LeadsService } from './leads.service';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly _leadsService: LeadsService) {}

  @Post('createLead')
  createLead(@Body() leadDto: LeadDto) {
    return this._leadsService.createLead(leadDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getLead/:id')
  getLead(@Param('id') id: string) {
    return this._leadsService.getLead(id);
  }
}
