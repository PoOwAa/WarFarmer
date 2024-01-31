import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService implements OnModuleInit {
  client: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new PrismaClient({
      datasourceUrl: this.configService.get<string>('database.url'),
    });
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
