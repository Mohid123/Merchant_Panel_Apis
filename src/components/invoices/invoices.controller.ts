import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO } from 'src/dto/invoices/invoices.dto';
import { INVOICEAMOUNTENUM } from 'src/enum/sorting/sortinvoiceamount.enum';
import { INVOICEDATEENUM } from 'src/enum/sorting/sortinvoicedate.enum';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
    constructor(private readonly _invoiceService:InvoicesService) {}

    @Post('createInvoice')
    createInvoice (@Body() invoiceDto:InvoiceDTO) {
        return this._invoiceService.createInvoice(invoiceDto)
    }

    @Get('getInvoice/:invoiceURL')
    getInvoice (
        @Param('invoiceURL') invoiceURL: string 
    ) {
        return this._invoiceService.getInvoice(invoiceURL)
    }

    @Get('getAllInvoices')
    getAllInvoices (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        return this._invoiceService.getAllInvoices(offset, limit)
    }

    @ApiQuery({ name: "dateFrom", type: Number, required: false })
    @ApiQuery({ name: "dateTo", type: Number, required: false })
    @ApiQuery({ name: "invoiceDate", enum: INVOICEDATEENUM, required: false })
    @ApiQuery({ name: "invoiceAmount", enum: INVOICEAMOUNTENUM, required: false })
    @Get('getAllInvoicesByMerchant/:merchantID')
    getAllInvoicesByMerchant (
        @Param('merchantID') merchantID: string,
        @Query("dateFrom") dateFrom: number = 0,
        @Query("dateTo") dateTo: number = 0,
        @Query("invoiceDate") invoiceDate: INVOICEDATEENUM,
        @Query("invoiceAmount") invoiceAmount: INVOICEAMOUNTENUM,
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        return this._invoiceService.getAllInvoicesByMerchant(merchantID, dateFrom, dateTo, invoiceDate, invoiceAmount, offset, limit)
    }
}
