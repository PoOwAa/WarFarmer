import { Injectable } from '@nestjs/common';
import Items, { Arcane } from 'warframe-items';
import { ArcaneCollection, WFArcane } from './arcane.interface';
import { WfmarketService } from '../wfmarket/wfmarket.service';
import { arcaneCollection } from './arcaneCollection';

@Injectable()
export class ArcaneService {
  private readonly arcaneCollection = arcaneCollection;

  constructor(private readonly wfMarketService: WfmarketService) {}

  getArcaneListRaw(): Arcane[] {
    const items = new Items({
      category: ['Arcanes'],
    });

    // warframe-items includes more than just arcanes in the Arcanes category
    const arcanes = items
      .filter((arcane) => arcane.name !== 'Arcane')
      .filter((arcane) => arcane.category === 'Arcanes') as Arcane[];

    // warframe-items doesn't include common rarity for arcanes
    return arcanes.map((arcane) => {
      if (!arcane.rarity) {
        arcane.rarity = 'Common';
      }

      return arcane;
    });
  }

  async getFormattedArcaneList(): Promise<WFArcane[]> {
    const rawArcanes = this.getArcaneListRaw();

    const wfMarketItems = await this.wfMarketService.items();

    return rawArcanes.map((arcane) => {
      const wfMarketItem = wfMarketItems.find(
        (item) => item.item_name === arcane.name
      );

      return {
        name: arcane.name,
        imageName: arcane.imageName,
        drops: arcane.drops,
        levelStats: arcane.levelStats,
        rarity: arcane.rarity,
        tradeable: arcane.tradable,
        urlName: wfMarketItem ? wfMarketItem.url_name : 'MISSING',
        collection: this.getArcaneCollection(arcane.name),
      };
    });
  }

  private getArcaneCollection(arcaneName: string): ArcaneCollection {
    for (const collection in this.arcaneCollection) {
      if (this.arcaneCollection[collection].includes(arcaneName)) {
        return collection as ArcaneCollection;
      }
    }
  }
}
