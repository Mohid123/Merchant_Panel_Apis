import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MultipleInvoicesDto } from 'src/dto/invoices/multipleinvoices.dto';
import { InvoiceDTO } from '../../dto/invoices/invoices.dto';
import { BILLINGSTATUS } from '../../enum/billing/billingStatus.enum';
import { INVOICEAMOUNTENUM } from '../../enum/sorting/sortinvoiceamount.enum';
import { INVOICEDATEENUM } from '../../enum/sorting/sortinvoicedate.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoicesService } from './invoices.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly _invoiceService: InvoicesService) {}

  @Post('createInvoice')
  createInvoice(@Body() invoiceDto: InvoiceDTO) {
    return this._invoiceService.createInvoice(invoiceDto);
  }

  @Get('getInvoice/:invoiceURL')
  getInvoice(@Param('invoiceURL') invoiceURL: string) {
    return this._invoiceService.getInvoice(invoiceURL);
  }

  @Get('getAllInvoices')
  getAllInvoices(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this._invoiceService.getAllInvoices(offset, limit);
  }

  @ApiQuery({ name: 'dateFrom', type: Number, required: false })
  @ApiQuery({ name: 'dateTo', type: Number, required: false })
  @ApiQuery({ name: 'invoiceDate', enum: INVOICEDATEENUM, required: false })
  @ApiQuery({ name: 'invoiceAmount', enum: INVOICEAMOUNTENUM, required: false })
  @ApiQuery({ name: 'status', enum: BILLINGSTATUS, required: false })
  @Get('getAllInvoicesByMerchant/:merchantID')
  getAllInvoicesByMerchant(
    @Param('merchantID') merchantID: string,
    @Query('dateFrom') dateFrom: number = 0,
    @Query('dateTo') dateTo: number = 0,
    @Query('invoiceDate') invoiceDate: INVOICEDATEENUM,
    @Query('invoiceAmount') invoiceAmount: INVOICEAMOUNTENUM,
    @Query('status') status: INVOICEAMOUNTENUM,
    @Query("invoiceID") invoiceID: string = "",
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() multipleInvoicesDto: MultipleInvoicesDto
  ) {
    return this._invoiceService.getAllInvoicesByMerchant(
      merchantID,
      dateFrom,
      dateTo,
      invoiceDate,
      invoiceAmount,
      status,
      invoiceID,
      offset,
      limit,
      multipleInvoicesDto
    );
  }
}
