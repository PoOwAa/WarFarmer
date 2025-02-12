import { Injectable } from '@nestjs/common';
import { Rarity } from 'warframe-items';
import { arcaneCollection } from './arcaneCollection';
import { ArcaneVosforValue } from './vosfor';
import { DbService } from '../db/db.service';
import { ArcaneCollection, WFArcane } from '@warfarmer/types';
import { JsonArray } from '@prisma/client/runtime/library';

@Injectable()
export class ArcaneService {
  private readonly arcaneCollection = arcaneCollection;

  constructor(private readonly dbService: DbService) {}

  async getArcane(name: string) {
    const arcane = await this.dbService.client.arcane.findFirst({
      where: {
        name,
      },
    });

    return arcane;
  }

  async getArcaneList() {
    const arcanes = await this.dbService.client.arcane.findMany();

    return arcanes;
  }

  async getArcaneWithLatestPrices(name: string) {
    const arcane = await this.dbService.client.arcane.findFirst({
      where: {
        urlName: name,
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

    return arcane;
  }

  async getArcanesWithLatestPrices() {
    const arcanes = await this.dbService.client.arcane.findMany({
      include: {
        ArcanePrices: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    return arcanes;
  }

  async getArcanesWithOldestPrices() {
    const arcanes = await this.dbService.client.arcane.findMany({
      include: {
        ArcanePrices: {
          orderBy: {
            date: 'asc',
          },
          take: 1,
        },
      },
    });

    return arcanes;
  }

  async getArcanePricesByDate(name: string, startDate: Date, endDate: Date) {
    const arcanePrices = await this.dbService.client.arcanePrices.findMany({
      where: {
        arcane: {
          urlName: name,
        },
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    return arcanePrices;
  }

  async upsertArcane(arcane: WFArcane) {
    const arcaneInDb = await this.dbService.client.arcane.findFirst({
      where: {
        name: arcane.name,
      },
    });

    if (!arcaneInDb) {
      const newArcane = await this.dbService.client.arcane.create({
        data: {
          name: arcane.name,
          imageName: arcane.imageName,
          drops: arcane.drops as unknown as JsonArray,
          levelStats: arcane.levelStats as unknown as JsonArray,
          rarity: arcane.rarity,
          tradeable: arcane.tradeable,
          urlName: arcane.urlName,
          collection: arcane.collection,
          vosfor: arcane.vosfor,
        },
      });

      return newArcane;
    }

    await this.dbService.client.arcane.update({
      data: {
        name: arcane.name,
        imageName: arcane.imageName,
        drops: arcane.drops as unknown as JsonArray,
        levelStats: arcane.levelStats as unknown as JsonArray,
        rarity: arcane.rarity,
        tradeable: arcane.tradeable,
        urlName: arcane.urlName,
        collection: arcane.collection,
        vosfor: arcane.vosfor,
      },
      where: {
        id: arcaneInDb.id,
      },
    });

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
