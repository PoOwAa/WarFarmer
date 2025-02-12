import { Controller, Get, Param, Post } from '@nestjs/common';
import { ArcaneService } from './arcane.service';
import { ArcaneCleanupService } from './arcane-cleanup.service';

@Controller('arcane')
export class ArcaneController {
  constructor(
    private readonly arcaneService: ArcaneService,
    private readonly arcaneCleanup: ArcaneCleanupService
  ) {}

  @Get()
  async getFormattedArcaneList() {
    return this.arcaneService.getArcaneList();
  }

  @Get('prices')
  async getFormattedArcaneListWithPrices() {
    return this.arcaneService.getArcanesWithLatestPrices();
  }

  @Get(':name/prices')
  async getOrderPrices(@Param('name') name: string) {
    return this.arcaneService.getArcaneWithLatestPrices(name);
  }

  @Get(':name')
  async getOrder(@Param('name') name: string) {
    return this.arcaneService.getArcane(name);
  }

  @Get(':name/history')
  async getOrderHistory(
    @Param('name') name: string,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date
  ) {
    return this.arcaneService.getArcanePricesByDate(name, startDate, endDate);
  }

  @Post('aggregate')
  async aggregateOldPrices() {
    this.arcaneCleanup.aggregateOldArcanePrices();
    return {
      message: 'Aggregating old arcane prices...',
    };
  }
}
