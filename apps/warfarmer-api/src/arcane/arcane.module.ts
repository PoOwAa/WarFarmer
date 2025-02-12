import { Module } from '@nestjs/common';
import { ArcaneService } from './arcane.service';
import { ArcaneController } from './arcane.controller';
import { WfmarketModule } from '../wfmarket/wfmarket.module';
import { ArcaneUpdaterService } from './arcane-updater.service';
import { DbModule } from '../db/db.module';
import { ArcaneCleanupService } from './arcane-cleanup.service';

@Module({
  imports: [WfmarketModule, DbModule],
  providers: [ArcaneService, ArcaneUpdaterService, ArcaneCleanupService],
  controllers: [ArcaneController],
})
export class ArcaneModule {}
