import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeadDto } from 'src/dto/lead/lead.dto';
import { LeadsService } from './leads.service';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly _leadsService: LeadsService) {}

  @Post('createLead')
  createLead(@Body() leadDto: LeadDto) {
    return this._leadsService.createLead(leadDto);
  }
}
