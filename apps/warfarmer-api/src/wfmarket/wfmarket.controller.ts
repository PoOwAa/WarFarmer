import { Controller, Get, Param } from '@nestjs/common';
import { WfmarketService } from './wfmarket.service';

@Controller('wfmarket')
export class WfmarketController {
  constructor(private readonly wfmarketService: WfmarketService) {}

  @Get('items')
  async items() {
    return await this.wfmarketService.items();
  }

  @Get('items/:item')
  async item(@Param('item') item: string) {
    return await this.wfmarketService.item(item);
  }

  @Get('items/:item/orders')
  async orders(@Param('item') item: string) {
    return await this.wfmarketService.orders(item);
  }
}
