import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoiceSchema } from '../../schema/invoices/invoices.schema';
import { VoucherCounterSchema } from '../../schema/vouchers/vouchersCounter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Invoices', schema: InvoiceSchema },
      { name: 'Counter', schema: VoucherCounterSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
