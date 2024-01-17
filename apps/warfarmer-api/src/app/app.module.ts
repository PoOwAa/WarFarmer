import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WfmarketModule } from '../wfmarket/wfmarket.module';
import { ArcaneModule } from '../arcane/arcane.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DbModule } from '../db/db.module';

@Module({
  imports: [ScheduleModule.forRoot(), DbModule, WfmarketModule, ArcaneModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
