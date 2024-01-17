import { Injectable } from '@nestjs/common';
import Items, { Arcane, Rarity } from 'warframe-items';
import { ArcaneCollection, WFArcane } from './arcane.interface';
import { WfmarketService } from '../wfmarket/wfmarket.service';
import { arcaneCollection } from './arcaneCollection';
import { WFMarketOrder } from '../wfmarket/wfmarket.types';
import { ArcaneVosforValue } from './vosfor';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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

  async getFormattedArcaneList(withPrices: boolean): Promise<WFArcane[]> {
    const rawArcanes = this.getArcaneListRaw();

    const wfMarketItems = await this.wfMarketService.items();

    const res = rawArcanes.map((arcane) => {
      const wfMarketItem = wfMarketItems.find(
        (item) => item.item_name === arcane.name
      );

      const collection = this.getArcaneCollection(arcane.name);

      return {
        name: arcane.name,
        imageName: arcane.imageName,
        drops: arcane.drops,
        levelStats: arcane.levelStats,
        rarity: arcane.rarity,
        tradeable: arcane.tradable,
        urlName: wfMarketItem ? wfMarketItem.url_name : 'MISSING',
        collection,
        vosfor: this.arcaneRarityToVosfor(collection, arcane.rarity),
      };
    }) as WFArcane[];

    if (withPrices) {
      for (const arcane of res) {
        arcane.sellPrice = await this.getOrderPrices(arcane.urlName);
        arcane.vosforPerPlat = {
          sell10: arcane.vosfor / arcane.sellPrice.sell10,
          sell25: arcane.vosfor / arcane.sellPrice.sell25,
          sell50: arcane.vosfor / arcane.sellPrice.sell50,
          sell100: arcane.vosfor / arcane.sellPrice.sell100,
          sell250: arcane.vosfor / arcane.sellPrice.sell250,
          sell500: arcane.vosfor / arcane.sellPrice.sell500,
        };
        await sleep(200);
      }
    }

    return res;
  }

  async getOrderPrices(urlName: string) {
    const orders = await this.wfMarketService.orders(urlName);

    if (!orders) {
      return {
        sell10: 0,
        sell25: 0,
        sell50: 0,
        sell100: 0,
        sell250: 0,
        sell500: 0,
      };
    }

    const sellOrders = this.filterAndSortOrders(
      orders.filter((order) => order.order_type === 'sell')
    );

    return {
      sell10: this.calculatePrice(sellOrders, 10),
      sell25: this.calculatePrice(sellOrders, 25),
      sell50: this.calculatePrice(sellOrders, 50),
      sell100: this.calculatePrice(sellOrders, 100),
      sell250: this.calculatePrice(sellOrders, 250),
      sell500: this.calculatePrice(sellOrders, 500),
    };
  }

  private calculatePrice(orders: WFMarketOrder[], sampleSize: number) {
    const prices = orders
      .map((order) => {
        return Array.from(
          { length: order.realQuantity },
          () => order.platinumPerPiece
        );
      })
      .flat()
      .slice(0, sampleSize);

    return prices.reduce((a, b) => a + b, 0) / prices.length;
  }

  private filterAndSortOrders(orders: WFMarketOrder[]) {
    return orders
      .filter((order) => order.mod_rank !== 1)
      .filter((order) => {
        const lastSeen = new Date(order.user.last_seen);
        const now = new Date();

        return now.getTime() - lastSeen.getTime() < 1000 * 60 * 60 * 24 * 3;
      })
      .map((order) => ({
        ...order,
        realQuantity:
          order.quantity * this.arcaneRankToQuantity(order.mod_rank),
        platinumPerPiece:
          order.platinum / this.arcaneRankToQuantity(order.mod_rank),
      }))
      .sort((a, b) => a.platinumPerPiece - b.platinumPerPiece)
      .slice(0, 100);
  }

  private arcaneRarityToVosfor(
    collection: ArcaneCollection,
    rarity: Rarity
  ): number {
    if (!collection) {
      return 0;
    }
    return ArcaneVosforValue[collection][rarity];
  }

  private arcaneRankToQuantity(rank: number): number {
    switch (rank) {
      case 0:
        return 1;
      case 1:
        return 3;
      case 2:
        return 6;
      case 3:
        return 10;
      case 4:
        return 15;
      case 5:
        return 21;
      default:
        return 0;
    }
  }

  private getArcaneCollection(arcaneName: string): ArcaneCollection {
    for (const collection in this.arcaneCollection) {
      if (this.arcaneCollection[collection].includes(arcaneName)) {
        return collection as ArcaneCollection;
      }
    }
  }
}
