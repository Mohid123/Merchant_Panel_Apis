import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscribeDTO } from 'src/dto/subscribe/subscribe.dto';
import { SubscribeService } from './subscribe.service';

@ApiTags('Subscription')
@Controller('subscribe')
export class SubscribeController {
    constructor(private readonly _subscribeService: SubscribeService) {}

    @Post('addSubscription')
    addSubscribe (@Body() subscribeDto:SubscribeDTO) {
        return this._subscribeService.addSubscription(subscribeDto)
    }

    @Post('deleteSubscription/:id')
    deleteSubscription (@Param('id') id: string) {
        return this._subscribeService.deleteSubscription(id)
    }

    @Get('getSubscription/:email')
    getSubscription (@Param('email') email: string) {
        return this._subscribeService.getSubscription(email)
    }

    @Get('getAllSubscriptions')
    getAllSubscriptions (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        return this._subscribeService.getAllSubscriptions(offset, limit)
    }
}
