import { Controller, Get } from '@nestjs/common';
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
    return this.arcaneService.getFormattedArcaneList();
  }
}
