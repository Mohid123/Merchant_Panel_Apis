import { Module } from '@nestjs/common';
import { UtilController } from './utils.controller';
import { UtilService } from './utils.service';

@Module({
  controllers: [UtilController],
  providers: [UtilService],
})
export class UtilModule {}
