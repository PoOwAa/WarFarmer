import { Module } from '@nestjs/common';
import { WfmarketService } from './wfmarket.service';
import { WfmarketController } from './wfmarket.controller';

@Module({
  providers: [WfmarketService],
  controllers: [WfmarketController],
  exports: [WfmarketService],
})
export class WfmarketModule {}
