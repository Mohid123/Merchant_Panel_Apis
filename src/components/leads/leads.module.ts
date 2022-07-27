import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadSchema } from 'src/schema/lead/lead.schema';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Lead', schema: LeadSchema }])],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
