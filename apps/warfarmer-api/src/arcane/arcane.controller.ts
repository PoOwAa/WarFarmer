import { Controller, Get, Param } from '@nestjs/common';
import { ArcaneService } from './arcane.service';

@Controller('arcane')
export class ArcaneController {
  constructor(private readonly arcaneService: ArcaneService) {}

  @Get('raw')
  async getArcaneListRaw() {
    return this.arcaneService.getArcaneListRaw();
  }

  @Get()
  async getFormattedArcaneList() {
    return this.arcaneService.getFormattedArcaneList(true);
  }

  @Get(':name/prices')
  async getOrderPrices(@Param('name') name: string) {
    return this.arcaneService.getOrderPrices(name);
  }
}
