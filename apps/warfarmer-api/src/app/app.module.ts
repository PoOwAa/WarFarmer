import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WfmarketModule } from '../wfmarket/wfmarket.module';
import { ArcaneModule } from '../arcane/arcane.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DbModule } from '../db/db.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    DbModule,
    WfmarketModule,
    ArcaneModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
