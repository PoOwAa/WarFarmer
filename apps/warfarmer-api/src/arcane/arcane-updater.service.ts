import { Injectable, Logger } from '@nestjs/common';
import { WfmarketService } from '../wfmarket/wfmarket.service';
import { Cron } from '@nestjs/schedule';
import { ArcaneService } from './arcane.service';
import { WFMarketOrder } from '../wfmarket/wfmarket.types';
import Items, { Arcane } from 'warframe-items';
import { WFArcane } from './arcane.interface';
import { DbService } from '../db/db.service';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class ArcaneUpdaterService {
  private readonly logger = new Logger(ArcaneUpdaterService.name);
  private readonly orderSize: number = 100;

  constructor(
    private readonly wfMarketService: WfmarketService,
    private readonly arcaneService: ArcaneService,
    private readonly dbService: DbService
  ) {}

  @Cron('0 0 * * * *')
  async handleCron() {
    this.logger.debug('Updating arcanes...');
    const arcanes = await this.getFormattedArcaneList(true);
    this.logger.debug(`Fetching ${arcanes.length} arcanes DONE`);

    this.logger.debug(`Updating ${arcanes.length} arcanes in the database...`);
    for (const arcane of arcanes) {
      // check if arcane exists in the database
      const arcaneInDb = await this.arcaneService.upsertArcane(arcane);

      // add prices
      await this.dbService.arcanePrices.create({
        data: {
          arcaneId: arcaneInDb.id,
          sellPrice: JSON.stringify(arcane.sellPrice),
          vosforPerPlat: JSON.stringify(arcane.vosforPerPlat),
        },
      });
    }
    this.logger.debug(
      `Updating ${arcanes.length} arcanes in the database DONE`
    );

    return arcanes;
  }

  private async getFormattedArcaneList(
    withPrices: boolean
  ): Promise<WFArcane[]> {
    this.logger.debug(`Getting arcane list from warframe-items...`);
    const rawArcanes = this.getArcaneListRaw();

    this.logger.debug(`Getting items from warframe.market...`);
    const wfMarketItems = await this.wfMarketService.items();

    this.logger.debug(`Formatting arcane list...`);
    let counter = 0;
    const res = rawArcanes.map((arcane) => {
      counter++;
      if (counter % 10 === 0) {
        this.logger.debug(`Formatted ${counter} arcanes`);
      }
      const wfMarketItem = wfMarketItems.find(
        (item) => item.item_name === arcane.name
      );

      const collection = this.arcaneService.getArcaneCollection(arcane.name);

      return {
        name: arcane.name,
        imageName: arcane.imageName,
        drops: arcane.drops ?? [],
        levelStats: arcane.levelStats,
        rarity: arcane.rarity,
        tradeable: arcane.tradable,
        urlName: wfMarketItem ? wfMarketItem.url_name : 'MISSING',
        collection,
        vosfor: this.arcaneService.arcaneRarityToVosfor(
          collection,
          arcane.rarity
        ),
      };
    }) as WFArcane[];

    if (withPrices) {
      counter = 0;
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
        counter++;
        if (counter % 10 === 0) {
          this.logger.debug(`Fetched ${counter} arcane prices`);
        }
        await sleep(200);
      }
    }

    return res;
  }

  private async getOrderPrices(urlName: string) {
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

  private getArcaneListRaw(): Arcane[] {
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
          order.quantity *
          this.arcaneService.arcaneRankToQuantity(order.mod_rank),
        platinumPerPiece:
          order.platinum /
          this.arcaneService.arcaneRankToQuantity(order.mod_rank),
      }))
      .sort((a, b) => a.platinumPerPiece - b.platinumPerPiece)
      .slice(0, this.orderSize);
  }
}
