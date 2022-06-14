import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AMOUNTENUM } from '../../enum/sorting/sortamount.enum';
import { NAMEENUM } from '../../enum/sorting/sortcustomername.enum';
import { FEEENUM } from '../../enum/sorting/sortfee.enum';
import { NETENUM } from '../../enum/sorting/sortnet.enum';
import { TRANSACTIONDATEENUM } from '../../enum/sorting/sorttransactiondate.enum';
import { VOUCHERSTATUSENUM } from '../../enum/voucher/voucherstatus.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly _orderService:OrdersService) {}

    @Post('addOrder')
    addOrder () {}

    @Get('getOrder')
    getOrder () {}

    @Get('getAllOrder')
    getAllOrder () {}

    @ApiQuery({ name: "dateFrom", type: Number, required: false })
    @ApiQuery({ name: "dateTo", type: Number, required: false })
    @ApiQuery({ name: "Name", enum: NAMEENUM, required: false })
    @ApiQuery({ name: "Date", enum: TRANSACTIONDATEENUM, required: false })
    @ApiQuery({ name: "Amount", enum: AMOUNTENUM, required: false})
    @ApiQuery({ name: "Fee", enum: AMOUNTENUM, required: false})
    @ApiQuery({ name: "Net", enum: NETENUM, required: false})
    @ApiQuery({ name: "filterStatus", enum: VOUCHERSTATUSENUM, required: false })
    @Get('getAllOrderByMerchant/:merchantID')
    getAllOrderByMerchant (
        @Param('merchantID') merchantID: string,
        @Query("dateFrom") dateFrom: number = 0,
        @Query("dateTo") dateTo: number = 0,
        @Query("Name") Name: NAMEENUM,
        @Query("Date") Date: TRANSACTIONDATEENUM,
        @Query("Amount") Amount: AMOUNTENUM,
        @Query("Fee") Fee: FEEENUM,
        @Query("Net") Net: NETENUM,
        @Query("filterStatus") filterStatus: VOUCHERSTATUSENUM,
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 10
    ) {
        return this._orderService.getOrdersByMerchant(merchantID, dateFrom, dateTo, Name, Date, Amount, Fee, Net, filterStatus, offset, limit)
    }
}
