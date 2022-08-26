import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ViewsDto } from 'src/dto/views/views.dto';
import { ViewsService } from './views.service';

@ApiTags('Views')
@Controller('views')
export class ViewsController {
    constructor(private readonly viewsService:ViewsService) {}
    
    @Post('createDealView')
    createDealView (
        @Body() viewsDto: ViewsDto,
        @Req() req
    ) {
        return this.viewsService.createDealView(viewsDto, req)
    }

    @Get('getView/:id')
    getView (
        @Param('id') id: string
    ) {
        return this.viewsService.getView(id)
    }

    @Get('getAllViews')
    getAllViews (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10
    ) {
        return this.viewsService.getAllViews(offset, limit)
    }

    @Get('getAllViewsByCustomer/:customerID')
    getAllViewsByCustomer (
        @Param('customerID') customerID: string,
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10
    ) {
        return this.viewsService.getAllViewsByCustomer(customerID, offset, limit)
    }
}
