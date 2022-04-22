import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoiceSchema } from 'src/schema/invoices/invoices.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Invoices', schema: InvoiceSchema }
        ])
    ],
    controllers: [InvoicesController],
    providers: [InvoicesService]
})
export class InvoicesModule {}
