import { Injectable } from '@nestjs/common';
import { Rarity } from 'warframe-items';
import { ArcaneCollection, WFArcane } from './arcane.interface';
import { arcaneCollection } from './arcaneCollection';
import { ArcaneVosforValue } from './vosfor';
import { DbService } from '../db/db.service';

@Injectable()
export class ArcaneService {
  private readonly arcaneCollection = arcaneCollection;

  constructor(private readonly dbService: DbService) {}

  async getArcane(name: string) {
    const arcane = await this.dbService.arcane.findFirst({
      where: {
        name,
      },
    });

    arcane.drops = JSON.parse(arcane.drops);
    arcane.levelStats = JSON.parse(arcane.levelStats);

    return arcane;
  }

  async getArcaneList() {
    const arcanes = await this.dbService.arcane.findMany();

    for (const arcane of arcanes) {
      arcane.drops = JSON.parse(arcane.drops);
      arcane.levelStats = JSON.parse(arcane.levelStats);
    }

    return arcanes;
  }

  async getArcaneWithLatestPrices(name: string) {
    const arcane = await this.dbService.arcane.findFirst({
      where: {
        name,
      },
      include: {
        ArcanePrices: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    arcane.drops = JSON.parse(arcane.drops);
    arcane.levelStats = JSON.parse(arcane.levelStats);

    return arcane;
  }

  async getArcanesWithLatestPrices() {
    const arcanes = await this.dbService.arcane.findMany({
      include: {
        ArcanePrices: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    for (const arcane of arcanes) {
      arcane.drops = JSON.parse(arcane.drops);
      arcane.levelStats = JSON.parse(arcane.levelStats);
      for (const prices of arcane.ArcanePrices) {
        prices.sellPrice = JSON.parse(prices.sellPrice);
        prices.vosforPerPlat = JSON.parse(prices.vosforPerPlat);
      }
    }

    return arcanes;
  }

  async getArcanePricesByDate(name: string, startDate: Date, endDate: Date) {
    const arcanePrices = await this.dbService.arcanePrices.findMany({
      where: {
        arcane: {
          name,
        },
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    for (const prices of arcanePrices) {
      prices.sellPrice = JSON.parse(prices.sellPrice);
      prices.vosforPerPlat = JSON.parse(prices.vosforPerPlat);
    }

    return arcanePrices;
  }

  async upsertArcane(arcane: WFArcane) {
    const arcaneInDb = await this.dbService.arcane.findFirst({
      where: {
        name: arcane.name,
      },
    });

    if (!arcaneInDb) {
      const newArcane = await this.dbService.arcane.create({
        data: {
          name: arcane.name,
          imageName: arcane.imageName,
          drops: JSON.stringify(arcane.drops),
          levelStats: JSON.stringify(arcane.levelStats),
          rarity: arcane.rarity,
          tradeable: arcane.tradeable,
          urlName: arcane.urlName,
          collection: arcane.collection,
          vosfor: arcane.vosfor,
        },
      });

      return newArcane;
    }

    return arcaneInDb;
  }

  arcaneRarityToVosfor(collection: ArcaneCollection, rarity: Rarity): number {
    if (!collection) {
      return 0;
    }
    return ArcaneVosforValue[collection][rarity];
  }

  arcaneRankToQuantity(rank: number): number {
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

  getArcaneCollection(arcaneName: string): ArcaneCollection {
    for (const collection in this.arcaneCollection) {
      if (this.arcaneCollection[collection].includes(arcaneName)) {
        return collection as ArcaneCollection;
      }
    }
  }
}
