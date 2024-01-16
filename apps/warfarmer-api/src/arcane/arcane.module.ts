import { Module } from '@nestjs/common';
import { ArcaneService } from './arcane.service';
import { ArcaneController } from './arcane.controller';
import { WfmarketModule } from '../wfmarket/wfmarket.module';

@Module({
  imports: [WfmarketModule],
  providers: [ArcaneService],
  controllers: [ArcaneController],
})
export class ArcaneModule {}
