import { Injectable, Logger } from '@nestjs/common';
import { ArcaneService } from './arcane.service';
import { DbService } from '../db/db.service';
import { ArcanePrices } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ArcaneCleanupService {
  private readonly logger = new Logger(ArcaneCleanupService.name);

  constructor(
    private readonly arcaneService: ArcaneService,
    private readonly dbService: DbService
  ) {}

  @Cron('30 12 * * *')
  async aggregateOldArcanePrices() {
    this.logger.debug('Aggregating old arcane prices...');

    // endDate should be the last date of the last week
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay());

    const arcaneProto = await this.dbService.client.arcane.findMany();

    // Aggregate prices for each arcane
    for (const arcane of arcaneProto) {
      try {
        this.logger.debug(
          `########## Aggregating prices for arcane ${arcane.id} - ${arcane.name} ##########`
        );
        await this.aggregatePrices(arcane.id, endDate);
      } catch (e) {
        this.logger.error(
          `Error aggregating prices for arcane ${arcane.id} - ${arcane.name}`,
          e
        );
        continue;
      }
    }

    this.logger.debug('Aggregating old arcane prices DONE');
  }

  private async aggregatePrices(arcaneId: number, endDate: Date) {
    const arcanes = await this.dbService.client.arcanePrices.findMany({
      where: {
        arcaneId,
      },
    });

    if (arcanes.length === 0) {
      return;
    }

    const { idsToDelete, pricesToInsert } = this.processArcanes(
      arcaneId,
      arcanes,
      endDate
    );

    await this.dbService.client.arcanePrices.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    // Insert the aggregated price
    await this.dbService.client.arcanePrices.createMany({
      data: pricesToInsert,
    });
  }

  private processArcanes(
    arcaneId: number,
    prices: ArcanePrices[],
    endDate: Date
  ) {
    // Chunk arcane prices by day
    const pricesByDay = {};

    for (const arcane of prices) {
      if (arcane.date > endDate) {
        continue;
      }
      const date = arcane.date.toISOString().split('T')[0];

      if (!pricesByDay[date]) {
        pricesByDay[date] = [];
      }

      pricesByDay[date].push(arcane);
    }

    const idsToDelete: number[] = [];
    const pricesToInsert = [];

    // Aggregate daily prices
    for (const date in pricesByDay) {
      const prices = pricesByDay[date];

      if (prices.length === 1) {
        continue;
      }

      // Calculate average sellPrice

      const sellPrice = prices.reduce(
        (acc, curr) => {
          return {
            sell10: acc.sell10 + curr.sellPrice.sell10,
            sell25: acc.sell25 + curr.sellPrice.sell25,
            sell50: acc.sell50 + curr.sellPrice.sell50,
            sell100: acc.sell100 + curr.sellPrice.sell100,
            sell250: acc.sell250 + curr.sellPrice.sell250,
            sell500: acc.sell500 + curr.sellPrice.sell500,
          };
        },
        {
          sell10: 0,
          sell25: 0,
          sell50: 0,
          sell100: 0,
          sell250: 0,
          sell500: 0,
        }
      );

      sellPrice.sell10 /= prices.length;
      sellPrice.sell25 /= prices.length;
      sellPrice.sell50 /= prices.length;
      sellPrice.sell100 /= prices.length;
      sellPrice.sell250 /= prices.length;
      sellPrice.sell500 /= prices.length;

      const vosforPerPlat = prices.reduce(
        (acc, curr) => {
          return {
            sell10: acc.sell10 + curr.vosforPerPlat.sell10,
            sell25: acc.sell25 + curr.vosforPerPlat.sell25,
            sell50: acc.sell50 + curr.vosforPerPlat.sell50,
            sell100: acc.sell100 + curr.vosforPerPlat.sell100,
            sell250: acc.sell250 + curr.vosforPerPlat.sell250,
            sell500: acc.sell500 + curr.vosforPerPlat.sell500,
          };
        },
        {
          sell10: 0,
          sell25: 0,
          sell50: 0,
          sell100: 0,
          sell250: 0,
          sell500: 0,
        }
      );

      vosforPerPlat.sell10 /= prices.length;
      vosforPerPlat.sell25 /= prices.length;
      vosforPerPlat.sell50 /= prices.length;
      vosforPerPlat.sell100 /= prices.length;
      vosforPerPlat.sell250 /= prices.length;
      vosforPerPlat.sell500 /= prices.length;

      idsToDelete.push(...prices.map((p) => p.id));
      pricesToInsert.push({
        arcaneId,
        date: new Date(date),
        sellPrice,
        vosforPerPlat,
      });
    }

    return {
      idsToDelete,
      pricesToInsert,
    };
  }
}
