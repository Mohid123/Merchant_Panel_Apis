import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CamapaignDto } from 'src/dto/campaign/campaign.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignService } from './campaign.service';

@ApiTags('Campaign')
@Controller('campaign')
export class CampaignController {
    constructor (private readonly camapaignService: CampaignService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('createCampaign')
    createCampaign (
        @Body() campaignDto: CamapaignDto,
        @Req() req
    ) {
        return this.camapaignService.createCampaign(campaignDto, req);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('editCampaign/:id')
    editCampaign (
        @Param('id') id: string,
        @Body() campaignDto: CamapaignDto,
    ) {
        return this.camapaignService.editCampaign(id, campaignDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('deleteCampaign/:id')
    deleteCampaign (@Param('id') id: string) {
        return this.camapaignService.deleteCampaign(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getCampaign/:id')
    getCampaign (
        @Param('id') id: string,
        @Req() req
    ) {
        return this.camapaignService.getCampaign(id, req)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getActiveCampaignByAffiliate')
    getActiveCampaignByAffiliate (
        @Req() req
    ) {
        return this.camapaignService.getActiveCampaignByAffiliate(req)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getAllCampaignsByAffiliate')
    getAllCampaignsByAffiliate (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
        @Req() req
    ) {
        return this.camapaignService.getAllCampaignsByAffiliate(offset, limit, req)
    }
}
